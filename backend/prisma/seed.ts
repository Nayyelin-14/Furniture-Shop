import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// const userData: Prisma.UserCreateInput[] = [
//   {
//     phone: "23423452",
//     password: "",
//     randomToken: "132awefqc234q2312xs",
//   },
//   {
//     phone: "234234234",
//     password: "",
//     randomToken: "qwfrwertwert",
//   },
//   {
//     phone: "4234234",
//     password: "",
//     randomToken: "2342rqwerq23rqf",
//   },
//   {
//     phone: "23423424",
//     password: "",
//     randomToken: "wertwergerger",
//   },
//   {
//     phone: "234534534",
//     password: "",
//     randomToken: "rgersgertert",
//   },
// ];
function createRandomUser() {
  return {
    phone: faker.phone.number({ style: "international" }),
    password: "",
    randomToken: faker.internet.jwt(),
  };
}

export const userData = faker.helpers.multiple(createRandomUser, {
  count: 5,
});
async function main() {
  console.log("Start seeding");
  for (const user of userData) {
    const password = await bcrypt.hash(user.phone, 10);
    user.password = password;
    await prisma.user.create({
      data: user,
    });
  }
  console.log("Seeding finished");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
