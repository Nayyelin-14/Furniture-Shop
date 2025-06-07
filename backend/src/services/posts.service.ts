import { prisma } from "../../config/prismaClient";
export type PostTypes = {
  title: string;
  content: string;
  body: string;
  author: number;
  tags: string[];
  category: string;
  image: string;
  type: string;
};
export const createSinglePost = async (postData: PostTypes) => {
  let dataToCreate: any = {
    title: postData.title,
    image: postData.image,
    content: postData.content,
    body: postData.body,
    author: {
      connect: {
        id: postData.author,
      },
    },
    category: {
      connectOrCreate: {
        where: {
          name: postData.category,
        },
        create: {
          name: postData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: postData.type },
        create: { name: postData.type },
      },
    },
  };
  if (postData.tags && postData.tags.length > 0) {
    dataToCreate.postTags = {
      connectOrCreate: postData.tags?.map((tagName) => ({
        where: {
          name: tagName,
        },
        create: {
          name: tagName,
        },
      })),
    };
  }
  return prisma.post.create({
    data: dataToCreate,
  });
};

export const updatePostById = async (postId: number, postData: any) => {
  let dataToUpdate: any = {
    title: postData.title,

    content: postData.content,
    body: postData.body,

    category: {
      connectOrCreate: {
        where: {
          name: postData.category,
        },
        create: {
          name: postData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: postData.type },
        create: { name: postData.type },
      },
    },
  };
  if (postData?.image) {
    dataToUpdate.image = postData.image;
  }
  if (postData.tags && postData.tags.length > 0) {
    dataToUpdate.postTags = {
      set: [],
      connectOrCreate: postData.tags?.map((tagName: string) => ({
        where: {
          name: tagName,
        },
        create: {
          name: tagName,
        },
      })),
    };
  }

  return prisma.post.update({
    where: { id: postId },
    data: dataToUpdate,
  });
};

export const removePostById = async (postid: number) => {
  return prisma.post.delete({
    where: { id: postid },
  });
};

export const getSinglePostById = async (postId: number) => {
  return prisma.post.findUnique({
    where: { id: postId },
  });
};
export const getSinglePostByIdWithRelationships = async (postId: number) => {
  return prisma.post.findUnique({
    where: { id: postId },
    select: {
      body: true,
      content: true,

      modifiedImage: true,
      author: {
        select: {
          fullName: true,
        },
      },
      title: true,
      category: {
        select: { name: true },
      },
      modifiedUpdatedAt: true,
      type: {
        select: {
          name: true,
        },
      },
      postTags: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getAllpostByOffsetOrCursorPagi = async (options: any) => {
  return await prisma.post.findMany(options);
};
