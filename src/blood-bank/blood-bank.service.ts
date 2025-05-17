import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBloodBankDto, UpdateBloodBankDto } from './dto/blood-bank.dto';

export class BloodBankService {
  constructor(private readonly prisma: PrismaService) {}
  async createBloodBank(createBloodBankDto: CreateBloodBankDto) {
    const { name, address, hospitalId, phoneNumber } = createBloodBankDto;

    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new Error('Hospital not found');
    }

    // Check if blood bank with same name already exists
    const existingBloodBank = await this.prisma.bloodBank.findFirst({
      where: { name },
    });

    if (existingBloodBank) {
      throw new Error('Blood bank with this name already exists');
    }

    return this.prisma.bloodBank.create({
      data: {
        name,
        address,
        hospital: { connect: { id: hospitalId } },
        phoneNumber,
      },
      include: {
        hospital: true,
      },
    });
  }

  async getBloodBankById(id: string) {
    return this.prisma.bloodBank.findUnique({
      where: { id },
      include: {
        hospital: true,
      },
    });
  }

  async getAllBloodBanks(hospitalId?: string) {
    const where = hospitalId ? { hospitalId } : {};
    return this.prisma.bloodBank.findMany({
      where,
      include: {
        hospital: true,
      },
    });
  }

  async updateBloodBank(id: string, updateBloodBankDto: UpdateBloodBankDto) {
    const { name, address, phoneNumber } = updateBloodBankDto;

    const bloodBank = await this.prisma.bloodBank.findUnique({
      where: { id },
    });

    if (!bloodBank) {
      throw new Error('Blood bank not found');
    }

    // Check if blood bank with same name already exists
    if (name && name !== bloodBank.name) {
      const existingBloodBank = await this.prisma.bloodBank.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });

      if (existingBloodBank) {
        throw new Error('Blood bank with this name already exists');
      }
    }

    return this.prisma.bloodBank.update({
      where: { id },
      data: {
        name,
        address,
        phoneNumber,
      },
      include: {
        hospital: true,
      },
    });
  }

  async deleteBloodBank(id: string) {
    const bloodBank = await this.prisma.bloodBank.findUnique({
      where: { id },
    });

    if (!bloodBank) {
      throw new Error('Blood bank not found');
    }

    return this.prisma.bloodBank.delete({
      where: { id },
    });
  }

  async getBloodBanksByHospital(hospitalId: string) {
    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new Error('Hospital not found');
    }

    return this.prisma.bloodBank.findMany({
      where: { hospitalId },
      include: {
        hospital: true,
      },
    });
  }
}
