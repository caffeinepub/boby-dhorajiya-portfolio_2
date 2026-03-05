import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
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

// Capture admin token from the URL as early as possible — before any routing
// or component mounting happens.  The Caffeine dashboard injects the token as
// a regular query param (?caffeineAdminToken=...) or inside the hash query
// string (#/path?caffeineAdminToken=...).  We persist it to sessionStorage so
// useActor can find it regardless of which route the user lands on.
(function captureAdminToken() {
  const TOKEN_KEY = "caffeineAdminToken";

  // 1. Regular query string
  const queryToken = new URLSearchParams(window.location.search).get(TOKEN_KEY);
  if (queryToken) {
    storeSessionParameter(TOKEN_KEY, queryToken);
    return;
  }

  // 2. Hash query string (#/path?caffeineAdminToken=...)
  const hash = window.location.hash;
  const qIdx = hash.indexOf("?");
  if (qIdx !== -1) {
    const hashParams = new URLSearchParams(hash.substring(qIdx + 1));
    const hashToken = hashParams.get(TOKEN_KEY);
    if (hashToken) {
      storeSessionParameter(TOKEN_KEY, hashToken);
    }
  }
})();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
