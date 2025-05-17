import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BloodTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createBloodType(bloodType: string) {
    const existing = await this.prisma.bloodGroup.findFirst({
      where: { bloodType: bloodType },
    });

    if (existing) {
      throw new BadRequestException('Blood type already exists');
    }

    await this.prisma.bloodGroup.create({
      data: { bloodType: bloodType },
    });

    return { status: HttpStatus.CREATED, message: 'Blood type created' };
  }
  async findBloodType(bloodType: string) {
    const existingBloodType = await this.prisma.bloodGroup.findFirst({
      where: { bloodType: bloodType },
    });

    if (!existingBloodType) {
      throw new BadRequestException('Blood type not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Blood type found',
      data: existingBloodType,
    };
  }
}
