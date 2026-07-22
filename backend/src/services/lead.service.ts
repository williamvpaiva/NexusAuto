import { prisma } from '../config/prisma';

export class LeadService {
  static async ingestWebhook(data: any) {
    const { name, phone, email, source, interest } = data;
    
    // Auto Qualification based on data richness
    let score = 0;
    if (phone) score += 5;
    if (email) score += 5;
    if (interest) score += 10;
    
    const status = score > 10 ? 'QUALIFICADO' : 'NOVO';

    // Round robin logic: find a SALES user who has the least assigned leads
    let assignedToId = null;
    const salesUsers = await prisma.user.findMany({
      where: { role: 'SALES' },
      select: { id: true, _count: { select: { leads: true } } },
      orderBy: { leads: { _count: 'asc' } },
      take: 1
    });

    if (salesUsers.length > 0) {
      assignedToId = salesUsers[0].id;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        source,
        score,
        status,
        assignedToId
      }
    });

    return lead;
  }
}
