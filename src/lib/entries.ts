import { User } from "@/lib/auth";

function keyForUser(userId: string) {
  return `entries:${userId}`;
}

export function getEntriesForUser(user: User) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(keyForUser(user.id));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntriesForUser(user: User, entries: unknown[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(keyForUser(user.id), JSON.stringify(entries));
}

// One-time migration helper for pre-account anonymous entries.
export function migrateAnonymousEntriesIfNeeded(user: User) {
  if (typeof window === "undefined") return;
  const userEntries = getEntriesForUser(user);
  if (userEntries.length > 0) return;

  try {
    const anonymousRaw = localStorage.getItem("entries");
    const anonymous = anonymousRaw ? JSON.parse(anonymousRaw) : [];
    if (Array.isArray(anonymous) && anonymous.length > 0) {
      saveEntriesForUser(user, anonymous);
    }
  } catch {
    // ignore parse errors for legacy data
  }
}
