import axios from "axios";

const jobs = new Map();

/**
 * Create job
 */
export function createJob(prompt) {
  const id = crypto.randomUUID();

  jobs.set(id, {
    id,
    status: "queued",
    prompt,
    videoUrl: null,
    error: null
  });

  processJob(id);
  return id;
}

/**
 * Process job async
 */
async function processJob(id) {
  const job = jobs.get(id);
  if (!job) return;

  job.status = "processing";

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

    const videoUrl =
      res.data?.video?.url ||
      res.data?.output?.video?.url ||
      null;

    if (!videoUrl) throw new Error("No video URL returned");

    job.status = "completed";
    job.videoUrl = videoUrl;

  } catch (err) {
    job.status = "failed";
    job.error = err.message;
  }
}

/**
 * Get job
 */
export function getJob(id) {
  return jobs.get(id);
}
