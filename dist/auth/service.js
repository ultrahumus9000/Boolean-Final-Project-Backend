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
const bcrypt_1 = require("bcrypt");
const { user } = database_1.default;
function findUserWithValidation(loginUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUser = yield user.findUnique({
            where: {
                username: loginUser.username,
            },
        });
        if (!foundUser) {
            if (!foundUser)
                throw new Error("Username incorrect");
        }
        const passwordCompareResult = yield (0, bcrypt_1.compare)(loginUser.password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
        if (!passwordCompareResult)
            throw new Error("Password incorrect");
        return foundUser;
    });
}
exports.default = findUserWithValidation;
