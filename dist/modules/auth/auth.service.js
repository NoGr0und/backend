"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email },
        });
        if (!user) {
            throw new Error('Email invalido');
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('senha invalida');
        }
        const token = jsonwebtoken_1.default.sign({ role: user.role, sub: user.id, email: user.email, companyId: user.companyId }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            },
        };
    }
}
exports.AuthService = AuthService;
