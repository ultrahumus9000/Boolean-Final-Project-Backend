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
exports.fetchHouseForHost = exports.switchToGuest = exports.getHostProfile = void 0;
const database_1 = __importDefault(require("../database"));
const { user, house } = database_1.default;
function getHostProfile(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.body;
        try {
            const host = yield user.findUnique({
                where: {
                    username,
                },
                include: {
                    hostProfile: {
                        select: {
                            bio: true,
                        },
                    },
                },
            });
            const modifiedGuest = Object.assign(Object.assign({}, host), { bio: (_a = host === null || host === void 0 ? void 0 : host.hostProfile) === null || _a === void 0 ? void 0 : _a.bio });
            delete modifiedGuest.hostProfile;
            res.json(modifiedGuest);
        }
        catch (error) {
            res.json(error);
        }
    });
}
exports.getHostProfile = getHostProfile;
function switchToGuest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        try {
            const userInfo = yield user.findUnique({
                where: {
                    id,
                },
            });
            if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.guestRole) {
                res.json("true");
            }
            else {
                res.json("false");
            }
        }
        catch (error) {
            res.status(401).json(error);
        }
    });
}
exports.switchToGuest = switchToGuest;
function fetchHouseForHost(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
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
            const houses = yield house.findMany({
                where: {
                    hostId: realHostId,
                },
                include: {
                    pictures: {
                        select: {
                            id: true,
                            src: true,
                        },
                    },
                },
            });
            const modifiedHouses = houses.map((house) => {
                const modifiedHouse = Object.assign(Object.assign({}, house), { pictures: house.pictures[0].src });
                return modifiedHouse;
            });
            res.json(modifiedHouses);
        }
        catch (error) {
            console.log(error);
            res.json(error);
        }
    });
}
exports.fetchHouseForHost = fetchHouseForHost;
