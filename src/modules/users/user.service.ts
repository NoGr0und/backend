
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export class UserService {
    async createUser(data: CreateUserInput) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
        return user;
        
    }
    
async listUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return users;
    }
}
