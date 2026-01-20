import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import redis from "./redis.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "Mochi backend running (no auth)" });
});

/**
 * Submit job (NO AUTH)
 */
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: "Prompt required" });
  }

  const jobId = uuidv4();

  await redis.hset(`job:${jobId}`, {
    status: "queued",
    prompt
  });

  await redis.lpush("mochi:queue", jobId);

  res.json({
    success: true,
    job_id: jobId
  });
});

/**
 * Job status (PUBLIC)
 */
app.get("/api/status/:id", async (req, res) => {
  const job = await redis.hgetall(`job:${req.params.id}`);

  if (!job || !job.status) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    status: job.status,
    videoUrl: job.videoUrl || null,
    error: job.error || null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT} (NO AUTH)`);
});
