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

  async listByLead(leadId: string, userId: string) {
    return prisma.note.findMany({
      where: {
        leadId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listByClient(clientId: string, userId: string) {
    return prisma.note.findMany({
      where: {
        clientId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
