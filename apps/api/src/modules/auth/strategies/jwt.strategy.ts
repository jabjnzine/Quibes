import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StaffEntity } from '../../staff/entities/staff.entity'
import { StaffProfileDto } from '../dto/auth-response.dto'

interface JwtPayload {
  sub: string
  role: string
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET') ?? '',
    })
  }

  // validate() คืนค่าไปเก็บใน req.user
  // ห้ามคืน passwordHash — ใช้ StaffProfileDto เสมอ
  async validate(payload: JwtPayload): Promise<StaffProfileDto> {
    const staff = await this.staffRepo.findOne({ where: { id: payload.sub } })

    if (!staff || !staff.isActive) {
      throw new UnauthorizedException('บัญชีนี้ถูกระงับหรือไม่พบในระบบ')
    }

    // Return sanitized profile — passwordHash ไม่รวมอยู่ใน req.user
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
}
