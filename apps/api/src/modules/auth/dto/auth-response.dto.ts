import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@quibes/shared'

export class StaffProfileDto {
  @ApiProperty({ example: 'uuid-xxxx' })
  id: string

  @ApiProperty({ example: 'สมศรี' })
  firstName: string

  @ApiProperty({ example: 'แพทย์ดี' })
  lastName: string

  @ApiProperty({ example: 'admin@quibes.clinic' })
  email: string

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role

  @ApiProperty({ example: true })
  isActive: boolean

  @ApiProperty()
  createdAt: Date
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string

  @ApiProperty({ type: StaffProfileDto })
  user: StaffProfileDto
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string
}
