import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: {
          firstName: true,
          lastName: true,
        },
        compute(user) {
          return (
            (user.firstName ?? "Anonymous") +
            (user.lastName ? `" "${user.lastName} ` : "")
          );
        },
      },
      modifiedImage: {
        needs: {
          image: true,
        },
        compute(user) {
          if (user?.image) {
            return "/optimizedImages/" + user?.image.split(".")[0] + ".webp";
          }
        },
      },
    },
    post: {
      modifiedImage: {
        needs: {
          image: true,
        },
        compute(post) {
          return "/optimizedImages/" + post?.image.split(".")[0] + ".webp";
        },
      },
      modifiedUpdatedAt: {
        needs: {
          updatedAt: true,
        },
        compute(post) {
          return post?.updatedAt.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        },
      },
    },
    image: {
      path: {
        needs: { path: true },
        compute(image) {
          return "/optimizedImages/" + image.path.split(".")[0] + ".webp";
        },
      },
    },
  },
});
