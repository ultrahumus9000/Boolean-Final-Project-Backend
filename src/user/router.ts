import { Router } from "express";
import { createNewUser, deleteUser } from "./controller";
import tokenMiddleware from "../middleware";

const userRouter = Router();

userRouter.post("/", createNewUser);
userRouter.delete("/", tokenMiddleware, deleteUser);

export default userRouter;
