import { Worker } from "bullmq";
import { redisConnection } from "../../../config/redisClient";
import path from "path";
import sharp from "sharp";

const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    console.log(job);
    const { filePath, fileName, width, height, quality } = job.data;

    const optimizedImagePath = path.join(
      __dirname,
      "../../../upload/optimizedImages",
      fileName
    );

    await sharp(filePath)
      .resize(width, height)
      .webp({ quality })
      .toFile(optimizedImagePath);
  },
  { connection: redisConnection }
);

imageWorker.on("completed", (job) => {
  console.log(`Job is completed ${job!.id}`);
});

imageWorker.on("failed", (job, error) => {
  console.log(`Job is  ${job!.id} failed  with ${error.message}`);
});
