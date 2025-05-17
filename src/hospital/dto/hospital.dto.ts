import { BloodBank, Role, User } from 'generated/prisma';

export class RegisterHospitalDto {
  name: string;
  address: string;
  password: string;
  phoneNumber: string;
  registrationId: string;
  isVerified: boolean;
  email: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
