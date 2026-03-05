import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
import { getSecretParameter } from "./utils/urlParams";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Capture the admin token immediately at app startup before any routing
// happens. The Caffeine dashboard appends it as a query string and/or
// hash param; reading it here stores it in sessionStorage so every
// subsequent call to getSecretParameter("caffeineAdminToken") succeeds.
getSecretParameter("caffeineAdminToken");

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
