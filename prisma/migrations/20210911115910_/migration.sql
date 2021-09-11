-- DropIndex
DROP INDEX "Booking.end_unique";

-- DropIndex
DROP INDEX "Booking.start_unique";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "start" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "end" SET DATA TYPE TIMESTAMP(3);
