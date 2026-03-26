# ITRIX 2026 Core Feature Guide and Test Tracker

This file is the working guide for core features so implementation and testing stay aligned.

## Project Run Status

- Repository cloned into this workspace.
- Dependencies installed with `npm ci`.
- App confirmed running locally on `http://localhost:5000` (HTTP 200).
- Dev server command: `npm run dev`

## Core Features (from project docs)

### 1. Session Management and Admin Security
- Admin password verification via API.
- Session-based admin access flow.
- Logout requiring re-authentication.

### 2. Password Management
- Change password endpoint with validation:
  - minimum 8 chars
  - uppercase + lowercase + number + special character
- Password history tracking (last 5 changes).

### 3. Global Timer Synchronization
- Get global timer duration.
- Set global timer duration.
- Default timer: 120 minutes (7200 sec).

### 4. Enhanced Proctoring and Whitelist
- Whitelisted app list retrieval.
- Add/remove whitelisted apps.
- Violation categories:
  - permitted (e.g., local app access)
  - warning (e.g., window blur)
  - critical (e.g., tab switch/chat interface)

### 5. Component Documentation
- Setup instructions, pin mapping, warnings, libraries, complexity metadata.
- Dialog rendering and details in participant/admin flows.

## Automated Test Coverage Added

## Unit Tests
- File: `tests/unit/admin-db.test.ts`
- Scope:
  - verify default admin password accept/reject
  - change password + enforce history cap (5)
  - set/get global timer
  - whitelist add/check behavior
  - proctoring severity auto-categorization

## Integration Tests
- File: `tests/integration/admin-api-routes.test.ts`
- Scope:
  - `/api/admin/verify` success and invalid credentials
  - `/api/admin/password` weak-password rejection + successful change + history retrieval
  - `/api/admin/timer` get default + set new duration
  - `/api/admin/whitelist` add/list/remove app flow

## Test Commands

```bash
npm run test:unit
npm run test:integration
npm test
```

## Latest Test Results

- Unit: 5/5 passed
- Integration: 4/4 passed
- Total: 9/9 passed

## Gaps / Manual Verification Checklist

The following are core behaviors described in docs but not fully covered by automated tests yet:

- UI/session redirect behavior across browser tabs.
- Change password dialog UX (strength bar, visibility toggles).
- Admin dashboard timer dropdown live sync via polling.
- Component documentation dialog visual completeness for all components.
- Full participant-side proctoring event capture in browser runtime.

Use this checklist during manual QA so no core area is missed.
