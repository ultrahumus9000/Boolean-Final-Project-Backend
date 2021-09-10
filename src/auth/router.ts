import { Router } from "express";
import { login, logout, validateLoggedInToken } from "./controller";

const authRouter = Router();

authRouter.route("/login").post(login);

authRouter.route("/logout").get(logout);

authRouter.route("/token").get(validateLoggedInToken);

export default authRouter;
