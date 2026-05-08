import { Router } from "express";
import crypto from "node:crypto";
import { connectDb } from "../services/db.js";
import { TraditionModel } from "../models/Tradition.js";

const memory: any[] = [];
const router = Router();

router.post("/", async (req, res) => {
  try {
    await connectDb();
    const saved = await TraditionModel.create(req.body);
    res.json({ ...saved.toObject(), _id: saved._id.toString(), createdAt: saved.createdAt.toISOString() });
  } catch {
    const mock = { ...req.body, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    memory.push(mock);
    res.json(mock);
  }
});

router.get("/:id", async (req, res) => {
  try {
    await connectDb();
    const doc = (await TraditionModel.findById(req.params.id).lean()) as any;
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ ...doc, _id: doc._id.toString(), createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString() });
  } catch {
    const found = memory.find((x) => x._id === req.params.id);
    if (!found) return res.status(404).json({ message: "Not found" });
    return res.json(found);
  }
});

export default router;
