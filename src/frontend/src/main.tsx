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

// Capture admin token from URL at startup, before any routing or component mounting.
// This ensures the token is in sessionStorage regardless of which page the user lands on
// (e.g. /admin redirects to /admin/dashboard, skipping the login page entirely).
getSecretParameter("caffeineAdminToken");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
