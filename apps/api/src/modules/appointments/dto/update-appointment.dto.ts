import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { AppointmentStatus } from '@quibes/shared'
import { CreateAppointmentDto } from './create-appointment.dto'

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}

export class PatchStatusDto {
  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus
}
