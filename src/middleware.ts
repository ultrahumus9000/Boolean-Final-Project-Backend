import { NextFunction, Request, Response } from "express";
import { validateToken } from "./authgenerator";
import { JwtPayload } from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

declare global {
  namespace Express {
    interface Request {
      currentUser:
        | { id: number; username: string; role: string }
        | JwtPayload
        | undefined
        | string;
    }
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  let userData = token && validateToken(token);

  if (userData) {
    req.currentUser = userData;
    console.log("line 27", userData);
    next();
  } else {
    res.status(401).json("You need to be logged in to access this data");
  }
};

// const cloudinaryObj = cloudinary.v2.config({
//   cloud_name: "dbgddkrl6",
//   api_key: "466338443968922",
//   api_secret: process.env.API_SECRET,
// })

cloudinary.config({
  cloud_name: "dbgddkrl6",
  api_key: "466338443968922",
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

// uploadMiddleware is the reusable bit. Add specific key we're expecting in the specific router you need it for.
// uploadMiddleware.array("pictures")  <<< this bit in router path.
// expressjs.multer docs.
export const uploadMiddleware = multer({ storage });
