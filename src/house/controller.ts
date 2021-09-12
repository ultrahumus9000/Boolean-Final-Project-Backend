import { Picture, User, House } from ".prisma/client";
import { Request, Response } from "express";
import db from "../database";
import { getFilteredHouses, modifiedHouses } from "./service";
import { Query } from "./service";
import { queryContent } from "./service";
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

type FormPicture = {
  id: number;
  alt: string;
  src: string;
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
        ...queryContent,
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
      ...queryContent,
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

// {
//   "id": 23,
//   "name": "seren",
//   "bedrooms": 1,
//   "maxGuests": 5,
//   "facility": [
//       "Balcony",
//       "Bathtub",
//       "Bidet",
//       "Jacuzzi"
//   ],
//   "city": "Sheffield",
//   "hostProfile": "Barrows123",
//   "price": 60,
//   "reviews": [],
//   "pictures": [
//       {
//           "id": 42,
//           "src": "https://res.cloudinary.com/dbgddkrl6/image/upload/v1631393863/cxxjjeckhfxj6r0qquzz.jpg",
//           "alt": "whole house"
//       },
//       {
//           "id": 0,
//           "src": "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
//           "alt": "any"
//       }
//   ],
//   "hostAvatar": "https://images.pexels.com/photos/2648203/pexels-photo-2648203.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
// }

async function updateOneHouse(req: Request, res: Response) {
  const houseId = Number(req.params.id);
  const updatedHouse = req.body;
  let {
    id,
    hostProfile,
    hostAvatar,
    reviews,
    pictures,
    bedrooms,
    maxGuests,
    price,
    ...basicHouseInfo
  } = updatedHouse;

  basicHouseInfo = {
    ...basicHouseInfo,
    bedrooms: parseInt(bedrooms),
    maxGuests: parseInt(maxGuests),
    price: parseInt(price),
  };

  const newPictures = pictures.filter(
    (picture: FormPicture) => picture.id <= 0
  );

  console.log("newPictures line 217", newPictures);

  const orginalPicturesLeft = pictures.filter(
    (picture: FormPicture) => picture.id > 0
  );

  const modifiedorginalPicturesLeftIds = orginalPicturesLeft.map(
    (picture: FormPicture) => picture.id
  );

  // console.log("orginalPicturesLeft", modifiedorginalPicturesLeftIds);

  try {
    const orginalPictures = await picture.findMany({
      where: {
        houseId,
      },
      select: {
        id: true,
      },
    });

    const modifiedOriginalPicturesIds = orginalPictures.map(
      (picture) => picture.id
    );
    // console.log("orginalPictures", modifiedOriginalPicturesIds);

    let deletedPicturesIds = modifiedOriginalPicturesIds.filter((pictureId) => {
      return modifiedorginalPicturesLeftIds.indexOf(pictureId) === -1;
    });

    // console.log("deletedPicturesIds", deletedPicturesIds);

    if (deletedPicturesIds.length) {
      const deletedArray = deletedPicturesIds.map(async (pictureId) => {
        await picture.delete({
          where: {
            id: pictureId,
          },
        });
        return true;
      });

      await Promise.all(deletedArray);
    }

    if (newPictures.length) {
      console.log("i am creating");
      const newAddedResults = newPictures.map(
        async (newPicture: FormPicture) => {
          const pictureObj = await picture.create({
            data: {
              houseId,
              alt: newPicture.alt,
              src: newPicture.src,
            },
          });
          return pictureObj;
        }
      );

      await Promise.all(newAddedResults);
    }
    const newHouseInfo = await house.update({
      where: {
        id: houseId,
      },
      data: {
        ...basicHouseInfo,
      },
      ...queryContent,
    });

    console.log(newHouseInfo);
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
