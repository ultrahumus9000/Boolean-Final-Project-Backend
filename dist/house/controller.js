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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneHouse = exports.createOneHouse = exports.getOneHouse = exports.deleteHouseById = exports.getAllHouses = void 0;
const database_1 = __importDefault(require("../database"));
const service_1 = require("./service");
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
                const rawData = yield house.findMany({
                    select: {
                        id: true,
                        name: true,
                        bedrooms: true,
                        maxGuests: true,
                        facility: true,
                        city: true,
                        hostProfile: {
                            select: {
                                user: {
                                    select: {
                                        username: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        price: true,
                        reviews: {
                            select: {
                                content: true,
                                guestProfile: {
                                    select: {
                                        user: {
                                            select: {
                                                username: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        pictures: {
                            select: {
                                id: true,
                                src: true,
                                alt: true,
                            },
                        },
                    },
                });
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
            console.log("i am successfull deleting");
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
            const targetHouse = yield house.findUnique({
                where: {
                    id: houseId,
                },
                select: {
                    id: true,
                    name: true,
                    bedrooms: true,
                    maxGuests: true,
                    facility: true,
                    city: true,
                    hostProfile: {
                        select: {
                            user: {
                                select: {
                                    username: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                    price: true,
                    reviews: {
                        select: {
                            content: true,
                            guestProfile: {
                                select: {
                                    user: {
                                        select: {
                                            username: true,
                                            avatar: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    pictures: {
                        select: {
                            id: true,
                            src: true,
                            alt: true,
                        },
                    },
                },
            });
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
function updateOneHouse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const houseId = Number(req.params.id);
        try {
            const orginalHouseInfo = yield house.findUnique({
                where: {
                    id: houseId,
                },
            });
            const newHouseInfo = yield house.update({
                where: {
                    id: houseId,
                },
                data: Object.assign(Object.assign({}, orginalHouseInfo), req.body),
            });
            res.json(newHouseInfo);
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.updateOneHouse = updateOneHouse;
