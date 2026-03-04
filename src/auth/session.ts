export type AuthUser = {
  name: string;
  email: string;
  createdAt: string;
};

const AUTH_STORAGE_KEY = "playmarket.auth.user";
const AUTH_EVENT = "playmarket-auth-changed";

function safeParseUser(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<AuthUser>;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.email !== "string" || typeof parsed.name !== "string") {
      return null;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      createdAt:
        typeof parsed.createdAt === "string"
          ? parsed.createdAt
          : new Date().toISOString(),
    } satisfies AuthUser;
  } catch {
    return null;
  }
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;
  return safeParseUser(window.localStorage.getItem(AUTH_STORAGE_KEY));
}

function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  notifyAuthChange();
}

export function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY) callback();
  };

  const onAuthChange = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_EVENT, onAuthChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_EVENT, onAuthChange);
  };
}
