import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToFav = (userId: number, productId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      products: {
        //user model ထဲမှာ ထည့်ထားတဲ့ relation field
        connect: {
          //connect ဆိုတာက related table (product) ထဲက productIdကို ချိတ်ဆက်ဖို့
          id: productId,
        },
      },
    },
  });
};
export const removeFromFav = (userId: number, productId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      products: {
        disconnect: {
          id: productId,
        },
      },
    },
  });
};
