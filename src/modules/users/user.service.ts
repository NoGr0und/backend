import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  companyId: string;
  role: "ADMIN" | "USER";
}

export class UserService {
  async createUser(data: CreateUserInput) {
    const companyName = data.companyName?.trim();
    if (!companyName) {
      throw new Error("Empresa obrigatoria");
    }

    // Se a empresa não existir, cria. Quem cria vira ADMIN.
    const existing = await prisma.company.findUnique({
      where: { name: companyName },
    });
    const company =
      existing ??
      (await prisma.company.create({ data: { name: companyName } }));
    const role = existing ? "USER" : "ADMIN";

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role,
        companyId: company.id,
      },
    });
    return user;
  }

  async getMe(userId: string) {
    return prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        company: { select: { id: true, name: true } },
      },
    });
  }

  async listUsersByCompany(companyId: string) {
    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastSeenAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  }

  async createEmployee(data: CreateEmployeeInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        companyId: data.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateRole(companyId: string, userId: string, role: "ADMIN" | "USER") {
    const updated = await prisma.user.updateMany({
      where: { id: userId, companyId },
      data: { role },
    });
    if (updated.count === 0) return null;
    return prisma.user.findFirst({
      where: { id: userId, companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async deactivateUser(companyId: string, userId: string) {
    const updated = await prisma.user.updateMany({
      where: { id: userId, companyId },
      data: { isActive: false },
    });
    return updated.count > 0;
  }
}
