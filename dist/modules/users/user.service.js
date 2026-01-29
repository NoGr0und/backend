"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    async createUser(data) {
        const companyName = data.companyName?.trim();
        if (!companyName) {
            throw new Error("Empresa obrigatoria");
        }
        // Se a empresa não existir, cria. Quem cria vira ADMIN.
        const existing = await prisma_1.prisma.company.findUnique({
            where: { name: companyName },
        });
        const company = existing ??
            (await prisma_1.prisma.company.create({ data: { name: companyName } }));
        const role = existing ? "USER" : "ADMIN";
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role,
                companyId: company.id,
            },
        });
        return user;
    }
    async getMe(userId) {
        return prisma_1.prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
                company: { select: { id: true, name: true } },
            },
        });
    }
    async listUsersByCompany(companyId) {
        const users = await prisma_1.prisma.user.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                lastSeenAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return users;
    }
    async createEmployee(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                companyId: data.companyId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        return user;
    }
    async updateRole(companyId, userId, role) {
        const updated = await prisma_1.prisma.user.updateMany({
            where: { id: userId, companyId },
            data: { role },
        });
        if (updated.count === 0)
            return null;
        return prisma_1.prisma.user.findFirst({
            where: { id: userId, companyId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async deactivateUser(companyId, userId) {
        const updated = await prisma_1.prisma.user.updateMany({
            where: { id: userId, companyId },
            data: { isActive: false },
        });
        return updated.count > 0;
    }
}
exports.UserService = UserService;
