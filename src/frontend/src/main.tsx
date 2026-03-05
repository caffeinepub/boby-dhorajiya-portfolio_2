import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
// Eagerly capture the admin token from the URL and persist it to sessionStorage
// BEFORE React renders anything, so it is available even when the router
// redirects away from the landing URL (e.g. /admin → /admin/dashboard).
import { getSecretParameter } from "./utils/urlParams";
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
