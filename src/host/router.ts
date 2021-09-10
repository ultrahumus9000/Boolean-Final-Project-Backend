import { Router } from "express";
import { HostProfile } from ".prisma/client";

import { getHostProfile, switchToGuest, fetchHouseForHost } from "./controller";

const hostRouter = Router();

hostRouter.post("/host", getHostProfile);

hostRouter.get("/houses", fetchHouseForHost);

hostRouter.get("/switch", switchToGuest);

export default hostRouter;
