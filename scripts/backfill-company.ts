import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    const defaultName = 'Empresa Default';
    let company = await prisma.company.findUnique({ where: { name: defaultName } });
    if (!company) {
      company = await prisma.company.create({ data: { name: defaultName } });
    }

    const users = await prisma.user.findMany({
      where: { companyId: null },
      select: { id: true },
    });

    for (const u of users) {
      await prisma.user.update({ where: { id: u.id }, data: { companyId: company.id } });
    }

    await prisma.client.updateMany({
      where: { companyId: null },
      data: { companyId: company.id },
    });
    await prisma.lead.updateMany({
      where: { companyId: null },
      data: { companyId: company.id },
    });
    await prisma.note.updateMany({
      where: { companyId: null },
      data: { companyId: company.id },
    });

    console.log('backfilled users', users.length, 'companyId', company.id);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

