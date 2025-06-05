import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserByPhone = async (phone: string) => {
  return prisma.user.findUnique({
    where: {
      phone,
    },
  });
};

export const getOtpByPhone = async (phone: string) => {
  return prisma.otp.findUnique({
    where: {
      phone,
    },
  });
};
export const storeOtp = (optData: any) => {
  return prisma.otp.create({
    data: optData,
  });
};
export const updateOtp = (optData: any, id: number) => {
  return prisma.otp.update({
    where: { id },
    data: optData,
  });
};

export const createNewUser = (userData: any) => {
  return prisma.user.create({
    data: userData,
  });
};

export const updateUser = (userData: any, id: number) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};
export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};
