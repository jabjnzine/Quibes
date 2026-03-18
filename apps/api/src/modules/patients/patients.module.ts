import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PatientEntity } from './entities/patient.entity'
import { PatientPhotoEntity } from './entities/patient-photo.entity'
import { PatientDiaryEntity } from './entities/patient-diary.entity'
import { PatientsController } from './patients.controller'
import { PatientsService } from './patients.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientEntity, PatientPhotoEntity, PatientDiaryEntity]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
