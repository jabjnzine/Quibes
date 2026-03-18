import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAppointmentFields1710000000002 implements MigrationInterface {
  name = 'AddAppointmentFields1710000000002'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE appointments
        ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 30,
        ADD COLUMN IF NOT EXISTS sold_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS created_by       UUID NULL
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE appointments
        DROP COLUMN IF EXISTS duration_minutes,
        DROP COLUMN IF EXISTS sold_at,
        DROP COLUMN IF EXISTS created_by
    `)
  }
}
