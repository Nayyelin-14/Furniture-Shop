import { Queue } from "bullmq";
import { redisConnection } from "../../../config/redisClient";
const imageQueue = new Queue("imageQueue", { connection: redisConnection });

export default imageQueue;
