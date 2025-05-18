import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserType } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(filters?: {
    search?: string;
    bloodType?: string;
    userType?: UserType;
    ageRange?: { min?: number; max?: number };
    country?: string;
    dateRange?: { start?: Date; end?: Date };
    pagination?: { page?: number; limit?: number };
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Blood type filter
    if (filters?.bloodType) {
      where.bloodGroup = {
        bloodType: filters.bloodType,
      };
    }

    // User type filter
    if (filters?.userType) {
      where.userType = filters.userType;
    }

    // Age range filter
    if (filters?.ageRange) {
      where.age = {};
      if (filters.ageRange.min) where.age.gte = filters.ageRange.min;
      if (filters.ageRange.max) where.age.lte = filters.ageRange.max;
    }

    // Country filter
    if (filters?.country) {
      where.country = filters.country;
    }

    // Date range filter (for createdAt)
    if (filters?.dateRange) {
      where.createdAt = {};
      if (filters.dateRange.start)
        where.createdAt.gte = filters.dateRange.start;
      if (filters.dateRange.end) where.createdAt.lte = filters.dateRange.end;
    }

    // Pagination
    const page = filters?.pagination?.page || 1;
    const limit = filters?.pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        omit: {
          password: true,
        },
        include: {
          bloodGroup: {
            select: {
              bloodType: true,
            },
          },
        },
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    if (!user) {
      throw new BadRequestException('UserNotFound');
    }
    return user;
  }

  async registerUser(body: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const bloodGroupExists = await this.prisma.bloodGroup.findUnique({
      where: { bloodType: body.bloodType },
    });

    if (!bloodGroupExists) {
      throw new BadRequestException('Invalid blood group ID');
    }

    const hashPass = await bcrypt.hash(body.password, 10);
    const { bloodType, ...userData } = body;
    const data = {
      ...userData,
      password: hashPass,
      bloodGroupId: bloodGroupExists.id,
    };

    try {
      const newUser = await this.prisma.user.create({
        data: data,
      });
      const { id, email, firstName, lastName, phoneNumber } = newUser;
      return { id, email, firstName, lastName, phoneNumber };
    } catch (error) {
      throw new BadRequestException('Invalid hospital ID provided');
    }
  }

  async editUser(
    userId: string,
    data: Omit<Partial<CreateUserDto>, 'password'>,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    let bloodGroupId = user.bloodGroupId;
    if (data.bloodType) {
      const bloodGroupExists = await this.prisma.bloodGroup.findUnique({
        where: { bloodType: data.bloodType },
      });

      if (!bloodGroupExists) {
        throw new BadRequestException('Invalid blood group');
      }
      bloodGroupId = bloodGroupExists.id;
    }
    const updateData: any = {
      ...data,
      bloodGroupId,
    };

    if (updateData.bloodType) {
      delete updateData.bloodType;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user;
  }

  async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bloodGroup: {
          select: {
            bloodType: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...response } = user;
    return response;
  }

  // async requestVerification(userId:string){
  //   const user = this.findUserById(userId)
  //   user.isVeri

  // }

  // async verifyAcct(userId: string) {
  //   const user = await this.findUserById(userId);
  //   if (!user) {
  //     throw new BadRequestException('user not found');
  //   }
  // }
}
