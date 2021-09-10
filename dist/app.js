"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./user/router"));
const router_2 = __importDefault(require("./auth/router"));
const middleware_1 = __importDefault(require("./middleware"));
const router_3 = __importDefault(require("./house/router"));
const router_4 = __importDefault(require("./review/router"));
const router_5 = __importDefault(require("./guest/router"));
const router_6 = __importDefault(require("./host/router"));
const router_7 = __importDefault(require("./booking/router"));
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var app = express();
//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// house routes has to be put before token check so that everyone can view houses
app.use("/houses", router_3.default);
app.use("/users", router_1.default);
// here until ready to move down.
//check token
app.use(router_2.default);
app.use(middleware_1.default);
// general routes
app.use("/reviews", router_4.default);
app.use("/bookings", router_7.default);
app.use("/guests", router_5.default);
app.use("/hosts", router_6.default);
app.all("*", (req, res) => {
    res.status(400).json("No Routes");
});
module.exports = app;
