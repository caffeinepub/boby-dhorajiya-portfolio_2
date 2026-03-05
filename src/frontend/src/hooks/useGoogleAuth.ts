/**
 * Google OAuth authentication hook.
 * Replaces Internet Identity for admin access.
 *
 * Only "bobydhorajiya@gmail.com" is allowed to log in.
 */

import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ALLOWED_EMAIL = "bobydhorajiya@gmail.com";
const CREDENTIAL_KEY = "googleCredential";
const EMAIL_KEY = "googleEmail";

export type GoogleAuthContext = {
  /** Whether the user is logged in with a valid, non-expired Google credential */
  isLoggedIn: boolean;
  /** The logged-in user's email address */
  userEmail: string | null;
  /** Called with the raw JWT credential string returned by Google */
  loginWithCredential: (credential: string) => boolean;
  /** Log out: clears sessionStorage and resets state */
  logout: () => void;
  /** True while checking stored credential on first mount */
  isInitializing: boolean;
};

/** Parse the email claim from a Google JWT without network calls */
export function parseJwtEmail(credential: string): string | null {
  try {
    const payload = JSON.parse(atob(credential.split(".")[1]));
    return (payload.email as string) || null;
  } catch {
    return null;
  }
}

/** Returns true when the JWT `exp` claim is in the past */
export function isCredentialExpired(credential: string): boolean {
  try {
    const payload = JSON.parse(atob(credential.split(".")[1]));
    return Date.now() / 1000 > (payload.exp as number);
  } catch {
    return true;
  }
}

const GoogleAuthReactContext = createContext<GoogleAuthContext | undefined>(
  undefined,
);

function assertProviderPresent(
  ctx: GoogleAuthContext | undefined,
): asserts ctx is GoogleAuthContext {
  if (!ctx) {
    throw new Error(
      "useGoogleAuth must be used inside <GoogleAuthProvider>. Wrap your app.",
    );
  }
}

/** Access the Google auth state anywhere in the tree */
export function useGoogleAuth(): GoogleAuthContext {
  const ctx = useContext(GoogleAuthReactContext);
  assertProviderPresent(ctx);
  return ctx;
}

/** Wrap your app (or the admin subtree) with this provider */
export function GoogleAuthProvider({
  children,
}: PropsWithChildren<{ children: ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // On mount, restore from sessionStorage if the credential is still valid
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CREDENTIAL_KEY);
      if (saved && !isCredentialExpired(saved)) {
        const email = parseJwtEmail(saved);
        if (email === ALLOWED_EMAIL) {
          setIsLoggedIn(true);
          setUserEmail(email);
        } else {
          // Stale credential for wrong account — clear it
          sessionStorage.removeItem(CREDENTIAL_KEY);
          sessionStorage.removeItem(EMAIL_KEY);
        }
      } else if (saved) {
        // Expired — clear it
        sessionStorage.removeItem(CREDENTIAL_KEY);
        sessionStorage.removeItem(EMAIL_KEY);
      }
    } catch {
      // sessionStorage not available (private mode etc.) — ignore
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const loginWithCredential = useCallback((credential: string): boolean => {
    const email = parseJwtEmail(credential);
    if (email !== ALLOWED_EMAIL) {
      return false;
    }
    try {
      sessionStorage.setItem(CREDENTIAL_KEY, credential);
      sessionStorage.setItem(EMAIL_KEY, email);
    } catch {
      // ignore storage errors
    }
    setIsLoggedIn(true);
    setUserEmail(email);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(CREDENTIAL_KEY);
      sessionStorage.removeItem(EMAIL_KEY);
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    setUserEmail(null);
  }, []);

  const value = useMemo<GoogleAuthContext>(
    () => ({
      isLoggedIn,
      userEmail,
      loginWithCredential,
      logout,
      isInitializing,
    }),
    [isLoggedIn, userEmail, loginWithCredential, logout, isInitializing],
  );

  return createElement(GoogleAuthReactContext.Provider, { value, children });
}
