import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── ENUMS ────────────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TYPE "gender_enum" AS ENUM ('male', 'female', 'other')
    `)
    await queryRunner.query(`
      CREATE TYPE "role_enum" AS ENUM ('admin', 'doctor', 'nurse', 'cashier')
    `)
    await queryRunner.query(`
      CREATE TYPE "appointment_status_enum" AS ENUM ('pending', 'confirmed', 'in_progress', 'done', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "opd_visit_status_enum" AS ENUM ('waiting', 'in_progress', 'done', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "item_type_enum" AS ENUM ('service', 'product', 'course')
    `)
    await queryRunner.query(`
      CREATE TYPE "payment_method_enum" AS ENUM ('cash', 'credit_card', 'transfer', 'qr_code', 'deposit', 'mixed')
    `)
    await queryRunner.query(`
      CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'paid', 'partial', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "course_status_enum" AS ENUM ('active', 'completed', 'expired', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "vial_status_enum" AS ENUM ('active', 'expired', 'disposed')
    `)
    await queryRunner.query(`
      CREATE TYPE "stock_movement_type_enum" AS ENUM ('in', 'out', 'adjust', 'open_vial', 'dispose_vial')
    `)
    await queryRunner.query(`
      CREATE TYPE "crm_channel_enum" AS ENUM ('line', 'sms')
    `)
    await queryRunner.query(`
      CREATE TYPE "crm_message_status_enum" AS ENUM ('pending', 'sent', 'failed')
    `)
    await queryRunner.query(`
      CREATE TYPE "purchase_request_status_enum" AS ENUM ('pending', 'approved', 'rejected', 'ordered')
    `)
    await queryRunner.query(`
      CREATE TYPE "purchase_order_status_enum" AS ENUM ('ordered', 'received', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "cash_transaction_type_enum" AS ENUM ('in', 'out')
    `)
    await queryRunner.query(`
      CREATE TYPE "member_tier_enum" AS ENUM ('bronze', 'silver', 'gold', 'platinum')
    `)

    // ─── MODULE 7: STAFF ──────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "staff" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "first_name"   VARCHAR NOT NULL,
        "last_name"    VARCHAR NOT NULL,
        "email"        VARCHAR NOT NULL UNIQUE,
        "password_hash" VARCHAR NOT NULL,
        "role"         "role_enum" NOT NULL DEFAULT 'nurse',
        "is_active"    BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"   TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_staff_email" ON "staff" ("email")`)

    // ─── MODULE 2: PATIENTS ───────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "patients" (
        "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "code"            VARCHAR NOT NULL UNIQUE,
        "first_name"      VARCHAR NOT NULL,
        "last_name"       VARCHAR NOT NULL,
        "gender"          "gender_enum" NOT NULL,
        "dob"             DATE,
        "phone"           VARCHAR,
        "allergy"         TEXT,
        "medical_history" TEXT,
        "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"      TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_patients_code" ON "patients" ("code")`)
    await queryRunner.query(`CREATE INDEX "IDX_patients_phone" ON "patients" ("phone")`)

    await queryRunner.query(`
      CREATE TABLE "patient_photos" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"   UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "visit_id"     UUID,
        "photo_type"   VARCHAR(10) NOT NULL CHECK ("photo_type" IN ('before','after')),
        "storage_path" VARCHAR NOT NULL,
        "taken_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_patient_photos_patient_id" ON "patient_photos" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "patient_diaries" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"  UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "note"        TEXT NOT NULL,
        "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_patient_diaries_patient_id" ON "patient_diaries" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "lab_results" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "visit_id"   UUID,
        "test_name"  VARCHAR NOT NULL,
        "result"     TEXT NOT NULL,
        "unit"       VARCHAR,
        "ref_range"  VARCHAR,
        "tested_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_lab_results_patient_id" ON "lab_results" ("patient_id")`)

    // ─── MODULE 3: APPOINTMENTS ───────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"   UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "staff_id"     UUID REFERENCES "staff"("id") ON DELETE SET NULL,
        "service_id"   UUID,
        "scheduled_at" TIMESTAMPTZ NOT NULL,
        "status"       "appointment_status_enum" NOT NULL DEFAULT 'pending',
        "note"         TEXT,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"   TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_appointments_patient_id" ON "appointments" ("patient_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_appointments_scheduled_at" ON "appointments" ("scheduled_at")`)

    await queryRunner.query(`
      CREATE TABLE "opd_visits" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"     UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "doctor_id"      UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "appointment_id" UUID REFERENCES "appointments"("id") ON DELETE SET NULL,
        "started_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "ended_at"       TIMESTAMPTZ,
        "diagnosis"      TEXT,
        "note"           TEXT,
        "status"         "opd_visit_status_enum" NOT NULL DEFAULT 'waiting',
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"     TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_opd_visits_patient_id" ON "opd_visits" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "opd_items" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "visit_id"     UUID NOT NULL REFERENCES "opd_visits"("id") ON DELETE CASCADE,
        "item_type"    "item_type_enum" NOT NULL,
        "reference_id" UUID NOT NULL,
        "quantity"     INTEGER NOT NULL DEFAULT 1,
        "unit_price"   NUMERIC(10,2) NOT NULL,
        "discount"     NUMERIC(10,2) NOT NULL DEFAULT 0,
        "total"        NUMERIC(10,2) NOT NULL,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_opd_items_visit_id" ON "opd_items" ("visit_id")`)

    await queryRunner.query(`
      CREATE TABLE "referrals" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "visit_id"    UUID NOT NULL REFERENCES "opd_visits"("id") ON DELETE CASCADE,
        "patient_id"  UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "referred_to" TEXT NOT NULL,
        "reason"      TEXT,
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_referrals_visit_id" ON "referrals" ("visit_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_referrals_patient_id" ON "referrals" ("patient_id")`)

    // ─── MODULE 4: CRM ────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "surveys" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"      VARCHAR NOT NULL,
        "questions"  JSONB NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "survey_responses" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "survey_id"    UUID NOT NULL REFERENCES "surveys"("id") ON DELETE CASCADE,
        "patient_id"   UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "answers"      JSONB NOT NULL DEFAULT '{}',
        "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_survey_responses_survey_id" ON "survey_responses" ("survey_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_survey_responses_patient_id" ON "survey_responses" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "crm_messages" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "channel"    "crm_channel_enum" NOT NULL,
        "content"    TEXT NOT NULL,
        "sent_at"    TIMESTAMPTZ,
        "status"     "crm_message_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_crm_messages_patient_id" ON "crm_messages" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "line_staff_assignments" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"  UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
        "staff_id"    UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_line_staff_assignments_patient_id" ON "line_staff_assignments" ("patient_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_line_staff_assignments_staff_id" ON "line_staff_assignments" ("staff_id")`)

    // ─── MODULE 5: FINANCE ────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "receipts" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "visit_id"       UUID,
        "patient_id"     UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "subtotal"       NUMERIC(12,2) NOT NULL,
        "discount"       NUMERIC(12,2) NOT NULL DEFAULT 0,
        "total"          NUMERIC(12,2) NOT NULL,
        "payment_method" "payment_method_enum" NOT NULL,
        "status"         "payment_status_enum" NOT NULL DEFAULT 'pending',
        "paid_at"        TIMESTAMPTZ,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"     TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_receipts_patient_id" ON "receipts" ("patient_id")`)

    await queryRunner.query(`
      CREATE TABLE "receipt_items" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "receipt_id"   UUID NOT NULL REFERENCES "receipts"("id") ON DELETE CASCADE,
        "item_type"    "item_type_enum" NOT NULL,
        "reference_id" UUID NOT NULL,
        "quantity"     INTEGER NOT NULL DEFAULT 1,
        "unit_price"   NUMERIC(10,2) NOT NULL,
        "total"        NUMERIC(10,2) NOT NULL,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_receipt_items_receipt_id" ON "receipt_items" ("receipt_id")`)

    await queryRunner.query(`
      CREATE TABLE "expenses" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "category"    VARCHAR NOT NULL,
        "amount"      NUMERIC(12,2) NOT NULL,
        "description" TEXT,
        "paid_at"     TIMESTAMPTZ NOT NULL,
        "created_by"  UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"  TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_expenses_category" ON "expenses" ("category")`)

    await queryRunner.query(`
      CREATE TABLE "cash_transactions" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "type"         "cash_transaction_type_enum" NOT NULL,
        "amount"       NUMERIC(12,2) NOT NULL,
        "reference_id" UUID,
        "note"         TEXT,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "deposits" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "amount"     NUMERIC(12,2) NOT NULL,
        "remaining"  NUMERIC(12,2) NOT NULL,
        "note"       TEXT,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_deposits_patient_id" ON "deposits" ("patient_id")`)

    // ─── MODULE 5: COURSES ────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"           VARCHAR NOT NULL,
        "description"    TEXT,
        "total_sessions" INTEGER NOT NULL,
        "price"          NUMERIC(12,2) NOT NULL,
        "validity_days"  INTEGER,
        "is_active"      BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"     TIMESTAMPTZ
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "patient_courses" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"     UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "course_id"      UUID NOT NULL REFERENCES "courses"("id") ON DELETE RESTRICT,
        "total_sessions" INTEGER NOT NULL,
        "used_sessions"  INTEGER NOT NULL DEFAULT 0,
        "expires_at"     TIMESTAMPTZ,
        "status"         "course_status_enum" NOT NULL DEFAULT 'active',
        "sold_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_by"     UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_patient_courses_patient_id" ON "patient_courses" ("patient_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_patient_courses_course_id" ON "patient_courses" ("course_id")`)

    // ─── MODULE 6: INVENTORY ──────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "code"                VARCHAR NOT NULL UNIQUE,
        "name"                VARCHAR NOT NULL,
        "category"            VARCHAR NOT NULL,
        "unit"                VARCHAR NOT NULL,
        "cost_price"          NUMERIC(12,2) NOT NULL,
        "sell_price"          NUMERIC(12,2) NOT NULL,
        "can_partial_use"     BOOLEAN NOT NULL DEFAULT FALSE,
        "default_vial_size_ml" NUMERIC(8,2),
        "is_active"           BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"          TIMESTAMPTZ
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_products_code" ON "products" ("code")`)
    await queryRunner.query(`CREATE INDEX "IDX_products_category" ON "products" ("category")`)

    await queryRunner.query(`
      CREATE TABLE "inventory_stock" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id"  UUID NOT NULL UNIQUE REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity_ml" NUMERIC(12,2) NOT NULL DEFAULT 0,
        "min_quantity" NUMERIC(12,2) NOT NULL DEFAULT 0,
        "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_inventory_stock_product_id" ON "inventory_stock" ("product_id")`)

    await queryRunner.query(`
      CREATE TABLE "purchase_requests" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id"   UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "quantity"     NUMERIC(12,2) NOT NULL,
        "reason"       TEXT,
        "status"       "purchase_request_status_enum" NOT NULL DEFAULT 'pending',
        "requested_by" UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_purchase_requests_product_id" ON "purchase_requests" ("product_id")`)

    await queryRunner.query(`
      CREATE TABLE "purchase_orders" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "pr_id"       UUID REFERENCES "purchase_requests"("id") ON DELETE SET NULL,
        "product_id"  UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "quantity"    NUMERIC(12,2) NOT NULL,
        "unit_cost"   NUMERIC(12,2) NOT NULL,
        "total"       NUMERIC(12,2) NOT NULL,
        "ordered_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "status"      "purchase_order_status_enum" NOT NULL DEFAULT 'ordered',
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_purchase_orders_product_id" ON "purchase_orders" ("product_id")`)

    await queryRunner.query(`
      CREATE TABLE "stock_movements" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id"   UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "type"         "stock_movement_type_enum" NOT NULL,
        "quantity_ml"  NUMERIC(12,2) NOT NULL,
        "reference_id" UUID,
        "note"         TEXT,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_stock_movements_product_id" ON "stock_movements" ("product_id")`)

    await queryRunner.query(`
      CREATE TABLE "pharmacy_sales" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "quantity"   NUMERIC(12,2) NOT NULL,
        "unit_price" NUMERIC(12,2) NOT NULL,
        "total"      NUMERIC(12,2) NOT NULL,
        "sold_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "sold_by"    UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_pharmacy_sales_product_id" ON "pharmacy_sales" ("product_id")`)

    await queryRunner.query(`
      CREATE TABLE "patient_vials" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id"     UUID NOT NULL REFERENCES "patients"("id") ON DELETE RESTRICT,
        "product_id"     UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "opd_item_id"    UUID,
        "total_ml"       NUMERIC(8,2) NOT NULL,
        "used_ml"        NUMERIC(8,2) NOT NULL DEFAULT 0,
        "remaining_ml"   NUMERIC(8,2) NOT NULL,
        "status"         "vial_status_enum" NOT NULL DEFAULT 'active',
        "opened_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "expires_at"     TIMESTAMPTZ,
        "disposed_at"    TIMESTAMPTZ,
        "dispose_reason" VARCHAR,
        "note"           TEXT,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_patient_vials_patient_id" ON "patient_vials" ("patient_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_patient_vials_product_id" ON "patient_vials" ("product_id")`)

    // ─── MODULE 6: MEMBERS ────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "members" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" UUID NOT NULL UNIQUE REFERENCES "patients"("id") ON DELETE CASCADE,
        "tier"       "member_tier_enum" NOT NULL DEFAULT 'bronze',
        "points"     INTEGER NOT NULL DEFAULT 0,
        "joined_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "expires_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_members_patient_id" ON "members" ("patient_id")`)

    // ─── MODULE 8: ACTIVITY LOGS ──────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"    UUID NOT NULL REFERENCES "staff"("id") ON DELETE RESTRICT,
        "action"     VARCHAR NOT NULL,
        "entity"     VARCHAR NOT NULL,
        "entity_id"  UUID,
        "old_value"  JSONB,
        "new_value"  JSONB,
        "ip_address" VARCHAR,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_activity_logs_user_id" ON "activity_logs" ("user_id")`)
    await queryRunner.query(`CREATE INDEX "IDX_activity_logs_action" ON "activity_logs" ("action")`)
    await queryRunner.query(`CREATE INDEX "IDX_activity_logs_entity" ON "activity_logs" ("entity")`)
    await queryRunner.query(`CREATE INDEX "IDX_activity_logs_created_at" ON "activity_logs" ("created_at")`)

    // ─── TYPEORM MIGRATIONS TABLE ─────────────────────────────────────────────
    // TypeORM creates this automatically, no need to create manually
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order to respect FK constraints

    await queryRunner.query(`DROP TABLE IF EXISTS "activity_logs"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "members"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_vials"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "pharmacy_sales"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_movements"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_orders"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_requests"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_stock"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_courses"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "courses"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "deposits"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_transactions"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "expenses"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "receipt_items"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "receipts"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "line_staff_assignments"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "crm_messages"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "survey_responses"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "surveys"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "referrals"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "opd_items"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "opd_visits"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "lab_results"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_diaries"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_photos"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "patients"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "staff"`)

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "member_tier_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "cash_transaction_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "purchase_order_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "purchase_request_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "crm_message_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "crm_channel_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "stock_movement_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "vial_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "course_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_method_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "item_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "opd_visit_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "appointment_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "role_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "gender_enum"`)
  }
}
