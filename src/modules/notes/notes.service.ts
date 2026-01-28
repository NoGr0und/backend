import { prisma } from "../../lib/prisma";


export class NoteService {
  async create(data: {
    content: string;
    leadId?: string;
    clientId?: string;
    userId: string;

  }) {
    if (!data.leadId && !data.clientId) {
      throw new Error('Nota deve estar vinculada a um lead ou client');
    }

    if (data.leadId) {
      const lead = await prisma.lead.findFirst({
        where: {
          id: data.leadId,
          userId: data.userId,
          deletedAt: null,
        },
      });

      if (!lead) {
        throw new Error('Lead não encontrado');
      }
    }

    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          userId: data.userId,
          deletedAt: null,
        },
      });

      if (!client) {
        throw new Error('Client não encontrado');
      }
    }

    const noteData: any = {
      content: data.content,
      userId: data.userId,
    };

    if (data.leadId) {
      noteData.leadId = data.leadId;
    }

    if (data.clientId) {
      noteData.clientId = data.clientId;
    }
      return prisma.note.create({
      data: noteData
    });
  }

  async listByLead(leadId: string, userId: string, search?: string, page = 1, limit = 10) {
    const where: { leadId: string; userId: string; deletedAt: Date | null; content?: { contains: string; mode: "insensitive" } } = {
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
        createdAt: 'desc',
      },
    });
  }

  async listByClient(clientId: string, userId: string, search?: string, page = 1, limit = 10) {
    const where: { clientId: string; userId: string; deletedAt: Date | null; content?: { contains: string; mode: "insensitive" } } = {
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
        createdAt: 'desc',
      },
    });
  }

  async findById(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        deletedAt: null,
      },
    });
  }

  async softDelete(noteId: string, userId: string) {
    return prisma.note.updateMany({
      where: { id: noteId, userId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
