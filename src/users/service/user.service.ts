import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashPass,
        bloodGroupId: bloodGroupExists.id,
      },
    });

    const { email, password } = newUser;
    return { email, password };
  }
}
