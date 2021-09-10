import { User } from "@prisma/client";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import db from "../database";
const { review } = db;
async function createNewReview(req: Request, res: Response) {
  const { id } = req.currentUser as User;
  //req.body only need content and houseId
  const newReview = req.body;
  console.log(newReview);
  try {
    const newReviewResult = await review.create({
      data: {
        content: newReview.content,
        houseId: newReview.houseId,
        guestId: id,
      },
    });
    res.json(newReviewResult);
  } catch (error) {
    console.log(error);
  }
}

export default createNewReview;
