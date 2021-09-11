import { User } from ".prisma/client";
import { Request, Response } from "express";
import db from "../database";

import createNewUserWithHash from "./service";

const { hostProfile, guestProfile, user } = db;

async function createNewUser(req: Request, res: Response) {
  const newUser = req.body;
  try {
    const modifiedUser = await createNewUserWithHash(newUser);

    if (newUser.guestRole) {
      const result = await guestProfile.create({
        data: {
          bio: newUser.bio,
          userId: modifiedUser.id,
        },
      });
      res.json(result);
    } else {
      const result = await hostProfile.create({
        data: {
          bio: newUser.bio,
          userId: modifiedUser.id,
        },
      });
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

async function deleteUser(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  try {
    await user.delete({
      where: {
        id,
      },
    });
    res.json("deleted");
  } catch (error) {
    res.status(401).json(error);
  }
}

export { createNewUser, deleteUser };
