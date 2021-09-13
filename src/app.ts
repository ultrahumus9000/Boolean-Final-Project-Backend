import userRouter from "./user/router";
import authRouter from "./auth/router";
import tokenMiddleware from "./middleware";
import houseRouter from "./house/router";
import reviewRouter from "./review/router";
import guestRouter from "./guest/router";
import hostRouter from "./host/router";
import bookingRouter from "./booking/router";

var express = require("express");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var app = express();

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// house routes has to be put before token check so that everyone can view houses
app.use("/houses", houseRouter);

app.use("/users", userRouter);

// here until ready to move down.

//check token
app.use(authRouter);

app.use(tokenMiddleware);
// general routes
app.use("/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/guests", guestRouter);
app.use("/hosts", hostRouter);

app.all(
  "*",
  (
    req: Request,
    res: {
      status: (arg0: number) => {
        json: { (arg0: string): void };
      };
    }
  ) => {
    res.status(400).json("No Routes");
  }
);

module.exports = app;
