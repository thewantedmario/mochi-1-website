import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

/**
 * Download video & upload to storage
 */
export async function saveVideoToStorage(videoUrl, jobId) {
  const response = await axios.get(videoUrl, {
    responseType: "arraybuffer"
  });

  const key = `videos/${jobId}.mp4`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: response.data,
      ContentType: "video/mp4"
    })
  );

  return `${process.env.S3_PUBLIC_URL}/${key}`;
}
