import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient UUID' })
  @IsUUID()
  patientId: string

  @ApiPropertyOptional({ description: 'Doctor / Staff UUID' })
  @IsOptional()
  @IsUUID()
  staffId?: string

  @ApiPropertyOptional({ description: 'Service UUID' })
  @IsOptional()
  @IsUUID()
  serviceId?: string

  @ApiProperty({ description: 'ISO 8601 datetime string with timezone' })
  @IsDateString()
  scheduledAt: string

  @ApiPropertyOptional({ description: 'Duration in minutes (default 30)', default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string

  /**
   * Backdate — actual booking date. Defaults to NOW() if omitted.
   * Frontend should send today's date, allow past dates, block future dates.
   */
  @ApiPropertyOptional({ description: 'Actual booking date (backdate-friendly)' })
  @IsOptional()
  @IsDateString()
  soldAt?: string
}
