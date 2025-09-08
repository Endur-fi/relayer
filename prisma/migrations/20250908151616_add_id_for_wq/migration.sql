-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "airfoil";

-- AlterTable
ALTER TABLE "public"."withdraw_queue_events" ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "withdraw_queue_events_pkey" PRIMARY KEY ("id");
