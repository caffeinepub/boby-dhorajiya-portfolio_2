/**
 * Utility to get the Caffeine admin token from URL or sessionStorage.
 * Checks regular query string first (Caffeine platform injects it there),
 * then hash-based query string, then sessionStorage.
 */

const TOKEN_KEY = "caffeineAdminToken";

export function getSecretParameter(paramName: string): string | null {
  // Check sessionStorage first
  const stored = sessionStorage.getItem(paramName);
  if (stored) return stored;

  // Check regular query string (?caffeineAdminToken=xxx)
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get(paramName);
  if (queryParam) {
    sessionStorage.setItem(paramName, queryParam);
    return queryParam;
  }

  // Check hash query string (#/?caffeineAdminToken=xxx)
  const hash = window.location.hash;
  if (hash) {
    const hashContent = hash.substring(1);
    const queryStart = hashContent.indexOf("?");
    if (queryStart !== -1) {
      const hashQuery = hashContent.substring(queryStart + 1);
      const hashParams = new URLSearchParams(hashQuery);
      const hashParam = hashParams.get(paramName);
      if (hashParam) {
        sessionStorage.setItem(paramName, hashParam);
        return hashParam;
      }
    }
    // Raw hash (#xxx=value)
    const rawParams = new URLSearchParams(hashContent);
    const rawParam = rawParams.get(paramName);
    if (rawParam) {
      sessionStorage.setItem(paramName, rawParam);
      return rawParam;
    }
  }

  return null;
}

export function getCaffeineAdminToken(): string {
  return getSecretParameter(TOKEN_KEY) || "";
}
