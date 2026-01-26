import { prisma } from '../../lib/prisma'

export class DashboardService {
  static async getMetrics(userId: string) {
    const [
      totalClients,
      totalLeads,
      leadsByStatus,
      notesCount
    ] = await Promise.all([
      prisma.client.count({
        where: { userId }
      }),

      prisma.lead.count({
        where: { userId }
      }),

      prisma.lead.groupBy({
        by: ['status'],
        where: { userId },
        _count: true
      }),

      prisma.note.count({
        where: { userId }
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
