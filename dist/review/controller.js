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
const database_1 = __importDefault(require("../database"));
const { review, user } = database_1.default;
function createNewReview(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        //req.body only need content and houseId
        try {
            const guestInfo = yield user.findUnique({
                where: {
                    id,
                },
                select: {
                    guestProfile: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            const realGuestId = (_a = guestInfo === null || guestInfo === void 0 ? void 0 : guestInfo.guestProfile) === null || _a === void 0 ? void 0 : _a.id;
            if (realGuestId === undefined) {
                return;
            }
            const newReview = req.body;
            const newReviewResult = yield review.create({
                data: {
                    content: newReview.content,
                    houseId: newReview.houseId,
                    guestId: realGuestId,
                },
            });
            res.json(newReviewResult);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.default = createNewReview;
