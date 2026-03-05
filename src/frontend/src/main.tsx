import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleAuthProvider } from "./hooks/useGoogleAuth";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { storeSessionParameter } from "./utils/urlParams";
import "../index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Capture Caffeine admin token from URL on startup (before any routing)
// Supports: ?caffeineAdminToken=xxx, #?caffeineAdminToken=xxx, #caffeineAdminToken=xxx
(function captureAdminToken() {
  const TOKEN_KEY = "caffeineAdminToken";
  try {
    // 1. Regular query string
    const qs = new URLSearchParams(window.location.search);
    const fromQs = qs.get(TOKEN_KEY);
    if (fromQs) {
      storeSessionParameter(TOKEN_KEY, fromQs);
      return;
    }
    // 2. Hash query string (#/route?caffeineAdminToken=xxx)
    const hash = window.location.hash;
    const hashQIdx = hash.indexOf("?");
    if (hashQIdx !== -1) {
      const hqs = new URLSearchParams(hash.substring(hashQIdx + 1));
      const fromHash = hqs.get(TOKEN_KEY);
      if (fromHash) {
        storeSessionParameter(TOKEN_KEY, fromHash);
        return;
      }
    }
    // 3. Raw hash (#caffeineAdminToken=xxx)
    if (hash && hash.length > 1) {
      const rawHash = new URLSearchParams(hash.substring(1));
      const fromRaw = rawHash.get(TOKEN_KEY);
      if (fromRaw) {
        storeSessionParameter(TOKEN_KEY, fromRaw);
      }
    }
  } catch {
    // ignore — sessionStorage may not be available
  }
})();

const GOOGLE_CLIENT_ID =
  "250579405228-4od4komma9bmf4js267qe2p63go8anga.apps.googleusercontent.com";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <GoogleAuthProvider>
          <App />
        </GoogleAuthProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>,
);
