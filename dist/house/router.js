"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const middleware_2 = __importDefault(require("../middleware"));
const controller_1 = require("./controller");
const houseRouter = (0, express_1.Router)();
houseRouter.get("/", controller_1.getAllHouses);
houseRouter.get("/:id", controller_1.getOneHouse);
houseRouter.patch("/:id", middleware_2.default, controller_1.updateOneHouse);
// uploadMiddleware is the reusable bit. Add specific key we're expecting.
houseRouter.post("/", middleware_2.default, middleware_1.uploadMiddleware.array("pictures"), controller_1.createOneHouse);
houseRouter.delete("/:id", middleware_2.default, controller_1.deleteHouseById);
exports.default = houseRouter;
