import { Router } from "express";
import { createNewUser } from "./controller";

const userRouter = Router();

userRouter.post("/", createNewUser);

export default userRouter;
