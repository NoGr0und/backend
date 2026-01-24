import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController()

    app.post('/login', (request, reply) => {
        return authController.login(request, reply)})   
}