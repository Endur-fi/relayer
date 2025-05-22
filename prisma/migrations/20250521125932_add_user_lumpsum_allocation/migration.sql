-- CreateTable
CREATE TABLE "user_allocation" (
    "user_address" TEXT NOT NULL,
    "allocation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_allocation_user_address_key" ON "user_allocation"("user_address");
