import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getKPIs() {
    const totalItems = await this.prisma.item.count();
    const stockSum = await this.prisma.item.aggregate({
      _sum: { stock: true },
    });
    const totalOrders = await this.prisma.picking.count();

    const pickings = await this.prisma.picking.findMany({
      select: { createdAt: true, updatedAt: true },
    });
    let avgProcessing = 0;
    if (pickings.length > 0) {
      const totalMs = pickings.reduce((acc, p) => {
        return acc + (p.updatedAt.getTime() - p.createdAt.getTime());
      }, 0);
      avgProcessing = totalMs / pickings.length;
    }
    const hours = Math.floor(avgProcessing / 3600000);
    const minutes = Math.floor((avgProcessing % 3600000) / 60000);

    return {
      items: totalItems,
      stock: stockSum._sum.stock ?? 0,
      orders: totalOrders,
      incidents: 0,
      averageProcessingTime: `${hours}h ${minutes}m`,
    };
  }

  getNotifications() {
    return this.notificationsService.getPendingNotifications();
  }
}
