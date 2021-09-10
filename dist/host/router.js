"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const hostRouter = (0, express_1.Router)();
hostRouter.post("/host", controller_1.getHostProfile);
hostRouter.get("/houses", controller_1.fetchHouseForHost);
hostRouter.get("/switch", controller_1.switchToGuest);
exports.default = hostRouter;
