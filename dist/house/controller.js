"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneHouse = exports.createOneHouse = exports.getOneHouse = exports.deleteHouseById = exports.getAllHouses = void 0;
const database_1 = __importDefault(require("../database"));
const service_1 = require("./service");
const service_2 = require("./service");
const { house, picture, hostProfile, user } = database_1.default;
function getAllHouses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("query", Object.keys(req.query).length);
        try {
            if (Object.keys(req.query).length) {
                const rawData = yield (0, service_1.getFilteredHouses)(req.query);
                const houses = yield (0, service_1.modifiedHouses)(rawData);
                res.json(houses);
            }
            else {
                const rawData = yield house.findMany(Object.assign({}, service_2.queryContent));
                const houses = yield (0, service_1.modifiedHouses)(rawData);
                res.json(houses);
            }
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.getAllHouses = getAllHouses;
function deleteHouseById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const houseId = Number(req.params.id);
        console.log("houseId", houseId);
        console.log("type of houseId", typeof houseId);
        try {
            yield house.delete({
                where: {
                    id: houseId,
                },
            });
            res.json("this house of listing is deleted ");
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.deleteHouseById = deleteHouseById;
function getOneHouse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const houseId = Number(req.params.id);
        try {
            const targetHouse = yield house.findUnique(Object.assign({ where: {
                    id: houseId,
                } }, service_2.queryContent));
            if (targetHouse === null || targetHouse === void 0 ? void 0 : targetHouse.pictures.length) {
                const modifiedHouse = yield (0, service_1.modifiedHouses)([targetHouse]);
                res.json(modifiedHouse[0]);
            }
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.getOneHouse = getOneHouse;
// media storage in cloud - Cloudinary
// npm i multer-storage-cloudinary cloudinary
function createOneHouse(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        console.log("request body", req.body);
        const { name, city, bedrooms, maxGuests, facility, price } = req.body;
        const pictures = req.files;
        const images = pictures === null || pictures === void 0 ? void 0 : pictures.map((picture) => {
            var fields = picture.originalname.split(".");
            var houseAlt = fields[0];
            const newPicture = {
                src: picture.path,
                alt: houseAlt,
            };
            return newPicture;
        });
        try {
            const hostInfo = yield user.findUnique({
                where: {
                    id,
                },
                select: {
                    hostProfile: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            const realHostId = (_a = hostInfo === null || hostInfo === void 0 ? void 0 : hostInfo.hostProfile) === null || _a === void 0 ? void 0 : _a.id;
            if (realHostId === undefined) {
                return;
            }
            const newHouse = yield house.create({
                data: {
                    name: name,
                    city: city,
                    pictures: {
                        createMany: {
                            data: [...images],
                        },
                    },
                    bedrooms: parseInt(bedrooms),
                    maxGuests: parseInt(maxGuests),
                    facility: facility,
                    price: parseInt(price),
                    hostId: realHostId,
                },
            });
            res.json(newHouse);
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.createOneHouse = createOneHouse;
// model House {
//   id          Int         @id @default(autoincrement())
//   name        String
//   bedrooms    Int
//   maxGuests   Int
//   facility    String[]
//   city        String
//   wishList    WishList[]
//   hostProfile HostProfile @relation(fields: [hostId], references: [id], onDelete: Cascade)
//   hostId      Int
//   price       Int
//   reviews     Review[]
//   pictures    Picture[]
//   bookings    Booking[]
// }
// {
//   "id": 23,
//   "name": "seren",
//   "bedrooms": 1,
//   "maxGuests": 5,
//   "facility": [
//       "Balcony",
//       "Bathtub",
//       "Bidet",
//       "Jacuzzi"
//   ],
//   "city": "Sheffield",
//   "hostProfile": "Barrows123",
//   "price": 60,
//   "reviews": [],
//   "pictures": [
//       {
//           "id": 42,
//           "src": "https://res.cloudinary.com/dbgddkrl6/image/upload/v1631393863/cxxjjeckhfxj6r0qquzz.jpg",
//           "alt": "whole house"
//       },
//       {
//           "id": 0,
//           "src": "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
//           "alt": "any"
//       }
//   ],
//   "hostAvatar": "https://images.pexels.com/photos/2648203/pexels-photo-2648203.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
// }
function updateOneHouse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const houseId = Number(req.params.id);
        const updatedHouse = req.body;
        let { id, hostProfile, hostAvatar, reviews, pictures, bedrooms, maxGuests, price } = updatedHouse, basicHouseInfo = __rest(updatedHouse, ["id", "hostProfile", "hostAvatar", "reviews", "pictures", "bedrooms", "maxGuests", "price"]);
        basicHouseInfo = Object.assign(Object.assign({}, basicHouseInfo), { bedrooms: parseInt(bedrooms), maxGuests: parseInt(maxGuests), price: parseInt(price) });
        const newPictures = pictures.filter((picture) => picture.id <= 0);
        const orginalPicturesLeft = pictures.filter((picture) => picture.id > 0);
        const modifiedorginalPicturesLeftIds = orginalPicturesLeft.map((picture) => picture.id);
        // console.log("orginalPicturesLeft", modifiedorginalPicturesLeftIds);
        try {
            const orginalPictures = yield picture.findMany({
                where: {
                    houseId,
                },
                select: {
                    id: true,
                },
            });
            const modifiedOriginalPicturesIds = orginalPictures.map((picture) => picture.id);
            console.log("orginalPictures", modifiedOriginalPicturesIds);
            let deletedPicturesIds = modifiedOriginalPicturesIds.filter((pictureId) => {
                return modifiedorginalPicturesLeftIds.indexOf(pictureId) === -1;
            });
            // console.log("deletedPicturesIds", deletedPicturesIds);
            if (!deletedPicturesIds.length) {
                const deletedArray = deletedPicturesIds.map((pictureId) => __awaiter(this, void 0, void 0, function* () {
                    yield picture.delete({
                        where: {
                            id: pictureId,
                        },
                    });
                    return true;
                }));
                yield Promise.all(deletedArray);
            }
            if (!newPictures.length) {
                const newAddedResults = newPictures.map((newPicture) => __awaiter(this, void 0, void 0, function* () {
                    yield picture.create({
                        data: {
                            houseId,
                            alt: newPicture.alt,
                            src: newPicture.src,
                        },
                    });
                    return true;
                }));
                yield Promise.all(newAddedResults);
            }
            const newHouseInfo = yield house.update(Object.assign({ where: {
                    id: houseId,
                }, data: Object.assign({}, basicHouseInfo) }, service_2.queryContent));
            console.log(newHouseInfo);
            res.json(newHouseInfo);
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.updateOneHouse = updateOneHouse;
