import { errorCode } from "../../config/errorCode";
import { handleError } from "./handleError";

export const checkIfPostExists = async (post: any) => {
  if (!post) {
    throw handleError("Post doesn't exist", 400, errorCode.invalid);
  }
};
