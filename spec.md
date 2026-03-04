# Boby Dhorajiya Portfolio

## Current State
A fully dynamic portfolio site with Motoko backend and React frontend. The admin panel uses Internet Identity for authentication. The authorization system requires an `CAFFEINE_ADMIN_TOKEN` environment variable and a token field on the login page for the first admin to claim their role. This token field has been confusing for the user.

## Requested Changes (Diff)

### Add
- `claimAdmin()` backend function: the very first authenticated (non-anonymous) caller can call this to become admin, with no token required. Returns `Bool` (true = claimed, false = already assigned or caller is anonymous).

### Modify
- `AdminLogin.tsx`: Remove the admin token input field, the `adminToken` state, the `KeyRound` icon import, and the `storeSessionParameter` call. The login button simply calls `login()` directly.
- `AdminLayout.tsx`: After the user logs in, if `isAdmin` is false and `adminAssigned` is false (i.e. no admin yet), automatically call `claimAdmin()` to register the current caller as admin, then refetch `isCallerAdmin`.

### Remove
- Admin token input field from the login page UI.

## Implementation Plan
1. Regenerate Motoko backend to add `claimAdmin()` public shared function in MixinAuthorization.
2. Update `AdminLogin.tsx` to remove token field (already done).
3. Update `AdminLayout.tsx` to call `claimAdmin()` on first login when no admin is assigned yet.
