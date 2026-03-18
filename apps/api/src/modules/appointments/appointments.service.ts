import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, ILike } from 'typeorm'
import { AppointmentStatus, PaginatedResult } from '@quibes/shared'
import { paginate } from '../../common/helpers/paginate.helper'
import { AppointmentEntity } from './entities/appointment.entity'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentDto, PatchStatusDto } from './dto/update-appointment.dto'
import { QueryAppointmentDto, CalendarQueryDto } from './dto/query-appointment.dto'

// ─── Calendar event shape (consumed by FullCalendar) ─────────────────────────

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  status: AppointmentStatus
  patientId: string
  patientCode: string
  patientName: string
  staffId: string | null
  staffName: string | null
  serviceId: string | null
  note: string | null
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly repo: Repository<AppointmentEntity>,
  ) {}

  // ─── List (paginated, filterable) ──────────────────────────────────────────

  async findAll(dto: QueryAppointmentDto): Promise<PaginatedResult<AppointmentEntity>> {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.staff',   'staff')

    if (dto.date) {
      const day   = new Date(dto.date)
      const next  = new Date(dto.date)
      next.setDate(next.getDate() + 1)
      qb.andWhere('a.scheduled_at >= :day AND a.scheduled_at < :next', {
        day:  day.toISOString(),
        next: next.toISOString(),
      })
    }

    if (dto.staffId)   qb.andWhere('a.staff_id = :staffId',   { staffId:   dto.staffId   })
    if (dto.serviceId) qb.andWhere('a.service_id = :serviceId', { serviceId: dto.serviceId })
    if (dto.status)    qb.andWhere('a.status = :status',       { status:    dto.status    })
    if (dto.search) {
      qb.andWhere(
        '(patient.first_name ILIKE :s OR patient.last_name ILIKE :s OR patient.code ILIKE :s)',
        { s: `%${dto.search}%` },
      )
    }

    qb.orderBy('a.scheduled_at', dto.sortOrder ?? 'ASC')
    return paginate(qb, dto)
  }

  // ─── Calendar (date range, no pagination) ──────────────────────────────────

  async findCalendar(dto: CalendarQueryDto): Promise<CalendarEvent[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.staff',   'staff')
      .where('a.scheduled_at >= :start AND a.scheduled_at <= :end', {
        start: new Date(dto.start).toISOString(),
        end:   new Date(dto.end).toISOString(),
      })

    if (dto.staffId) qb.andWhere('a.staff_id = :staffId', { staffId: dto.staffId })
    if (dto.status)  qb.andWhere('a.status = :status',    { status:  dto.status  })

    const appointments = await qb.orderBy('a.scheduled_at', 'ASC').getMany()

    // Map to FullCalendar-compatible shape
    return appointments.map((a) => ({
      id:          a.id,
      title:       `${a.patient?.firstName ?? ''} ${a.patient?.lastName ?? ''}`.trim() || 'ไม่ระบุ',
      start:       a.scheduledAt.toISOString(),
      end:         new Date(a.scheduledAt.getTime() + (a.durationMinutes ?? 30) * 60 * 1000).toISOString(),
      status:      a.status,
      patientId:   a.patientId,
      patientCode: a.patient?.code ?? '',
      patientName: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '',
      staffId:     a.staffId,
      staffName:   a.staff ? `${a.staff.firstName} ${a.staff.lastName}` : null,
      serviceId:   a.serviceId,
      note:        a.note,
    }))
  }

  // ─── Find one ──────────────────────────────────────────────────────────────

  async findOne(id: string): Promise<AppointmentEntity> {
    const appt = await this.repo.findOne({
      where: { id },
      relations: ['patient', 'staff'],
    })
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`)
    return appt
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(dto: CreateAppointmentDto, createdBy?: string): Promise<AppointmentEntity> {
    const appt = this.repo.create({
      ...dto,
      scheduledAt:     new Date(dto.scheduledAt),
      durationMinutes: dto.durationMinutes ?? 30,
      soldAt:          dto.soldAt ? new Date(dto.soldAt) : new Date(),
      status:          AppointmentStatus.PENDING,
      createdBy:       createdBy ?? null,
    })
    return this.repo.save(appt)
  }

  // ─── Update (reschedule / change doctor) ───────────────────────────────────

  async update(id: string, dto: UpdateAppointmentDto): Promise<AppointmentEntity> {
    const appt = await this.findOne(id)
    Object.assign(appt, {
      ...dto,
      ...(dto.scheduledAt ? { scheduledAt: new Date(dto.scheduledAt) } : {}),
    })
    return this.repo.save(appt)
  }

  // ─── Patch status only ─────────────────────────────────────────────────────

  async patchStatus(id: string, dto: PatchStatusDto): Promise<AppointmentEntity> {
    const appt = await this.findOne(id)
    appt.status = dto.status
    return this.repo.save(appt)
  }

  // ─── Soft delete ───────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repo.softDelete(id)
  }
}
