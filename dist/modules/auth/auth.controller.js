"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async login(request, reply) {
        const { email, password } = request.body;
        try {
            const result = await this.authService.login(email, password);
            return reply.send(result);
        }
        catch (error) {
            return reply.code(401).send({ message: 'Email ou senha Invalidos' });
        }
    }
}
exports.AuthController = AuthController;
