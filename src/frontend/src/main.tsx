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

// Capture the admin token from the URL at startup — before any routing or
// actor creation. The Caffeine dashboard appends ?caffeineAdminToken=xxx to
// the URL. If we don't grab it here, routes that redirect away (e.g. /admin
// → /admin/dashboard) will navigate before the login page or actor hook
// has a chance to read it.
getSecretParameter("caffeineAdminToken");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
