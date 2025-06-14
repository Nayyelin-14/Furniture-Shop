import { prisma } from "../../config/prismaClient";

export type ProductTypes = {
  name: string;
  description: string;
  price: number;
  discount: number;
  inventory: number;
  productTags: string[];
  category: string;
  image: string;
  type: string;
  images: string[];
};
export const createSingleProduct = async (productData: ProductTypes) => {
  let productDataToCreate: any = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    discount: productData.discount,
    inventory: productData.inventory,
    images: {
      create: productData.images, //you're explicitly telling Prisma: "For each object in productData.images, create a new Image record and link it to this product."
    },
    category: {
      connectOrCreate: {
        where: {
          name: productData.category,
        },
        create: {
          name: productData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: productData.type },
        create: { name: productData.type },
      },
    },
  };
  if (productData.productTags && productData.productTags.length > 0) {
    productDataToCreate.productTags = {
      connectOrCreate: productData.productTags?.map((tagName: string) => ({
        where: {
          name: tagName,
        },
        create: {
          name: tagName,
        },
      })),
    };
  }
  return prisma.product.create({
    data: productDataToCreate,
  });
};

export const getSingelProduct = async (productId: number) => {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
    },
  });
};

export const updateSingleProduct = async (
  productId: number,
  productData: ProductTypes
) => {
  let productDataToCreate: any = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    discount: productData.discount,
    inventory: productData.inventory,

    category: {
      connectOrCreate: {
        where: {
          name: productData.category,
        },
        create: {
          name: productData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: productData.type },
        create: { name: productData.type },
      },
    },
  };
  if (productData.productTags && productData.productTags.length > 0) {
    productDataToCreate.productTags = {
      set: [],
      connectOrCreate: productData.productTags?.map((tagName: string) => ({
        where: {
          name: tagName,
        },
        create: {
          name: tagName,
        },
      })),
    };
  }
  if (productData.images && productData.images.length > 0) {
    productDataToCreate.images = {
      deleteMany: {},
      create: productData.images,
    };
  }
  return prisma.product.update({
    where: { id: productId },
    data: productDataToCreate,
  });
};

export const deleteProductById = async (productId: number) => {
  return prisma.product.delete({
    where: { id: Number(productId) },
  });
};

export const getProductWithRealations = async (productId: number) => {
  return prisma.product.findUnique({
    where: { id: productId },
    omit: { categoryId: true, typeId: true, createdAt: true, updatedAt: true },
    include: {
      images: {
        select: { id: true, path: true },
      },
    },
  });
};

export const getAllProductListByPagi = async (options: any) => {
  return await prisma.product.findMany(options);
};

export const getAllCatAndType = async () => {
  const categories = await prisma.category.findMany();
  const types = await prisma.type.findMany();

  return { categories, types };
};
