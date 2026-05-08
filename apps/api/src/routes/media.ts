import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { storeMedia } from "../services/storage.js";

const tmpDir = path.resolve("apps/api/tmp");
fs.mkdirSync(tmpDir, { recursive: true });
const upload = multer({ dest: tmpDir });

const router = Router();

router.post("/upload", upload.array("files"), async (req, res) => {
  const files = (req.files || []) as Express.Multer.File[];
  const uploaded = await Promise.all(files.map((f) => storeMedia(f.path, f.originalname, f.mimetype)));
  res.json({ files: uploaded });
});

export default router;
