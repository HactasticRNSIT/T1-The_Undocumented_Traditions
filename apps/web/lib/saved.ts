export type SavedTradition = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  img: string;
  savedAt: string;
};

const SAVED_KEY = "heritagevault_saved_items";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export function normalizeMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function getSavedItems(): SavedTradition[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SAVED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SavedTradition[];
    const normalized = parsed.map((item) => ({ ...item, img: normalizeMediaUrl(item.img) }));
    // Keep stored data upgraded so old broken relative paths get fixed.
    localStorage.setItem(SAVED_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return [];
  }
}

function setSavedItems(items: SavedTradition[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export function isSaved(id: string): boolean {
  return getSavedItems().some((item) => item.id === id);
}

export function toggleSaved(item: Omit<SavedTradition, "savedAt">): boolean {
  const items = getSavedItems();
  const exists = items.some((x) => x.id === item.id);
  if (exists) {
    setSavedItems(items.filter((x) => x.id !== item.id));
    return false;
  }
  setSavedItems([{ ...item, savedAt: new Date().toISOString() }, ...items]);
  return true;
}

export function addSavedItem(item: Omit<SavedTradition, "savedAt">) {
  const items = getSavedItems();
  const exists = items.some((x) => x.id === item.id);
  if (exists) return;
  setSavedItems([{ ...item, savedAt: new Date().toISOString() }, ...items]);
}

export function removeSaved(id: string) {
  setSavedItems(getSavedItems().filter((x) => x.id !== id));
}
