# Boby Dhorajiya Portfolio

## Current State
- Auth: Internet Identity (ICP's decentralized auth) via `@dfinity/auth-client`
- Admin access: principal-based via `AccessControl` module + `CAFFEINE_ADMIN_TOKEN` for first-time registration
- Frontend: `useInternetIdentity` hook, `InternetIdentityProvider`, login page shows "Login with Internet Identity" button + Admin Token field
- Backend: Motoko actor with `MixinAuthorization` using caller principal for all admin checks
- All admin CRUD operations guarded by `AccessControl.isAdmin(accessControlState, caller)`

## Requested Changes (Diff)

### Add
- Google OAuth login via `@react-oauth/google` (Client ID: `250579405228-4od4komma9bmf4js267qe2p63go8anga.apps.googleusercontent.com`)
- `useGoogleAuth` hook replacing `useInternetIdentity` — stores Google ID token in sessionStorage
- Email whitelist check: only `bobydhorajiya@gmail.com` is allowed admin access
- `GoogleAuthProvider` replacing `InternetIdentityProvider` in `main.tsx`
- Clean, minimal Google Sign-In login page (no admin token field, no Internet Identity button)

### Modify
- `AdminLogin.tsx` — replace Internet Identity button with Google Sign-In button; show error if email not whitelisted
- `AdminLayout.tsx` — use `useGoogleAuth` instead of `useInternetIdentity`; show logged-in email in sidebar footer
- `useActor.ts` — replace identity-based actor creation with anonymous actor; Google ID token passed to `_initializeAccessControlWithSecret` for admin registration
- `main.tsx` — replace `InternetIdentityProvider` with `GoogleAuthProvider`
- All admin pages — no structural changes needed; mutations still use actor which uses the CAFFEINE_ADMIN_TOKEN flow
- Backend `main.mo` — no changes needed; `resetAllData` and access control remain principal-based. The Google auth flow gates access at frontend before the actor gets the admin token.

### Remove
- `useInternetIdentity.ts` hook (replaced by `useGoogleAuth.ts`)
- `InternetIdentityProvider` usage from `main.tsx` and all imports
- Admin token input field from login page
- `@dfinity/auth-client` dependency usage (auth-client used only for Internet Identity)

## Implementation Plan
1. Install `@react-oauth/google` package
2. Create `src/hooks/useGoogleAuth.ts` — manages Google sign-in state, email validation, token storage in sessionStorage
3. Create `src/components/GoogleAuthProvider.tsx` — wraps app with `GoogleOAuthProvider` and provides auth context
4. Rewrite `AdminLogin.tsx` — Google Sign-In button, email whitelist error, clean UI (no admin token field)
5. Rewrite `AdminLayout.tsx` — use `useGoogleAuth`, show user email, logout clears Google session
6. Rewrite `useActor.ts` — actor always created anonymously; on Google login the `CAFFEINE_ADMIN_TOKEN` is used to initialize admin access control (same as before, just triggered by Google auth instead of II)
7. Rewrite `main.tsx` — replace `InternetIdentityProvider` with `GoogleAuthProvider`
8. `useQueries.ts` — `useIsCallerAdmin` query still works the same way; no changes needed
9. Fix `getSecretParameter` to also check query string (not just hash) so the Caffeine dashboard token always gets picked up
10. Verify typecheck, lint, and build pass
