import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
import { getSecretParameter } from "./utils/urlParams";

// Capture the admin token from the URL at app startup, before any routing
// or actor creation. This is critical because:
// - The Caffeine dashboard injects the token as ?caffeineAdminToken=xxx
// - /admin redirects immediately to /admin/dashboard, bypassing the login
//   page where the token was previously being captured
// - By capturing it here first, it's always in sessionStorage when useActor
//   calls getSecretParameter("caffeineAdminToken")
getSecretParameter("caffeineAdminToken");

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
