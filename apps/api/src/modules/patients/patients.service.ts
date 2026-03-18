import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role, PaginatedResult } from '@quibes/shared'
import { paginate } from '../../common/helpers/paginate.helper'
import { encrypt, safeDecrypt, maskNationalId } from '../../common/utils/crypto.util'
import { PatientEntity } from './entities/patient.entity'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { QueryPatientDto } from './dto/query-patient.dto'

// ─── National ID visibility result ────────────────────────────────────────────

export interface NationalIdResult {
  nationalId:  string   // decrypted or masked
  masked:      boolean  // true = NURSE received ***-****-*****
  hasValue:    boolean  // false = CASHIER or no data
}

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly repo: Repository<PatientEntity>,
  ) {}

  // ─── List ──────────────────────────────────────────────────────────────────
  // nationalId is never included in list results (select:false on column)

  async findAll(dto: QueryPatientDto): Promise<PaginatedResult<PatientEntity>> {
    const qb = this.repo.createQueryBuilder('p')

    if (dto.search) {
      qb.andWhere(
        '(p.first_name ILIKE :s OR p.last_name ILIKE :s OR p.code ILIKE :s OR p.phone ILIKE :s)',
        { s: `%${dto.search}%` },
      )
    }

    if (dto.gender) {
      qb.andWhere('p.gender = :gender', { gender: dto.gender })
    }

    const sortColumn = ['firstName', 'lastName', 'createdAt', 'code'].includes(dto.sortBy ?? '')
      ? `p.${dto.sortBy}`
      : 'p.created_at'

    qb.orderBy(sortColumn, dto.sortOrder ?? 'DESC')

    return paginate(qb, dto)
  }

  // ─── Find one (no national ID) ─────────────────────────────────────────────

  async findOne(id: string): Promise<PatientEntity> {
    const patient = await this.repo.findOne({ where: { id } })
    if (!patient) throw new NotFoundException(`Patient ${id} not found`)
    return patient
  }

  // ─── Find one + national ID (role-aware) ──────────────────────────────────
  //
  // ADMIN / DOCTOR  → decrypt and return plain text
  // NURSE           → return masked  "X-XXXX-XXXXX-XX-X"
  // CASHIER         → throw 403 (handled at controller level)

  async findOneWithNationalId(id: string, requesterRole: Role): Promise<NationalIdResult> {
    const patient = await this.repo
      .createQueryBuilder('p')
      .addSelect('p.national_id') // bypass select:false
      .where('p.id = :id', { id })
      .getOne()

    if (!patient) throw new NotFoundException(`Patient ${id} not found`)

    if (!patient.nationalId) {
      return { nationalId: '', hasValue: false, masked: false }
    }

    if (requesterRole === Role.ADMIN || requesterRole === Role.DOCTOR) {
      const plain = safeDecrypt(patient.nationalId)
      return {
        nationalId: plain ?? '',
        hasValue:   !!plain,
        masked:     false,
      }
    }

    // NURSE — mask
    return {
      nationalId: maskNationalId(),
      hasValue:   true,
      masked:     true,
    }
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(dto: CreatePatientDto): Promise<PatientEntity> {
    const code = await this.generateCode()
    const patient = this.repo.create({
      ...dto,
      code,
      dob:        dto.dob        ? new Date(dto.dob) : null,
      nationalId: dto.nationalId ? encrypt(dto.nationalId) : null,
    })
    return this.repo.save(patient)
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdatePatientDto): Promise<PatientEntity> {
    const patient = await this.findOne(id)
    Object.assign(patient, {
      ...dto,
      ...(dto.dob !== undefined
        ? { dob: dto.dob ? new Date(dto.dob) : null }
        : {}),
      ...(dto.nationalId !== undefined
        ? { nationalId: dto.nationalId ? encrypt(dto.nationalId) : null }
        : {}),
    })
    return this.repo.save(patient)
  }

  // ─── Soft delete ───────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repo.softDelete(id)
  }

  // ─── HN code generator: HNYYxxxx (e.g. HN250001) ─────────────────────────

  private async generateCode(): Promise<string> {
    const year   = new Date().getFullYear().toString().slice(-2)
    const prefix = `HN${year}`
    const count  = await this.repo
      .createQueryBuilder('p')
      .where('p.code LIKE :prefix', { prefix: `${prefix}%` })
      .withDeleted()
      .getCount()
    return `${prefix}${String(count + 1).padStart(4, '0')}`
  }
}
