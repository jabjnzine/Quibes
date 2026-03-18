import { IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { AppointmentStatus } from '@quibes/shared'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryAppointmentDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by date (YYYY-MM-DD) — returns full day' })
  @IsOptional()
  @IsDateString()
  date?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceId?: string

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus

  @ApiPropertyOptional({ description: 'Patient name/code full-text search' })
  @IsOptional()
  search?: string
}

export class CalendarQueryDto {
  @ApiPropertyOptional({ description: 'Range start ISO datetime' })
  @IsDateString()
  start: string

  @ApiPropertyOptional({ description: 'Range end ISO datetime' })
  @IsDateString()
  end: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus
}
