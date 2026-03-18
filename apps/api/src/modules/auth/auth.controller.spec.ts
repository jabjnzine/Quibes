import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { StaffProfileDto, LoginResponseDto } from './dto/auth-response.dto'
import { Role } from '@quibes/shared'
import { Response, Request } from 'express'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockStaffProfile: StaffProfileDto = {
  id: 'staff-uuid-001',
  firstName: 'สมศรี',
  lastName: 'แพทย์ดี',
  email: 'admin@quibes.clinic',
  role: Role.ADMIN,
  isActive: true,
  createdAt: new Date('2025-01-01'),
}

const mockLoginResult: LoginResponseDto & { refreshToken: string } = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockStaffProfile,
}

function createMockResponse(): Partial<Response> {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  }
}

function createMockRequest(cookies: Record<string, string> = {}): Partial<Request> {
  return { cookies }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const mockAuthService: jest.Mocked<Partial<AuthService>> = {
      login: jest.fn(),
      refreshTokens: jest.fn(),
      getMe: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ─── POST /auth/login ──────────────────────────────────────────────────────

  describe('login()', () => {
    const dto: LoginDto = { email: 'admin@quibes.clinic', password: 'password123' }

    it('should return accessToken and user profile', async () => {
      authService.login.mockResolvedValue(mockLoginResult)
      const res = createMockResponse()

      const result = await controller.login(dto, res as Response)

      expect(result.accessToken).toBe('mock-access-token')
      expect(result.user).toEqual(mockStaffProfile)
      expect(result.user).not.toHaveProperty('passwordHash')
    })

    it('should set refresh_token httpOnly cookie', async () => {
      authService.login.mockResolvedValue(mockLoginResult)
      const res = createMockResponse()

      await controller.login(dto, res as Response)

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'mock-refresh-token',
        expect.objectContaining({ httpOnly: true }),
      )
    })

    it('should throw UnauthorizedException on invalid credentials', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException())
      const res = createMockResponse()

      await expect(controller.login(dto, res as Response)).rejects.toThrow(UnauthorizedException)
    })
  })

  // ─── POST /auth/refresh ────────────────────────────────────────────────────

  describe('refresh()', () => {
    it('should return new accessToken and rotate refresh cookie', async () => {
      authService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access-token',
        newRefreshToken: 'new-refresh-token',
      })
      const req = createMockRequest({ refresh_token: 'old-refresh-token' })
      const res = createMockResponse()

      const result = await controller.refresh(req as Request, res as Response)

      expect(result.accessToken).toBe('new-access-token')
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        expect.objectContaining({ httpOnly: true }),
      )
    })

    it('should throw UnauthorizedException when cookie is missing', async () => {
      const req = createMockRequest({})
      const res = createMockResponse()

      await expect(controller.refresh(req as Request, res as Response)).rejects.toThrow(
        UnauthorizedException,
      )
      expect(authService.refreshTokens).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      authService.refreshTokens.mockRejectedValue(new UnauthorizedException())
      const req = createMockRequest({ refresh_token: 'expired-token' })
      const res = createMockResponse()

      await expect(controller.refresh(req as Request, res as Response)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  // ─── POST /auth/logout ─────────────────────────────────────────────────────

  describe('logout()', () => {
    it('should clear refresh_token cookie and return success message', () => {
      const res = createMockResponse()

      const result = controller.logout(res as Response)

      expect(res.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.objectContaining({ path: '/api/v1/auth/refresh' }),
      )
      expect(result.message).toBeDefined()
    })
  })

  // ─── GET /auth/me ──────────────────────────────────────────────────────────

  describe('getMe()', () => {
    it('should return fresh staff profile from DB', async () => {
      authService.getMe.mockResolvedValue(mockStaffProfile)

      const result = await controller.getMe(mockStaffProfile)

      expect(authService.getMe).toHaveBeenCalledWith(mockStaffProfile.id)
      expect(result).toEqual(mockStaffProfile)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should call getMe with the current user id from JWT', async () => {
      authService.getMe.mockResolvedValue(mockStaffProfile)

      await controller.getMe(mockStaffProfile)

      expect(authService.getMe).toHaveBeenCalledWith('staff-uuid-001')
    })
  })
})
