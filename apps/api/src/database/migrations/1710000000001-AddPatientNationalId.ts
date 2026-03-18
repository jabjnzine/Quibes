import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPatientNationalId1710000000001 implements MigrationInterface {
  name = 'AddPatientNationalId1710000000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "patients"
      ADD COLUMN IF NOT EXISTS "national_id" character varying
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "patients"
      DROP COLUMN IF EXISTS "national_id"
    `)
  }
}
