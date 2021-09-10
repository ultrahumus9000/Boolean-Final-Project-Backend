import { User } from "@prisma/client";
import { Request, Response } from "express";
import db from "../database";
const { user, house } = db;

async function getHostProfile(req: Request, res: Response) {
  const { username } = req.body;

  try {
    const host = await user.findUnique({
      where: {
        username,
      },
      include: {
        hostProfile: {
          select: {
            bio: true,
          },
        },
      },
    });

    const modifiedGuest = {
      ...host,
      bio: host?.hostProfile?.bio,
    };

    delete modifiedGuest.hostProfile;

    res.json(modifiedGuest);
  } catch (error) {
    res.json(error);
  }
}

async function switchToGuest(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  try {
    const userInfo = await user.findUnique({
      where: {
        id,
      },
    });
    if (userInfo?.guestRole) {
      res.json("true");
    } else {
      res.json("false");
    }
  } catch (error) {
    res.status(401).json(error);
  }
}

async function fetchHouseForHost(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  try {
    const houses = await house.findMany({
      where: {
        hostId: id,
      },
      include: {
        pictures: {
          select: {
            src: true,
          },
        },
      },
    });

    const modifiedHouses = houses.map((house) => {
      const modifiedHouse = {
        ...house,
        pictures: house.pictures[0].src,
      };
      return modifiedHouse;
    });

    res.json(modifiedHouses);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

export { getHostProfile, switchToGuest, fetchHouseForHost };
