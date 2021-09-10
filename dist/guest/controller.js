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
exports.switchToHost = exports.getGuestProfile = void 0;
const database_1 = __importDefault(require("../database"));
const { user } = database_1.default;
function getGuestProfile(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.body;
        try {
            const guest = yield user.findUnique({
                where: {
                    username,
                },
                include: {
                    guestProfile: {
                        select: {
                            bio: true,
                        },
                    },
                },
            });
            const modifiedGuest = Object.assign(Object.assign({}, guest), { bio: (_a = guest === null || guest === void 0 ? void 0 : guest.guestProfile) === null || _a === void 0 ? void 0 : _a.bio });
            delete modifiedGuest.guestProfile;
            res.json(modifiedGuest);
        }
        catch (error) {
            res.json(error);
        }
    });
}
exports.getGuestProfile = getGuestProfile;
function switchToHost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        try {
            const userInfo = yield user.findUnique({
                where: {
                    id,
                },
            });
            if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.hostRole) {
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
exports.switchToHost = switchToHost;
