import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { Role } from '@quibes/shared'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { StaffProfileDto } from '../auth/dto/auth-response.dto'
import { PatientsService } from './patients.service'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { QueryPatientDto } from './dto/query-patient.dto'

@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // ─── List ──────────────────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CASHIER)
  @ApiOperation({ summary: 'List patients with search + pagination' })
  findAll(@Query() query: QueryPatientDto) {
    return this.patientsService.findAll(query)
  }

  // ─── One ───────────────────────────────────────────────────────────────────

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CASHIER)
  @ApiOperation({ summary: 'Get patient (no national ID)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.findOne(id)
  }

  // ─── National ID (role-gated) ──────────────────────────────────────────────
  //
  // ADMIN / DOCTOR  → decrypted plain text
  // NURSE           → masked "X-XXXX-XXXXX-XX-X"
  // CASHIER         → 403

  @Get(':id/national-id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Get national ID — decrypted (ADMIN/DOCTOR) or masked (NURSE)' })
  @ApiResponse({ status: 200, description: '{ nationalId, masked, hasValue }' })
  @ApiResponse({ status: 403, description: 'CASHIER role not allowed' })
  getNationalId(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: StaffProfileDto,
  ) {
    if (user.role === Role.CASHIER) {
      throw new ForbiddenException('CASHIER role cannot access national ID')
    }
    return this.patientsService.findOneWithNationalId(id, user.role)
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Register new patient (auto HN code, nationalId encrypted server-side)' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto)
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Update patient info (nationalId re-encrypted if provided)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, dto)
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete patient (ADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.remove(id)
  }
}
