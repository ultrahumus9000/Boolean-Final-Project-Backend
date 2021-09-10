import { Request, Response } from "express";
import db from "../database";

import { User } from "@prisma/client";

const { user } = db;

async function getGuestProfile(req: Request, res: Response) {
  const { username } = req.body;

  try {
    const guest = await user.findUnique({
      where: {
        username,
      },
      include: {
        guestProfile: {
          select: {
            bio: true,
          },
        },
      },
    });
    const modifiedGuest = {
      ...guest,
      bio: guest?.guestProfile?.bio,
    };
    delete modifiedGuest.guestProfile;
    res.json(modifiedGuest);
  } catch (error) {
    res.json(error);
  }
}

async function switchToHost(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  try {
    const userInfo = await user.findUnique({
      where: {
        id,
      },
    });
    if (userInfo?.hostRole) {
      res.json("true");
    } else {
      res.json("false");
    }
  } catch (error) {
    res.status(401).json(error);
  }
}

export { getGuestProfile, switchToHost };
