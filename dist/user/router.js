"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const userRouter = (0, express_1.Router)();
userRouter.post("/", controller_1.createNewUser);
userRouter.delete("/", controller_1.deleteUser);
exports.default = userRouter;
