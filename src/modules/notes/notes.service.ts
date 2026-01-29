import { prisma } from "../../lib/prisma";

type AuthUser = { sub: string; role: string; companyId?: string | null };

export class NoteService {
  private async createInternal(data: {
    content: string;
    leadId?: string;
    clientId?: string;
    userId: string;
    role: string;
    companyId: string;
  }) {
    if (!data.leadId && !data.clientId) {
      throw new Error("Nota deve estar vinculada a um lead ou client");
    }

    if (data.leadId) {
      const lead = await prisma.lead.findFirst({
        where: {
          id: data.leadId,
          companyId: data.companyId,
          ...(data.role !== "ADMIN" ? { userId: data.userId } : {}),
          deletedAt: null,
        },
      });

      if (!lead) {
        throw new Error("Lead não encontrado");
      }
    }

    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          companyId: data.companyId,
          ...(data.role !== "ADMIN" ? { userId: data.userId } : {}),
          deletedAt: null,
        },
      });

      if (!client) {
        throw new Error("Client não encontrado");
      }
    }

    const noteData: any = {
      content: data.content,
      userId: data.userId,
      companyId: data.companyId,
    };

    if (data.leadId) {
      noteData.leadId = data.leadId;
    }

    if (data.clientId) {
      noteData.clientId = data.clientId;
    }
    return prisma.note.create({
      data: noteData,
    });
  }

  async createVisible(user: AuthUser, payload: { content: string; leadId?: string; clientId?: string }) {
    if (!user.companyId) throw new Error("User sem empresa");
    return this.createInternal({
      ...payload,
      userId: user.sub,
      role: user.role,
      companyId: user.companyId,
    });
  }

  async listByLead(
    leadId: string,
    userId: string,
    search?: string,
    page = 1,
    limit = 10
  ) {
    const where: {
      leadId: string;
      userId: string;
      deletedAt: Date | null;
      content?: { contains: string; mode: "insensitive" };
    } = {
      leadId,
      userId,
      deletedAt: null,
    };

    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    return prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async listByClient(
    clientId: string,
    userId: string,
    search?: string,
    page = 1,
    limit = 10
  ) {
    const where: {
      clientId: string;
      userId: string;
      deletedAt: Date | null;
      content?: { contains: string; mode: "insensitive" };
    } = {
      clientId,
      userId,
      deletedAt: null,
    };

    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    return prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async listByLeadVisible(
    user: AuthUser,
    leadId: string,
    search?: string,
    page = 1,
    limit = 10
  ) {
    if (!user.companyId) throw new Error("User sem empresa");
    const where: any = {
      leadId,
      companyId: user.companyId,
      deletedAt: null,
    };
    if (user.role !== "ADMIN") {
      where.userId = user.sub;
    }
    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }
    const skip = (page - 1) * limit;
    return prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async listByClientVisible(
    user: AuthUser,
    clientId: string,
    search?: string,
    page = 1,
    limit = 10
  ) {
    if (!user.companyId) throw new Error("User sem empresa");
    const where: any = {
      clientId,
      companyId: user.companyId,
      deletedAt: null,
    };
    if (user.role !== "ADMIN") {
      where.userId = user.sub;
    }
    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }
    const skip = (page - 1) * limit;
    return prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async listAllVisible(user: AuthUser, search?: string, page = 1, limit = 50) {
    if (!user.companyId) throw new Error("User sem empresa");
    const where: {
      companyId: string;
      userId?: string;
      deletedAt: Date | null;
      content?: { contains: string; mode: "insensitive" };
    } = {
      companyId: user.companyId,
      deletedAt: null,
    };

    if (user.role !== "ADMIN") {
      where.userId = user.sub;
    }

    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    return prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByIdVisible(noteId: string, user: AuthUser) {
    if (!user.companyId) throw new Error("User sem empresa");
    return prisma.note.findFirst({
      where: {
        id: noteId,
        companyId: user.companyId,
        ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
        deletedAt: null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async softDeleteVisible(noteId: string, user: AuthUser) {
    if (!user.companyId) throw new Error("User sem empresa");
    return prisma.note.updateMany({
      where: {
        id: noteId,
        companyId: user.companyId,
        ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
