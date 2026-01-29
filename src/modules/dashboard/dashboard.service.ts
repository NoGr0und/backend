import { prisma } from '../../lib/prisma'

export class DashboardService {
  static async getMetrics(user: { sub: string; role: string; companyId?: string | null }) {
    if (!user.companyId) {
      throw new Error("User sem empresa");
    }

    const baseWhere = user.role === "ADMIN" ? { companyId: user.companyId } : { userId: user.sub };
    const [
      totalClients,
      totalLeads,
      leadsByStatus,
      notesCount
    ] = await Promise.all([
      prisma.client.count({
        where: baseWhere
      }),

      prisma.lead.count({
        where: baseWhere
      }),

      prisma.lead.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: true
      }),

      prisma.note.count({
        where: baseWhere
      })
    ])

    return {
      totalClients,
      totalLeads,
      leadsByStatus,
      notesCount
    }
  }
}
