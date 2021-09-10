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
const { review } = database_1.default;
function createNewReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.currentUser;
        //req.body only need content and houseId
        const newReview = req.body;
        console.log(newReview);
        try {
            const newReviewResult = yield review.create({
                data: {
                    content: newReview.content,
                    houseId: newReview.houseId,
                    guestId: id,
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
