-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_houseId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;
