import { Worker } from "bullmq";
import { redisConnection } from "../../../config/redisClient";

const cacheWorker = new Worker(
  "cache-invalidation",
  async (job) => {
    const { pattern } = job.data; // "user:*" ဆိုတဲ့ Redis key pattern
    console.log(pattern);
    await invalidateCache(pattern);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

cacheWorker.on("completed", (job) => {
  console.log(`Job is completed ${job!.id}`);
});

cacheWorker.on("failed", (job, error) => {
  console.log(`Job is  ${job!.id} failed  with ${error.message}`);
});

const invalidateCache = async (pattern: string) => {
  try {
    const stream = redisConnection.scanStream({
      match: pattern, //pattern က "user:*" ဆိုရင် "user:1", "user:2" စတာတွေရှာတယ်။
      count: 100,
    });
    console.log("stream", stream);
    const pipeLine = redisConnection.pipeline(); //Redis မှာ commands တော်တော်များများတစ်ခါတည်းလုပ်ချင်ရင် pipeline သုံး
    console.log(pipeLine, "pipeline");

    let totalKeys = 0;
    //process keys in batches
    stream.on("data", (keys: string[]) => {
      // works if found pattern
      if (keys.length > 0) {
        keys.forEach((key) => {
          pipeLine.del(key);
          totalKeys++;
        });
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", async () => {
        try {
          if (totalKeys > 0) {
            await pipeLine.exec(); // Redis key တွေကိုတစ်ခါတည်းဖျက်
            console.log(`Invalidated ${totalKeys}`);
          }
          resolve();
        } catch (execError) {
          console.error(execError);
          reject(execError);
        }
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.log("Invalidation error", error);
    throw error;
  }
};

//Worker	Queue မှ job ကို လက်ခံပြီး အလုပ်လုပ်တယ်
// concurrency: 5	Job ၅ ခုကိုတစ်ပြိုင်နက်အလုပ်လုပ်နိုင်တယ်
// scanStream	Redis ထဲက key တွေကို memory ကောင်းကောင်းနဲ့ရှာတယ်
// pipeline	Redis command တွေကို batch-wise run ပေးတယ်
// pattern: "user:*"	"user:" နဲ့စတဲ့ key အကုန်ဖျက်တယ်
