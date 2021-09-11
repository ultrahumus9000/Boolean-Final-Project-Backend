"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const authgenerator_1 = require("./authgenerator");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
exports.default = (req, res, next) => {
    const { token } = req.cookies;
    let userData = token && (0, authgenerator_1.validateToken)(token);
    if (userData) {
        req.currentUser = userData;
        console.log("line 27", userData);
        next();
    }
    else {
        res.status(401).json("You need to be logged in to access this data");
    }
};
// const cloudinaryObj = cloudinary.v2.config({
//   cloud_name: "dbgddkrl6",
//   api_key: "466338443968922",
//   api_secret: process.env.API_SECRET,
// })
cloudinary_1.v2.config({
    cloud_name: "dbgddkrl6",
    api_key: "466338443968922",
    api_secret: process.env.API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
});
// uploadMiddleware is the reusable bit. Add specific key we're expecting in the specific router you need it for.
// uploadMiddleware.array("pictures")  <<< this bit in router path.
// expressjs.multer docs.
exports.uploadMiddleware = (0, multer_1.default)({ storage });
