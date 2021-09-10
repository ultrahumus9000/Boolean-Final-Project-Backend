/*
  Warnings:

  - A unique constraint covering the columns `[start]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[end]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking.start_unique" ON "Booking"("start");

-- CreateIndex
CREATE UNIQUE INDEX "Booking.end_unique" ON "Booking"("end");
