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
exports.deleteOneBooking = exports.getAllBookingsforGuest = exports.getAllBookingsForHost = exports.createBooking = void 0;
const runtime_1 = require("@prisma/client/runtime");
const database_1 = __importDefault(require("../database"));
const { booking, user, hostProfile } = database_1.default;
function createBooking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        const { total, start, end, houseId } = req.body;
        let startDate = new Date(start);
        let endDate = new Date(end);
        console.log("houseid", houseId);
        console.log("houseid", Number(houseId));
        try {
            const guestInfo = yield user.findUnique({
                where: {
                    id,
                },
                include: {
                    guestProfile: true,
                },
            });
            let realGuestId = 0;
            if (guestInfo === null) {
                return;
            }
            if (guestInfo.guestProfile === null) {
                return;
            }
            if (guestInfo === null || guestInfo === void 0 ? void 0 : guestInfo.guestRole) {
                realGuestId = guestInfo.guestProfile.id;
            }
            const checkBookingStartDate = yield booking.findFirst({
                where: {
                    id: Number(houseId),
                    AND: [
                        {
                            start: {
                                lte: startDate.toISOString(),
                            },
                        },
                        {
                            end: {
                                gte: startDate.toISOString(),
                            },
                        },
                    ],
                },
            });
            const checkBookingEndDate = yield booking.findFirst({
                where: {
                    id: Number(houseId),
                    AND: [
                        {
                            start: {
                                lte: endDate.toISOString(),
                            },
                        },
                        {
                            end: {
                                gte: endDate.toISOString(),
                            },
                        },
                    ],
                },
            });
            // 1 within  07/09- 11/09, example, 08/09-09/09 2 not within 07/09- 11/09 08/09-14/09
            //3 not within 07/09- 11/09 06/09-10/09
            // id           Int          @id @default(autoincrement())
            // total        Int          @default(0)
            // guestProfile GuestProfile @relation(fields: [guestId], references: [id], onDelete: Cascade)
            // guestId      Int
            // start        DateTime     @unique @db.Date
            // end          DateTime     @unique @db.Date
            // house        House        @relation(fields: [houseId], references: [id])
            // houseId      Int
            if (checkBookingEndDate === null && checkBookingStartDate === null) {
                console.log("i can book");
                const newBooking = yield booking.create({
                    data: {
                        total: total,
                        guestId: realGuestId,
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        houseId: Number(houseId),
                    },
                });
                res.json(newBooking);
            }
            else {
                throw new Error("you can not book this hotel");
            }
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientInitializationError) {
                if (error.errorCode === "P2002") {
                    res.json("repeat data");
                }
                else {
                    res.json(error.message);
                }
            }
            else {
                const newError = error;
                res.json(newError.message);
            }
            console.log("error:", error);
        }
    });
}
exports.createBooking = createBooking;
function getAllBookingsForHost(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        try {
            const hostProfileInfo = yield user.findUnique({
                where: {
                    id,
                },
                include: {
                    hostProfile: true,
                },
            });
            const hostProfileId = (_a = hostProfileInfo === null || hostProfileInfo === void 0 ? void 0 : hostProfileInfo.hostProfile) === null || _a === void 0 ? void 0 : _a.id;
            const foundBookings = yield hostProfile.findUnique({
                where: {
                    id: hostProfileId,
                },
                include: {
                    houses: {
                        select: {
                            city: true,
                            pictures: true,
                            name: true,
                            bookings: {
                                select: {
                                    start: true,
                                    end: true,
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
                                    total: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });
            //this give you all houses with bookings
            const firstModifiedBookings = foundBookings === null || foundBookings === void 0 ? void 0 : foundBookings.houses;
            const secondModifiedBookings = firstModifiedBookings === null || firstModifiedBookings === void 0 ? void 0 : firstModifiedBookings.map((allBookingsForOnehouse) => {
                const newbookings = allBookingsForOnehouse.bookings.map((booking) => {
                    const newBooking = {
                        houseName: allBookingsForOnehouse.name,
                        houseId: allBookingsForOnehouse.pictures[0].houseId,
                        start: booking.start,
                        end: booking.end,
                        total: booking.total,
                        name: booking.guestProfile.user.username,
                        avatar: booking.guestProfile.user.avatar,
                        city: allBookingsForOnehouse.city,
                        pictureSrc: allBookingsForOnehouse.pictures[0].src,
                        pictureAlt: allBookingsForOnehouse.pictures[0].alt,
                        bookingId: booking.id,
                    };
                    return newBooking;
                });
                const modifiedAllBookingsForOneHouse = [...newbookings];
                return modifiedAllBookingsForOneHouse;
            });
            if ((secondModifiedBookings === null || secondModifiedBookings === void 0 ? void 0 : secondModifiedBookings.length) === undefined) {
                res.json("no booking for now");
                return;
            }
            const finalAllBookings = [];
            for (let i = 0; i < (secondModifiedBookings === null || secondModifiedBookings === void 0 ? void 0 : secondModifiedBookings.length); i++) {
                const houseAccociatedBookings = secondModifiedBookings[i];
                finalAllBookings.push(...houseAccociatedBookings);
            }
            res.json(finalAllBookings);
        }
        catch (error) {
            res.json({ message: "error" });
        }
    });
}
exports.getAllBookingsForHost = getAllBookingsForHost;
function getAllBookingsforGuest(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        try {
            const guestInfo = yield user.findUnique({
                where: {
                    id,
                },
                include: {
                    guestProfile: true,
                },
            });
            let realGuestId = 0;
            if (guestInfo === null || guestInfo === void 0 ? void 0 : guestInfo.guestProfile) {
                realGuestId = (_a = guestInfo === null || guestInfo === void 0 ? void 0 : guestInfo.guestProfile) === null || _a === void 0 ? void 0 : _a.id;
            }
            const rawData = yield booking.findMany({
                where: {
                    guestId: realGuestId,
                },
                select: {
                    id: true,
                    start: true,
                    end: true,
                    total: true,
                    house: {
                        select: {
                            id: true,
                            name: true,
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
                            pictures: true,
                        },
                    },
                },
            });
            const firstFilterData = rawData.map((booking) => {
                const newBooking = {
                    bookingId: booking.id,
                    houseId: booking.house.id,
                    city: booking.house.city,
                    houseName: booking.house.name,
                    name: booking.house.hostProfile.user.username,
                    avatar: booking.house.hostProfile.user.avatar,
                    pictureSrc: booking.house.pictures[0].src,
                    pictureAlt: booking.house.pictures[0].alt,
                    start: booking.start,
                    end: booking.end,
                    total: booking.total,
                };
                return newBooking;
            });
            res.json(firstFilterData);
        }
        catch (error) {
            const errorList = error;
            res.json(error);
            console.log("error:", error);
        }
    });
}
exports.getAllBookingsforGuest = getAllBookingsforGuest;
function deleteOneBooking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookingId = Number(req.params.id);
        console.log("i am deleting");
        try {
            yield booking.delete({
                where: {
                    id: bookingId,
                },
            });
            res.json("you successfully deleted");
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.deleteOneBooking = deleteOneBooking;
