import axios from "axios";
import dotenv from "dotenv";
import redis from "./redis.js";
import { saveVideoToStorage } from "./storage.js";

dotenv.config();

console.log("🧠 Mochi worker with storage started");

async function work() {
  while (true) {
    const jobData = await redis.brpop("mochi:queue", 0);
    const jobId = jobData[1];

    const jobKey = `job:${jobId}`;
    const job = await redis.hgetall(jobKey);

    if (!job.prompt) continue;

    await redis.hset(jobKey, { status: "processing" });

    try {
      const res = await axios.post(
        "https://fal.run/fal-ai/mochi-v1",
        {
          prompt: job.prompt,
          num_frames: 120,
          fps: 24,
          resolution: "480p"
        },
        {
          headers: {
            Authorization: `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const tempVideoUrl =
        res.data?.video?.url ||
        res.data?.output?.video?.url;

      if (!tempVideoUrl) throw new Error("No video URL returned");

      // 🔥 SAVE TO STORAGE
      const storedVideoUrl = await saveVideoToStorage(
        tempVideoUrl,
        jobId
      );

      await redis.hset(jobKey, {
        status: "completed",
        videoUrl: storedVideoUrl
      });

    } catch (err) {
      await redis.hset(jobKey, {
        status: "failed",
        error: err.message
      });
    }
  }
}

work();
