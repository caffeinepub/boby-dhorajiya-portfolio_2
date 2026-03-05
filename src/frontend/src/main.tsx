import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";

// MUST run before any React rendering or routing.
// Captures caffeineAdminToken from URL and saves to sessionStorage
// BEFORE React Router strips it during redirects.
(function captureAdminToken() {
  const paramName = "caffeineAdminToken";
  try {
    // Already captured? Skip.
    const existing = sessionStorage.getItem(paramName);
    if (existing) return;
    // Check regular query string: ?caffeineAdminToken=xxx
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get(paramName);
    // Check hash query string: #/?caffeineAdminToken=xxx
    if (!token) {
      const hash = window.location.hash;
      const qIdx = hash.indexOf("?");
      if (qIdx !== -1) {
        const hashParams = new URLSearchParams(hash.substring(qIdx + 1));
        token = hashParams.get(paramName);
      }
    }
    // Check raw hash: #caffeineAdminToken=xxx
    if (!token && window.location.hash.length > 1) {
      const rawParams = new URLSearchParams(window.location.hash.substring(1));
      token = rawParams.get(paramName);
    }
    if (token) {
      sessionStorage.setItem(paramName, token);
      console.log(
        "[main] Admin token captured from URL and saved to sessionStorage",
      );
      // Clean token from URL for security
      try {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete(paramName);
        window.history.replaceState(null, "", newUrl.toString());
      } catch {
        /* ignore cleanup errors */
      }
    }
  } catch (e) {
    console.warn("[main] Failed to capture admin token:", e);
  }
})();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
