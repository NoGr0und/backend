"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = require("../../lib/prisma");
class DashboardService {
    static async getMetrics(user) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        const baseWhere = user.role === "ADMIN" ? { companyId: user.companyId } : { userId: user.sub };
        const [totalClients, totalLeads, leadsByStatus, notesCount] = await Promise.all([
            prisma_1.prisma.client.count({
                where: baseWhere
            }),
            prisma_1.prisma.lead.count({
                where: baseWhere
            }),
            prisma_1.prisma.lead.groupBy({
                by: ['status'],
                where: baseWhere,
                _count: true
            }),
            prisma_1.prisma.note.count({
                where: baseWhere
            })
        ]);
        return {
            totalClients,
            totalLeads,
            leadsByStatus,
            notesCount
        };
    }
}
exports.DashboardService = DashboardService;
