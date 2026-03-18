import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StaffEntity } from './entities/staff.entity'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
  ) {}

  findAll() {
    return this.staffRepo.find({ where: { isActive: true } })
  }

  findOne(id: string) {
    return this.staffRepo.findOne({ where: { id } })
  }
}
