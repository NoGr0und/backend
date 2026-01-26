import { FastifyRequest, FastifyReply } from 'fastify'
import { DashboardService } from './dashboard.service'

export class DashboardController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string };
    const userId = user.sub

    const metrics = await DashboardService.getMetrics(userId)

    return reply.send(metrics)
  }
}
