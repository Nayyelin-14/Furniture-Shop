import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSettingStatus = async (settingKey: string) => {
  return prisma.setting.findUnique({
    where: {
      key: settingKey,
    },
  });
};

export const createOrUpdateSettingStatus = async (
  settingKey: string,
  settingValue: string
) => {
  return prisma.setting.upsert({
    where: {
      key: settingKey,
    },
    update: {
      value: settingValue,
    },
    create: {
      key: settingKey,
      value: settingValue,
    },
  });
};
