import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { LabService } from './lab.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('lab')
@Controller('lab')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabController {
  constructor(private readonly labService: LabService) {}
}
