import { useActor } from "@/hooks/useActor";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { getSecretParameter } from "@/utils/urlParams";
import { useQueryClient } from "@tanstack/react-query";
/**
 * AdminActorInitializer
 *
 * This component bridges Google OAuth (frontend gate) with the ICP backend's
 * access-control system. Since useActor.ts is a protected file that only calls
 * `_initializeAccessControlWithSecret` when an Internet Identity is present,
 * we need this component to call the same method on the anonymous actor whenever
 * the Google login state changes.
 *
 * It renders nothing — it's a pure side-effect component.
 */
import { useEffect, useRef } from "react";

export function AdminActorInitializer() {
  const { actor } = useActor();
  const { isLoggedIn } = useGoogleAuth();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!actor || !isLoggedIn) {
      initializedRef.current = false;
      return;
    }

    // Avoid re-initializing on every render
    if (initializedRef.current) return;

    const adminToken = getSecretParameter("caffeineAdminToken") || "";
    if (!adminToken) return;

    initializedRef.current = true;

    void (async () => {
      try {
        await actor._initializeAccessControlWithSecret(adminToken);
        // After token initialization, invalidate all queries so admin checks re-run
        queryClient.invalidateQueries();
      } catch {
        // Token may already be set — ignore errors
        initializedRef.current = false;
      }
    })();
  }, [actor, isLoggedIn, queryClient]);

  return null;
}
