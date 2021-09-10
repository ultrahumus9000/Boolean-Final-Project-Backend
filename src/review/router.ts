import { Router } from "express";
import createNewReview from "./controller";

const reviewRouter = Router();
reviewRouter.post("/", createNewReview);

export default reviewRouter;
