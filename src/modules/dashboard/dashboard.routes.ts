import { FastifyInstance } from 'fastify'
import { DashboardController } from './dashboard.controller'
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function dashboardRoutes(app: FastifyInstance) {
  const controller = new DashboardController()

  app.get(
    '/dashboard',
    { preHandler: authMiddleware },
    controller.index
  )
}
