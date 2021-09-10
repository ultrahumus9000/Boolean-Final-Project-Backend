"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authRouter = (0, express_1.Router)();
authRouter.route("/login").post(controller_1.login);
authRouter.route("/logout").get(controller_1.logout);
authRouter.route("/token").get(controller_1.validateLoggedInToken);
exports.default = authRouter;
