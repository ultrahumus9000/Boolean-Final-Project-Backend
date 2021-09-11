import { Picture, User, House } from ".prisma/client";
import { Request, Response } from "express";
import db from "../database";
import { getFilteredHouses, modifiedHouses } from "./service";
import { Query } from "./service";

const { house, picture, hostProfile, user } = db;

type Pictures = {
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
};

async function getAllHouses(req: Request, res: Response) {
  console.log("query", Object.keys(req.query).length);
  try {
    if (Object.keys(req.query).length) {
      const rawData = await getFilteredHouses(req.query as Query);
      const houses = await modifiedHouses(rawData);
      res.json(houses);
    } else {
      const rawData = await house.findMany({
        select: {
          id: true,
          name: true,
          bedrooms: true,
          maxGuests: true,
          facility: true,
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

          price: true,
          reviews: {
            select: {
              content: true,
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
            },
          },
          pictures: {
            select: {
              src: true,
              alt: true,
            },
          },
        },
      });

      const houses = await modifiedHouses(rawData);

      res.json(houses);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

async function deleteHouseById(req: Request, res: Response) {
  const houseId = Number(req.params.id);
  console.log("houseId", houseId);
  console.log("type of houseId", typeof houseId);
  try {
    await house.delete({
      where: {
        id: houseId,
      },
    });

    console.log("i am successfull deleting");
    res.json("this house of listing is deleted ");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

async function getOneHouse(req: Request, res: Response) {
  const houseId = Number(req.params.id);

  try {
    const targetHouse = await house.findUnique({
      where: {
        id: houseId,
      },
      select: {
        id: true,
        name: true,
        bedrooms: true,
        maxGuests: true,
        facility: true,
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

        price: true,
        reviews: {
          select: {
            content: true,
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
          },
        },
        pictures: {
          select: {
            src: true,
            alt: true,
          },
        },
      },
    });

    if (targetHouse?.pictures.length) {
      const modifiedHouse = await modifiedHouses([targetHouse]);
      res.json(modifiedHouse[0]);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

// media storage in cloud - Cloudinary
// npm i multer-storage-cloudinary cloudinary
async function createOneHouse(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  console.log("request body", req.body);
  const { name, city, bedrooms, maxGuests, facility, price } = req.body;

  const pictures = req.files as Pictures[];

  const images = pictures?.map((picture) => {
    var fields = picture.originalname.split(".");

    var houseAlt = fields[0];
    const newPicture = {
      src: picture.path,
      alt: houseAlt,
    };

    return newPicture;
  });

  try {
    const hostInfo = await user.findUnique({
      where: {
        id,
      },
      select: {
        hostProfile: {
          select: {
            id: true,
          },
        },
      },
    });
    const realHostId = hostInfo?.hostProfile?.id;
    if (realHostId === undefined) {
      return;
    }
    const newHouse = await house.create({
      data: {
        name: name,
        city: city,
        pictures: {
          createMany: {
            data: [...images],
          },
        },
        bedrooms: parseInt(bedrooms),
        maxGuests: parseInt(maxGuests),
        facility: facility,
        price: parseInt(price),
        hostId: realHostId,
      },
    });
    res.json(newHouse);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

// model House {
//   id          Int         @id @default(autoincrement())
//   name        String
//   bedrooms    Int
//   maxGuests   Int
//   facility    String[]
//   city        String
//   wishList    WishList[]
//   hostProfile HostProfile @relation(fields: [hostId], references: [id], onDelete: Cascade)
//   hostId      Int
//   price       Int
//   reviews     Review[]
//   pictures    Picture[]
//   bookings    Booking[]
// }

async function updateOneHouse(req: Request, res: Response) {
  const houseId = Number(req.params.id);
  try {
    const orginalHouseInfo = await house.findUnique({
      where: {
        id: houseId,
      },
    });
    const newHouseInfo = await house.update({
      where: {
        id: houseId,
      },
      data: {
        ...orginalHouseInfo,
        ...req.body,
      },
    });

    res.json(newHouseInfo);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

export {
  getAllHouses,
  deleteHouseById,
  getOneHouse,
  createOneHouse,
  updateOneHouse,
};
