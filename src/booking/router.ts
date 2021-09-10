import { Router } from "express";

import {
  getAllBookingsForHost,
  createBooking,
  getAllBookingsforGuest,
  deleteOneBooking,
} from "./controller";

const bookingRouter = Router();

bookingRouter.get("/host", getAllBookingsForHost);
bookingRouter.get("/guest", getAllBookingsforGuest);
bookingRouter.post("/", createBooking);
bookingRouter.delete("/:id", deleteOneBooking);

export default bookingRouter;
