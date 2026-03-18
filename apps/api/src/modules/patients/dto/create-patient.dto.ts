import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  Matches,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '@quibes/shared'

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsDateString()
  dob?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  allergy?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalHistory?: string

  @ApiPropertyOptional({ description: 'Thai national ID — 13 digits, plain text (encrypted server-side)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{13}$/, { message: 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น' })
  nationalId?: string
}
