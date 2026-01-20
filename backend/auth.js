import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redis from "./redis.js";

export async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false });
  }

  const exists = await redis.get(`user:${email}`);
  if (exists) {
    return res.status(400).json({ success: false });
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  await redis.set(
    `user:${email}`,
    JSON.stringify({ id: userId, email, password: hash })
  );

  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET);

  res.json({ success: true, token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const data = await redis.get(`user:${email}`);
  if (!data) {
    return res.status(401).json({ success: false });
  }

  const user = JSON.parse(data);
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ success: false });
  }

  const token = jwt.sign(
    { id: user.id, email },
    process.env.JWT_SECRET
  );

  res.json({ success: true, token });
}
