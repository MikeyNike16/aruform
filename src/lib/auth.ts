export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "aruform_users";
const CURRENT_USER_KEY = "aruform_current_user";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    if (!user?.id || !user?.email) return null;
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function signUp(params: {
  name: string;
  email: string;
  password: string;
}): { ok: true; user: User } | { ok: false; error: string } {
  if (typeof window === "undefined") {
    return { ok: false, error: "Sign up is only available in the browser." };
  }

  const name = params.name.trim();
  const email = normalizeEmail(params.email);
  const password = params.password;

  if (!name || !email || !password) {
    return { ok: false, error: "Please fill out all fields." };
  }

  const users = readUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  const sessionUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return { ok: true, user: sessionUser };
}

export function logIn(params: {
  email: string;
  password: string;
}): { ok: true; user: User } | { ok: false; error: string } {
  if (typeof window === "undefined") {
    return { ok: false, error: "Log in is only available in the browser." };
  }

  const email = normalizeEmail(params.email);
  const password = params.password;

  if (!email || !password) {
    return { ok: false, error: "Please enter both email and password." };
  }

  const users = readUsers();
  const match = users.find((u) => u.email === email && u.password === password);

  if (!match) {
    return { ok: false, error: "Invalid email or password." };
  }

  const sessionUser: User = {
    id: match.id,
    name: match.name,
    email: match.email,
    createdAt: match.createdAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return { ok: true, user: sessionUser };
}
