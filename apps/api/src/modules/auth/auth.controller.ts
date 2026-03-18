import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import {
  LoginResponseDto,
  RefreshResponseDto,
  StaffProfileDto,
} from './dto/auth-response.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth/refresh',
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /auth/login ────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วย email + password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'เข้าสู่ระบบสำเร็จ คืน access token + user profile',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, user } = await this.authService.login(dto)

    // Refresh token เก็บใน httpOnly cookie — JS client อ่านไม่ได้
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)

    return { accessToken, user }
  }

  // ─── POST /auth/refresh ──────────────────────────────────────────────────────

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'ขอ access token ใหม่ผ่าน refresh token (httpOnly cookie)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ได้ access token ใหม่ พร้อม rotate refresh token',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Refresh token หมดอายุหรือไม่ถูกต้อง' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const refreshToken = req.cookies['refresh_token'] as string | undefined
    if (!refreshToken) throw new UnauthorizedException('ไม่พบ refresh token')

    const { accessToken, newRefreshToken } = await this.authService.refreshTokens(refreshToken)

    // Rotate refresh token ทุกครั้ง (เพิ่มความปลอดภัย)
    res.cookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS)

    return { accessToken }
  }

  // ─── POST /auth/logout ───────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ออกจากระบบ — ลบ refresh token cookie' })
  @ApiResponse({ status: HttpStatus.OK, description: 'ออกจากระบบสำเร็จ' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' })
    return { message: 'ออกจากระบบสำเร็จ' }
  }

  // ─── GET /auth/me ────────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูข้อมูลผู้ใช้ที่ login อยู่' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'คืนข้อมูล staff profile (ไม่มี passwordHash)',
    type: StaffProfileDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Access token หมดอายุหรือไม่ถูกต้อง' })
  async getMe(@CurrentUser() user: StaffProfileDto): Promise<StaffProfileDto> {
    // ดึงข้อมูล fresh จาก DB เสมอ เผื่อ role/isActive ถูก update
    return this.authService.getMe(user.id)
  }
}
