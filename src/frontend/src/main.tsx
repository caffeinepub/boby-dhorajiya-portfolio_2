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

// Capture admin token from URL at app startup BEFORE any routing.
// The Caffeine dashboard injects it as ?caffeineAdminToken=xxx.
// Must be called here so it's stored even when /admin redirects
// directly to /admin/dashboard (bypassing the login page entirely).
getSecretParameter("caffeineAdminToken");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
