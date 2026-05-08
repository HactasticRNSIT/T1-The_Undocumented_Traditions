import { Router } from "express";
import crypto from "node:crypto";
import { connectDb } from "../services/db.js";
import { UserModel } from "../models/User.js";

const router = Router();

function initials(name: string) {
  return name
    .split(" ")
    .map((chunk) => chunk[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

async function saveMockUser(name: string, email: string) {
  await connectDb();
  const doc = await UserModel.findOneAndUpdate(
    { email },
    { name, email, initials: initials(name || email.split("@")[0]) || "HV" },
    { upsert: true, new: true }
  ).catch(() => null);
  return {
    id: doc?._id?.toString() ?? crypto.randomUUID(),
    name: doc?.name ?? name,
    email: doc?.email ?? email,
    initials: doc?.initials ?? (initials(name) || "HV")
  };
}

router.post("/mock/login", async (req, res) => {
  const email = req.body?.email || "demo@heritagevault.ai";
  const name = req.body?.name || email.split("@")[0];
  const user = await saveMockUser(name, email);
  res.json({ token: `mock.jwt.${Buffer.from(email).toString("base64url")}`, user });
});

router.post("/mock/signup", async (req, res) => {
  const email = req.body?.email || "new@heritagevault.ai";
  const name = req.body?.name || email.split("@")[0];
  const user = await saveMockUser(name, email);
  res.json({ token: `mock.jwt.${Buffer.from(email).toString("base64url")}`, user });
});

router.post("/mock/logout", (_req, res) => {
  res.json({ ok: true });
});

export default router;
