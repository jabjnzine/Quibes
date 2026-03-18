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
  Request,
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
import { AppointmentsService } from './appointments.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentDto, PatchStatusDto } from './dto/update-appointment.dto'
import { QueryAppointmentDto, CalendarQueryDto } from './dto/query-appointment.dto'

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // ─── List (paginated) ──────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CASHIER)
  @ApiOperation({ summary: 'List appointments with filters + pagination' })
  @ApiResponse({ status: 200, description: 'Paginated appointment list' })
  findAll(@Query() query: QueryAppointmentDto) {
    return this.appointmentsService.findAll(query)
  }

  // ─── Calendar ──────────────────────────────────────────────────────────────

  @Get('calendar')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CASHIER)
  @ApiOperation({ summary: 'Get calendar events for a date range' })
  getCalendar(@Query() query: CalendarQueryDto) {
    return this.appointmentsService.findCalendar(query)
  }

  // ─── One ───────────────────────────────────────────────────────────────────

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.CASHIER)
  @ApiOperation({ summary: 'Get single appointment' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id)
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN, Role.NURSE)
  @ApiOperation({ summary: 'Book new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created' })
  create(@Body() dto: CreateAppointmentDto, @Request() req: { user?: { sub?: string } }) {
    return this.appointmentsService.create(dto, req.user?.sub)
  }

  // ─── Update (reschedule / change doctor) ───────────────────────────────────

  @Patch(':id')
  @Roles(Role.ADMIN, Role.NURSE)
  @ApiOperation({ summary: 'Reschedule or update appointment details' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto)
  }

  // ─── Patch status ──────────────────────────────────────────────────────────

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.NURSE)
  @ApiOperation({ summary: 'Update appointment status (confirm/cancel/done)' })
  patchStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PatchStatusDto,
  ) {
    return this.appointmentsService.patchStatus(id, dto)
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN, Role.NURSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete appointment' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id)
  }
}
