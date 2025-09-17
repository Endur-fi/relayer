/*
  Warnings:

  - A unique constraint covering the columns `[user_address,contract_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contract_address` to the `transfer_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_address` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_user_address_key";

-- AlterTable
ALTER TABLE "public"."transfer_events" ADD COLUMN     "contract_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "contract_address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_user_address_contract_address_key" ON "public"."users"("user_address", "contract_address");
