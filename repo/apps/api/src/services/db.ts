import mongoose from "mongoose";

let connected = false;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri || connected) return;
  await mongoose.connect(uri);
  connected = true;
}
