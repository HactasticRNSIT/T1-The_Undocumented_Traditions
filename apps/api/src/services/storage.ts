import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";
interface MediaUploadResult {
  filename: string;
  url: string;
  mimeType: string;
}

const uploadRoot = path.resolve("apps/api/uploads");

function firebaseBucket() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!projectId || !clientEmail || !privateKey || !bucket) return null;
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      storageBucket: bucket
    });
  }
  return admin.storage().bucket();
}

export async function storeMedia(localPath: string, originalName: string, mimeType: string): Promise<MediaUploadResult> {
  const bucket = firebaseBucket();
  if (bucket) {
    const destination = `heritagevault/${Date.now()}-${originalName}`;
    await bucket.upload(localPath, { destination, contentType: mimeType });
    await fs.promises.unlink(localPath);
    return {
      filename: originalName,
      mimeType,
      url: `https://storage.googleapis.com/${bucket.name}/${destination}`
    };
  }

  await fs.promises.mkdir(uploadRoot, { recursive: true });
  const safeName = `${Date.now()}-${originalName}`;
  const dest = path.join(uploadRoot, safeName);
  await fs.promises.copyFile(localPath, dest);
  await fs.promises.unlink(localPath);
  return {
    filename: originalName,
    mimeType,
    url: `/uploads/${safeName}`
  };
}
