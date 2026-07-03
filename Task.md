Continue the existing implementation.

The Lobby module has already been implemented.

Now implement the Matchmaking page that appears after the user clicks "Play Online".

Use the attached design only as visual inspiration.

Do NOT implement a pixel-perfect copy.

Follow the project's existing design system.

Reuse existing layouts, components, hooks and services whenever possible.

Never duplicate existing logic.

---

# Route

Create a new page inside the Lobby Route Group.

Example

app/
    (lobby)/
        matchmaking/
            page.tsx
            loading.tsx
            components/

Keep using the Lobby layout.

---

# Authentication

This page is protected.

If the user is not authenticated:

- redirect to login
- never render matchmaking UI
- perform authentication verification server-side whenever possible

---

# Page Goal

This page represents the waiting room while the backend searches for an opponent.

It should immediately start matchmaking when the page loads.

The user should not have to press another button.

---

# UI

The page should contain:

## Title

Searching for an opponent...

## Subtitle

Display the currently selected matchmaking preferences.

Example

Searching using your current preferences...

Do NOT display:

- Time control
- Piece color

Those values already come from user settings.

---

## Center Animation

Create a modern searching animation.

The provided design uses a rotating radar around a chess knight.

Do not copy it exactly.

Create something lightweight using CSS animations.

Requirements

- smooth animation
- GPU friendly
- no heavy rendering
- pauses automatically when match is found

---

## Left Card

Placeholder representing the current player.

Show

Avatar

Username

Current Rating

Status

Searching...

---

## Right Card

Initially hidden.

When an opponent is found:

Animate the opponent card into view.

Display

Avatar

Username

Rating

Country if available

Online indicator

---

## Status Text

While searching:

Searching for a suitable opponent...

When found:

Opponent found!

Preparing game...

---

## Cancel Button

Large outlined button.

Clicking it:

Stops matchmaking

Cancels pending backend request

Leaves matchmaking queue

Navigates back to Lobby

---

# Matchmaking Flow

When entering the page:

Automatically call

POST /matchmaking/random

Backend returns

Searching

Queued

Matched

or Failed

---

If searching:

Start polling or websocket updates.

Reuse existing websocket infrastructure if available.

If websocket infrastructure does not exist:

Implement polling abstraction.

Polling interval

2–3 seconds.

Stop polling immediately when:

- match found
- cancelled
- page unmounted

Prevent memory leaks.

---

# Match Found

When a match is found:

Stop all polling.

Stop animations.

Display opponent information.

Show

Match found!

Redirecting...

Wait about 2 seconds.

Navigate automatically to the Game page.

---

# Backend

Inspect existing backend first.

Implement only missing pieces.

Possible endpoints

POST /matchmaking/random

POST /matchmaking/cancel

GET /matchmaking/status

Reuse

Authentication

Validation

Error handling

Logging

Rate limiting

---

# Matchmaking Queue

Do not allow:

Multiple queue entries for one user.

Duplicate requests.

Already-playing users entering queue.

Disconnected users remaining in queue.

Automatically clean stale queue entries.

---

# Security

Validate every authenticated request.

Never trust frontend values.

Prevent:

Queue spam

Race conditions

Duplicate matches

Unauthorized matchmaking

Replay requests

Validate every user before adding to queue.

---

# Game Creation

When two users are matched:

Create a new game session.

Generate

Game ID

Initial chess position

Player assignments

White/Black

Use the user's existing preferences for color selection.

Do not ask again on this page.

Store the game.

Return only the required data.

---

# Chess Integration

Backend already uses chess.js.

Create a new Chess instance for every new game.

Store

FEN

PGN

Move history

Current turn

Game status

Prepare the architecture for future move synchronization.

---

# Frontend State

Reuse existing state management.

Do not introduce new libraries.

Create reusable hooks.

Examples

useMatchmaking()

useMatchStatus()

Keep business logic outside components.

---

# UX

Provide proper loading states.

Handle:

No opponent found after long wait.

Network errors.

Server unavailable.

Matchmaking timeout.

If searching exceeds configurable timeout:

Display

Still searching...

Keep searching

or

Return to Lobby

---

# Accessibility

Keyboard accessible.

ARIA labels.

Visible focus.

Screen-reader friendly.

---

# Performance

Stop unnecessary renders.

Cancel requests on unmount.

Use AbortController where applicable.

Lazy load heavy assets.

Avoid animation jank.

---

# Code Quality

Strict TypeScript.

No any.

Small reusable components.

Reusable services.

Clean Architecture.

SOLID principles.

No duplicated code.

---

# Final Requirement

Before implementation:

1. Inspect the existing project.

2. Reuse existing architecture.

3. Reuse existing API client.

4. Reuse authentication.

5. Reuse websocket infrastructure if it exists.

6. Build only the missing Matchmaking module.

7. Produce production-ready code suitable for future multiplayer expansion.