import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { StaffEntity } from '../staff/entities/staff.entity'
import { LoginDto } from './dto/login.dto'
import {
  StaffProfileDto,
  LoginResponseDto,
  RefreshResponseDto,
} from './dto/auth-response.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Private helpers ────────────────────────────────────────────────────────

  private sanitizeStaff(staff: StaffEntity): StaffProfileDto {
    return {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
      createdAt: staff.createdAt,
    }
  }

  private signAccessToken(staff: StaffEntity): string {
    return this.jwt.sign(
      { sub: staff.id, role: staff.role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      },
    )
  }

  private signRefreshToken(staff: StaffEntity): string {
    return this.jwt.sign(
      { sub: staff.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    )
  }

  // ─── Public methods ──────────────────────────────────────────────────────────

  async validateStaff(email: string, password: string): Promise<StaffEntity | null> {
    const staff = await this.staffRepo.findOne({ where: { email } })
    if (!staff || !staff.isActive) return null
    const isMatch = await bcrypt.compare(password, staff.passwordHash)
    if (!isMatch) return null
    return staff
  }

  async login(dto: LoginDto): Promise<LoginResponseDto & { refreshToken: string }> {
    const staff = await this.validateStaff(dto.email, dto.password)
    if (!staff) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')

    return {
      accessToken: this.signAccessToken(staff),
      refreshToken: this.signRefreshToken(staff),
      user: this.sanitizeStaff(staff),
    }
  }

  async refreshTokens(refreshToken: string): Promise<RefreshResponseDto & { newRefreshToken: string }> {
    try {
      const payload = this.jwt.verify<{ sub: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      })

      const staff = await this.staffRepo.findOne({ where: { id: payload.sub } })
      if (!staff || !staff.isActive) throw new UnauthorizedException()

      return {
        accessToken: this.signAccessToken(staff),
        newRefreshToken: this.signRefreshToken(staff),
      }
    } catch {
      throw new UnauthorizedException('Refresh token หมดอายุหรือไม่ถูกต้อง')
    }
  }

  async getMe(staffId: string): Promise<StaffProfileDto> {
    const staff = await this.staffRepo.findOne({ where: { id: staffId } })
    if (!staff) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้')
    return this.sanitizeStaff(staff)
  }
}
