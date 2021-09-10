import { User } from "@prisma/client";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import db from "../database";
const { review, user } = db;
async function createNewReview(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  //req.body only need content and houseId
  try {
    const guestInfo = await user.findUnique({
      where: {
        id,
      },
      select: {
        guestProfile: {
          select: {
            id: true,
          },
        },
      },
    });
    const realGuestId = guestInfo?.guestProfile?.id;
    if (realGuestId === undefined) {
      return;
    }

    const newReview = req.body;

    const newReviewResult = await review.create({
      data: {
        content: newReview.content,
        houseId: newReview.houseId,
        guestId: realGuestId,
      },
    });
    res.json(newReviewResult);
  } catch (error) {
    console.log(error);
  }
}

export default createNewReview;
