import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
import { getSecretParameter } from "./utils/urlParams";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// ─── Capture admin token BEFORE any routing happens ───────────────────────────
// Caffeine dashboard injects the token as ?caffeineAdminToken=xxx in the URL.
// We must read it here so it's in sessionStorage regardless of which route loads
// first (e.g. /admin redirects straight to /admin/dashboard, bypassing the
// login page entirely, which is where token capture used to happen).
getSecretParameter("caffeineAdminToken");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
