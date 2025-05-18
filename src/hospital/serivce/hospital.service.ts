import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterHospitalDto } from '../dto/hospital.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async registerHospital(
    data: RegisterHospitalDto,
  ): Promise<{ name: string; email: string }> {
    if (!data || !data.password) {
      throw new BadRequestException('Password is required');
    }

    const existingHospital = await this.prisma.hospital.findFirst({
      where: { email: data.email },
    });

    if (existingHospital) {
      throw new ConflictException('Email already in use');
    }

    try {
      const hashPassword = await bcrypt.hash(data.password, 10);

      const hospital = await this.prisma.hospital.create({
        data: {
          ...data,
          password: hashPassword,
        },
      });

      const { name, email } = hospital;
      return hospital;
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async updateHospital(
    hospitalId: string,
    data: Omit<Partial<RegisterHospitalDto>, 'password'>,
  ): Promise<{ name: string; email: string }> {
    const existingHospital = await this.prisma.hospital.findFirst({
      where: { id: hospitalId },
    });

    if (!existingHospital) {
      throw new ConflictException('Hospital not registered');
    }

    const hospital = await this.prisma.hospital.update({
      where: { id: hospitalId },
      data: data,
    });

    const { name, email } = hospital;
    return { name, email };
  }
  async findHospitalById(
    hospitalId: string,
  ): Promise<{ name: string; email: string }> {
    const hospital = await this.prisma.hospital.findFirst({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new BadRequestException('Hospital NotFound');
    }
    const { name, email } = hospital;
    return { name, email };
  }
  async findAllHospital(filters?: {
    search?: string;
    city?: string;
    isVerified?: boolean;
    state?: string;
    country?: string;
    pagination?: { page?: number; limit?: number };
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { country: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (typeof filters?.isVerified === 'boolean') {
      where.isVerified = filters.isVerified;
    }

    if (filters?.city) {
      where.city = { equals: filters.city, mode: 'insensitive' };
    }

    if (filters?.state) {
      where.state = { equals: filters.state, mode: 'insensitive' };
    }

    if (filters?.country) {
      where.country = { equals: filters.country, mode: 'insensitive' };
    }

    const page = filters?.pagination?.page || 1;
    const limit = filters?.pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [count, data] = await this.prisma.$transaction([
      this.prisma.hospital.count({ where }),
      this.prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      page,
      limit,
      totalPages,
      count,
      hasNextPage,
      hasPreviousPage,
    };
  }
}
