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
exports.modifiedHouses = exports.getFilteredHouses = void 0;
const database_1 = __importDefault(require("../database"));
const { house } = database_1.default;
const queryContent = {
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
                src: true,
                alt: true,
            },
        },
    },
};
function getFilteredHouses(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let { city, checkIn, checkOut, maxGuests } = query;
        console.log(query);
        try {
            const filteredHouses = yield house.findMany(Object.assign({ where: {
                    AND: [
                        { maxGuests: { gte: parseInt(maxGuests) } },
                        { city: { contains: city, mode: "insensitive" } },
                    ],
                    NOT: {
                        bookings: {
                            some: {
                                AND: [
                                    { start: { lte: new Date(checkOut).toISOString() } },
                                    { end: { gte: new Date(checkIn).toISOString() } },
                                ],
                            },
                        },
                    },
                } }, queryContent));
            console.log("filteredHouses", filteredHouses);
            return filteredHouses;
        }
        catch (error) {
            throw new Error();
        }
    });
}
exports.getFilteredHouses = getFilteredHouses;
function modifiedHouses(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstModifiedData = data.map((house) => {
            let hostUsername = house.hostProfile.user.username;
            let hostAvatarLink = house.hostProfile.user.avatar;
            let filteredReviews = house.reviews.map((review) => {
                const modifedReview = {
                    content: review.content,
                    guestUsername: review.guestProfile.user.username,
                    guestAvatar: review.guestProfile.user.avatar,
                };
                return modifedReview;
            });
            let modifiedHouse = Object.assign(Object.assign({}, house), { hostProfile: hostUsername, hostAvatar: hostAvatarLink, reviews: filteredReviews });
            return modifiedHouse;
        });
        return firstModifiedData;
    });
}
exports.modifiedHouses = modifiedHouses;
