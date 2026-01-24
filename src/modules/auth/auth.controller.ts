import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as { email: string; password: string };

        
        try {
            const result = await this.authService.login(email, password);
            return reply.send(result);
        } catch (error) {
            return console.log(email, password, "aqui"), 
            reply.code(401).send({ message: 'Email ou senha Invalidos' });
        }
    }
} 