import { Router } from "express";

import { getGuestProfile, switchToHost } from "./controller";

const guestRouter = Router();

guestRouter.post("/guest", getGuestProfile);

guestRouter.get("/switch", switchToHost);

export default guestRouter;
