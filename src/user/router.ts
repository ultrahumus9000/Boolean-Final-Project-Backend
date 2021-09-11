import { Router } from "express";
import { createNewUser, deleteUser } from "./controller";

const userRouter = Router();

userRouter.post("/", createNewUser);
userRouter.delete("/", deleteUser);

export default userRouter;
