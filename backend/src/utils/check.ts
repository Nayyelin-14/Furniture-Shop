import { errorCode } from "../../config/errorCode";
import { handleError } from "./handleError";

export const checkIfPostExists = async (post: any) => {
  if (!post) {
    throw handleError("Post doesn't exist", 409, errorCode.invalid);
  }
};

export const checkIfProductExists = async (product: any) => {
  if (!product) {
    throw handleError("Product doesn't exist", 409, errorCode.invalid);
  }
};
