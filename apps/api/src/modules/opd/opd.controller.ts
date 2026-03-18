import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { OpdService } from './opd.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('opd')
@Controller('opd')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpdController {
  constructor(private readonly opdService: OpdService) {}
}
