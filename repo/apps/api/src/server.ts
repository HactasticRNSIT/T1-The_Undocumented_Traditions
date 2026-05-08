import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import authRouter from "./routes/auth.js";
import aiRouter from "./routes/ai.js";
import mediaRouter from "./routes/media.js";
import traditionsRouter from "./routes/traditions.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.resolve("apps/api/uploads")));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/ai", aiRouter);
app.use("/media", mediaRouter);
app.use("/traditions", traditionsRouter);

const port = Number(process.env.API_PORT || 4000);
app.listen(port, () => {
  console.log(`HeritageVault API listening on ${port}`);
});
