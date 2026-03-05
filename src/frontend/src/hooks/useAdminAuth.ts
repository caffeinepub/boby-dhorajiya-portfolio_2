/**
 * Simple static admin authentication.
 * Credentials are checked client-side and a session flag is stored in sessionStorage.
 * This is intentionally lightweight -- the admin panel manages content on a personal portfolio.
 */

const ADMIN_EMAIL = "bobydhorajiya@gmail.com";
const ADMIN_PASSWORD = "Admin@9201";
const SESSION_KEY = "admin_authenticated";

export function login(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
