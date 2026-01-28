import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';

export class AuthService {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email },
        })

        if (!user) {
            throw new Error('Email invalido')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new Error('senha invalida')
        }

        const token = jwt.sign(
            { role: user.role, sub: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        return { 
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
        }
    }
}
