import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BloodTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlood(bloodType: string) {
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
}
