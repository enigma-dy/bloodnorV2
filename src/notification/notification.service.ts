import { PrismaClient } from '@prisma/client';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notificattion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { title, message, userId } = createNotificationDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.notification.create({
      data: {
        title,
        message,
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
      },
    });
  }

  async getNotificationById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async getAllNotifications(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.notification.findMany({
      where,
      include: {
        user: true,
      },
    });
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    const { title, message } = updateNotificationDto;

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        title,
        message,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteNotification(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async getUserNotifications(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  // async markNotificationAsRead(id: string) {
  //   const notification = await this.prisma.notification.findUnique({
  //     where: { id },
  //   });

  //   if (!notification) {
  //     throw new Error('Notification not found');
  //   }

  //   return this.prisma.notification.update({where:{id:id}})
  // }
}
