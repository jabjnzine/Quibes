import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { StaffProfileDto } from '../../modules/auth/dto/auth-response.dto'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): StaffProfileDto => {
    const request = ctx.switchToHttp().getRequest<{ user: StaffProfileDto }>()
    return request.user
  },
)
