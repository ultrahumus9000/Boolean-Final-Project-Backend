// import { User } from "@prisma/client"
import { User } from ".prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime";
import { Request, Response } from "express";
import db from "../database";

const { booking, user, hostProfile } = db;

type Booking = {
  total: number;
  guestId: number;
  start: string;
  end: string;
  houseId: number;
};

async function createBooking(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  const { total, start, end, houseId } = req.body as Booking;

  let startDate = new Date(start);
  let endDate = new Date(end);
  console.log("houseid", houseId);
  console.log("houseid", Number(houseId));
  try {
    const guestInfo = await user.findUnique({
      where: {
        id,
      },
      include: {
        guestProfile: true,
      },
    });

    let realGuestId = 0;

    if (guestInfo === null) {
      return;
    }
    if (guestInfo.guestProfile === null) {
      return;
    }
    if (guestInfo?.guestRole) {
      realGuestId = guestInfo.guestProfile.id;
    }

    const checkBookingStartDate = await booking.findFirst({
      where: {
        houseId: Number(houseId),
        AND: [
          {
            start: {
              lte: startDate.toISOString(),
            },
          },
          {
            end: {
              gte: startDate.toISOString(),
            },
          },
        ],
      },
    });

    const checkBookingEndDate = await booking.findFirst({
      where: {
        houseId: Number(houseId),
        AND: [
          {
            start: {
              lte: endDate.toISOString(),
            },
          },
          {
            end: {
              gte: endDate.toISOString(),
            },
          },
        ],
      },
    });

    // 1 within  07/09- 11/09, example, 08/09-09/09 2 not within 07/09- 11/09 08/09-14/09
    //3 not within 07/09- 11/09 06/09-10/09

    // id           Int          @id @default(autoincrement())
    // total        Int          @default(0)
    // guestProfile GuestProfile @relation(fields: [guestId], references: [id], onDelete: Cascade)
    // guestId      Int
    // start        DateTime     @unique @db.Date
    // end          DateTime     @unique @db.Date
    // house        House        @relation(fields: [houseId], references: [id])
    // houseId      Int

    if (checkBookingEndDate === null && checkBookingStartDate === null) {
      console.log("i can book");
      const newBooking = await booking.create({
        data: {
          total: total,
          guestId: realGuestId,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          houseId: Number(houseId),
        },
      });
      res.json(newBooking);
    } else {
      throw new Error("you can not book this hotel");
    }
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      if (error.errorCode === "P2002") {
        res.json("repeat data");
      } else {
        res.json(error.message);
      }
    } else {
      const newError = error as Error;

      res.json(newError.message);
    }

    console.log("error:", error);
  }
}

async function getAllBookingsForHost(req: Request, res: Response) {
  const { id } = req.currentUser as User;

  try {
    const hostProfileInfo = await user.findUnique({
      where: {
        id,
      },
      include: {
        hostProfile: true,
      },
    });

    const hostProfileId = hostProfileInfo?.hostProfile?.id;
    const foundBookings = await hostProfile.findUnique({
      where: {
        id: hostProfileId,
      },
      include: {
        houses: {
          select: {
            city: true,
            pictures: true,

            name: true,

            bookings: {
              select: {
                start: true,
                end: true,
                guestProfile: {
                  select: {
                    user: {
                      select: {
                        username: true,
                        avatar: true,
                      },
                    },
                  },
                },
                total: true,
                id: true,
              },
            },
          },
        },
      },
    });

    //this give you all houses with bookings
    const firstModifiedBookings = foundBookings?.houses;

    const secondModifiedBookings = firstModifiedBookings?.map(
      (allBookingsForOnehouse) => {
        const newbookings = allBookingsForOnehouse.bookings.map((booking) => {
          const newBooking = {
            houseName: allBookingsForOnehouse.name,
            houseId: allBookingsForOnehouse.pictures[0].houseId,
            start: booking.start,
            end: booking.end,
            total: booking.total,
            name: booking.guestProfile.user.username,
            avatar: booking.guestProfile.user.avatar,
            city: allBookingsForOnehouse.city,
            pictureSrc: allBookingsForOnehouse.pictures[0].src,
            pictureAlt: allBookingsForOnehouse.pictures[0].alt,
            bookingId: booking.id,
          };
          return newBooking;
        });

        const modifiedAllBookingsForOneHouse = [...newbookings];

        return modifiedAllBookingsForOneHouse;
      }
    );

    if (secondModifiedBookings?.length === undefined) {
      res.json("no booking for now");
      return;
    }
    const finalAllBookings = [];
    for (let i = 0; i < secondModifiedBookings?.length; i++) {
      const houseAccociatedBookings = secondModifiedBookings[i];
      finalAllBookings.push(...houseAccociatedBookings);
    }

    res.json(finalAllBookings);
  } catch (error) {
    res.json({ message: "error" });
  }
}

async function getAllBookingsforGuest(req: Request, res: Response) {
  const { id } = req.currentUser as User;

  try {
    const guestInfo = await user.findUnique({
      where: {
        id,
      },
      include: {
        guestProfile: true,
      },
    });

    let realGuestId = 0;
    if (guestInfo?.guestProfile) {
      realGuestId = guestInfo?.guestProfile?.id;
    }

    const rawData = await booking.findMany({
      where: {
        guestId: realGuestId,
      },
      select: {
        id: true,
        start: true,
        end: true,
        total: true,
        house: {
          select: {
            id: true,
            name: true,
            city: true,
            hostProfile: {
              select: {
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            pictures: true,
          },
        },
      },
    });

    const firstFilterData = rawData.map((booking) => {
      const newBooking = {
        bookingId: booking.id,
        houseId: booking.house.id,
        city: booking.house.city,
        houseName: booking.house.name,
        name: booking.house.hostProfile.user.username,
        avatar: booking.house.hostProfile.user.avatar,
        pictureSrc: booking.house.pictures[0].src,
        pictureAlt: booking.house.pictures[0].alt,
        start: booking.start,
        end: booking.end,
        total: booking.total,
      };

      return newBooking;
    });

    res.json(firstFilterData);
  } catch (error) {
    const errorList = error as Error;
    res.json(error);
    console.log("error:", error);
  }
}

async function deleteOneBooking(req: Request, res: Response) {
  const bookingId = Number(req.params.id);
  console.log("i am deleting");
  try {
    await booking.delete({
      where: {
        id: bookingId,
      },
    });
    res.json("you successfully deleted");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

export {
  createBooking,
  getAllBookingsForHost,
  getAllBookingsforGuest,
  deleteOneBooking,
};
