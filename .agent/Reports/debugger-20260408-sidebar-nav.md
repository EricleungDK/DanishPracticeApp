# Debug Report: Sidebar Nav — Practice and Review Not Clickable

## Issue Description

Clicking the "Practice" and "Review" sidebar nav items does not navigate to those pages.
Only "Dashboard" and "Settings" work. User impact: the sidebar navigation is effectively broken
for the two core workflow pages.

## Root Cause

The bug is entirely in the `handleNav` function in `src/renderer/components/Sidebar.tsx` (lines 20-36).
Both `exercise` and `review` branches have conditional guards that **redirect to dashboard** whenever
their conditions are not met — which is almost always, because those conditions require an active
session to already be in progress.

### exercise branch (lines 21-25)

```ts
if (page === 'exercise') {
  if (sessionExercises.length > 0 && !sessionComplete) {
    navigate('exercise');
  } else {
    navigate('dashboard');      // <-- fires when no session exists
  }
}
```

`sessionExercises` starts as `[]`. Clicking "Practice" from the Dashboard when no session is
running hits the `else` branch and navigates to `dashboard` — doing nothing visible.

### review branch (lines 27-33)

```ts
} else if (page === 'review') {
  if (sessionExercises.length > 0 && !sessionComplete && currentPage === 'review') {
    navigate('review');
  } else {
    navigate('dashboard');      // <-- fires in every other situation
  }
}
```

This is even more broken. The guard requires `currentPage === 'review'` AND an active session.
This means the only time clicking "Review" actually navigates to the review page is when you are
ALREADY on the review page with an active session — a no-op. In every other case it falls through
to `navigate('dashboard')`.

### Why Dashboard and Settings work

They hit the `else` branch at line 34-36 which calls `navigate(page)` directly with no guards.

### No CSS/z-index issue

`Layout.tsx` and `index.css` are clean. There is no overlay, no z-index stacking, and no
`pointer-events: none` anywhere. The buttons are rendering and receiving clicks; the logic just
misdirects them.

## Intended vs Actual Behavior

The intent of the guards appears to be:
- Prevent navigating to the exercise/review page shell when no session has been started (which
  would render an empty "No exercises available" state).
- Instead, the sidebar should **start** a session when clicked, then navigate.

The correct design is for the sidebar to call `startPractice()` / `startReview()` (which set
`currentPage` internally via the store), not call `navigate()` after a guard.

## Solution Overview

Replace the guards in `handleNav` so that:
- Clicking "Practice" calls `startPractice()` (which loads exercises and sets `currentPage` to
  `'exercise'` via the store action).
- Clicking "Review" calls `startReview()` (which loads due exercises and sets `currentPage` to
  `'review'`).
- If a session is already active and not complete, clicking the same page just navigates to it
  (resume behavior — already present in the `exercise` branch but missing for `review`).

## Detailed Implementation Plan

### File: `src/renderer/components/Sidebar.tsx`

**Step 1 — Import the missing store actions.**

At line 17, the component already reads `sessionExercises` and `sessionComplete`.
Add selectors for `startPractice` and `startReview`:

```ts
const startPractice = useAppStore((s) => s.startPractice);
const startReview   = useAppStore((s) => s.startReview);
```

**Step 2 — Replace `handleNav` (lines 20-36).**

Current broken code:
```ts
const handleNav = (page: Page) => {
  if (page === 'exercise') {
    if (sessionExercises.length > 0 && !sessionComplete) {
      navigate('exercise');
    } else {
      navigate('dashboard');
    }
  } else if (page === 'review') {
    if (sessionExercises.length > 0 && !sessionComplete && currentPage === 'review') {
      navigate('review');
    } else {
      navigate('dashboard');
    }
  } else {
    navigate(page);
  }
};
```

Replace with:
```ts
const handleNav = (page: Page) => {
  if (page === 'exercise') {
    if (sessionExercises.length > 0 && !sessionComplete) {
      navigate('exercise');   // resume existing session
    } else {
      startPractice();        // start new session (sets currentPage internally)
    }
  } else if (page === 'review') {
    if (sessionExercises.length > 0 && !sessionComplete && currentPage === 'review') {
      navigate('review');     // resume existing review session
    } else {
      startReview();          // start new review (sets currentPage internally)
    }
  } else {
    navigate(page);
  }
};
```

This is a minimal, safe change. `startPractice` and `startReview` both set `currentPage` in the
store directly (see `useAppStore.ts` lines 134 and 152), so no additional `navigate()` call is
needed after them.

No other files need to change.

## Verification

- [ ] From Dashboard (no session): click "Practice" -> exercise session starts, page shows Exercise
- [ ] From Dashboard (no session): click "Review" -> review session starts, page shows Review
- [ ] Mid-session on exercise page: click "Practice" in sidebar -> stays on exercise (resume)
- [ ] Mid-session on review page: click "Review" in sidebar -> stays on review (resume)
- [ ] Clicking "Dashboard" still works
- [ ] Clicking "Settings" still works
- [ ] If `dueCount === 0`, `startReview()` fetches 0 due exercises and Review page shows
      "All caught up!" (graceful empty state already exists in `Review.tsx` line 24-37)

## Risks

- **None significant.** The fix only changes how the nav handler calls the store. No IPC,
  no schema, no renderer/main process boundary is crossed.
- **Side effect — session reset on re-click**: If the user clicks "Practice" while on the
  exercise page mid-session, the current guard correctly resumes. The fix preserves that.
  However, if the user is on a DIFFERENT page mid-session and clicks "Practice", `startPractice`
  will be called and will overwrite the existing session with a new one. This was already the
  behavior from the Dashboard "Mixed Practice" button, so it is consistent and expected.
- **Review with 0 due**: `startReview()` with no due items sets `sessionExercises: []` and
  navigates to `'review'`. The Review page handles this with the "All caught up!" empty state.
  This is correct behavior.
