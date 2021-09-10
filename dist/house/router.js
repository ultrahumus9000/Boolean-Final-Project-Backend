"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controller_1 = require("./controller");
const houseRouter = (0, express_1.Router)();
houseRouter.get("/", controller_1.getAllHouses);
houseRouter.get("/:id", controller_1.getOneHouse);
houseRouter.patch("/:id", controller_1.updateOneHouse);
// uploadMiddleware is the reusable bit. Add specific key we're expecting.
houseRouter.post("/", middleware_1.uploadMiddleware.array("pictures"), controller_1.createOneHouse);
houseRouter.delete("/:id", controller_1.deleteHouseById);
exports.default = houseRouter;
