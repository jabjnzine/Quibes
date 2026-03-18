import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './modules/auth/auth.module'
import { StaffModule } from './modules/staff/staff.module'
import { PatientsModule } from './modules/patients/patients.module'
import { AppointmentsModule } from './modules/appointments/appointments.module'
import { OpdModule } from './modules/opd/opd.module'
import { FinanceModule } from './modules/finance/finance.module'
import { CoursesModule } from './modules/courses/courses.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { MembersModule } from './modules/members/members.module'
import { CrmModule } from './modules/crm/crm.module'
import { ReportsModule } from './modules/reports/reports.module'
import { LogsModule } from './modules/logs/logs.module'
import { LabModule } from './modules/lab/lab.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
        ssl: config.get('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    StaffModule,
    PatientsModule,
    AppointmentsModule,
    OpdModule,
    LabModule,
    FinanceModule,
    CoursesModule,
    InventoryModule,
    MembersModule,
    CrmModule,
    ReportsModule,
    LogsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
