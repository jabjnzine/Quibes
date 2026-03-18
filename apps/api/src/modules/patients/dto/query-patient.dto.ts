import { IsOptional, IsString, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '@quibes/shared'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryPatientDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by name, code, or phone' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender
}
