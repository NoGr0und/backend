import { FastifyRequest, FastifyReply } from 'fastify'
import { DashboardService } from './dashboard.service'

export class DashboardController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string; role: string; companyId?: string | null };

    const metrics = await DashboardService.getMetrics(user)

    return reply.send(metrics)
  }
}
