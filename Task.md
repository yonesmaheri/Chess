You are working on an existing full-stack chess application.

The project already contains authentication, users, frontend architecture, backend architecture, routing, UI system and database.

IMPORTANT

Before writing any code:

- Inspect the entire project.
- Understand the current architecture.
- Reuse existing components, services, hooks and utilities.
- Never duplicate existing code.
- Follow the project's existing conventions.
- Integrate with the current authentication system.

Do NOT create duplicate:

- Auth
- User
- API client
- Theme
- Shared UI components
- Layout system
- Database models that already exist

Only implement the missing Lobby/Game Room module.

---

# Goal

Implement a complete Chess Lobby inspired by the attached design.

This is NOT a pixel-perfect implementation.

Use the design only as inspiration for layout and UX while following the existing design system.

The implementation must feel production ready.

---

# Frontend

Create a completely new route group.

Example:

app/
    (lobby)/
        layout.tsx
        lobby/
            page.tsx
        ai/
        online/
        friends/
        components/
        hooks/
        lib/

The lobby must have its own layout independent from the dashboard.

Do NOT place this page inside dashboard layout.

---

# Authentication

This section must be protected.

If the user is not authenticated:

- redirect to Login
- never render lobby content
- perform authentication check server-side whenever possible
- avoid client-side flashing

---

# Lobby Sections

Implement the following sections.

## 1. Hero

Top title

Chess Lobby

Small subtitle

Choose how you want to start playing.

---

## 2. Play Online

Card for random matchmaking.

Contains

- title
- description
- Start Match button

Remove completely:

- Time control selection
- Bullet
- Blitz
- Rapid
- Classical

Time controls are already selected in user settings.

Do not implement them.

---

## 3. Play vs AI

Card for playing against computer.

Contains

Difficulty selector.

Levels

1
2
3
4
5
6
7
8
9
10

Selected difficulty should be highlighted.

Below it show a short description.

Example

Easy

Intermediate

Hard

Expert

Do NOT implement color selection.

Remove

White
Black
Random

Color comes from user settings.

Start AI Game button.

---

## 4. Friends

Card for inviting friends.

Contains

Generate Invite Link

Copy Invite Link

Recent challenges

Incoming invitations

Accept

Decline

Online friends list if backend already has friendship support.

If friendship system does not exist:

Create interfaces only.

Do not invent fake backend.

---

## 5. Footer Information

Small trust indicators.

Examples

Secure

Fair Play

Powered by Chess Engine

Private Games

Responsive

---

# UI

Responsive.

Desktop:

Three-column layout similar to design.

Tablet:

Two columns.

Mobile:

Single column.

Use reusable components.

Avoid duplicated JSX.

Use semantic HTML.

Proper loading states.

Proper empty states.

Skeletons.

Animations should be subtle.

---

# Backend

Inspect backend first.

Implement only what is missing.

Possible endpoints:

GET /lobby

GET /friends

GET /invites

POST /invite

POST /invite/:id/accept

POST /invite/:id/reject

POST /matchmaking/random

POST /matchmaking/ai

Reuse authentication middleware.

Reuse validation.

Reuse existing error handling.

Never expose internal errors.

Always validate request body.

Always validate authenticated user.

Rate-limit invite creation.

Prevent invite spam.

Prevent duplicate active invites.

Prevent self invitation.

Prevent invalid IDs.

Return proper HTTP status codes.

---

# Chess Integration

Both frontend and backend already have chess.js installed.

Frontend already has react-chessboard installed.

Use them.

For AI games:

Create a new Chess instance.

Initialize board.

Prepare game state.

Do NOT implement engine logic if engine is not already available.

Only prepare architecture.

For online games:

Prepare matchmaking flow.

Do not implement websocket logic unless websocket infrastructure already exists.

If sockets already exist:

Integrate with them.

Otherwise create abstraction only.

---

# State Management

Reuse existing solution.

If project uses:

- Zustand
- Redux
- React Query
- TanStack Query
- Context

Reuse it.

Do not introduce another library.

---

# API Layer

Reuse existing API client.

Create Lobby service.

Create Invite service.

Create Matchmaking service.

Proper typing.

No duplicated fetch logic.

---

# Security

Protect every endpoint.

Validate JWT/session.

Never trust frontend values.

Validate:

difficulty

invite id

friend id

user id

Prevent unauthorized lobby access.

Prevent ID enumeration.

Prevent replay requests.

Sanitize all user inputs.

Apply rate limiting where appropriate.

Return generic errors.

Do not leak implementation details.

---

# Code Quality

Use TypeScript everywhere.

Strict typing.

No any.

Extract reusable components.

Extract hooks.

Extract services.

Extract constants.

Extract DTOs.

Keep files small.

Follow SOLID principles.

Follow Clean Architecture already used in the project.

---

# Accessibility

Keyboard navigation.

Visible focus.

ARIA labels.

Proper buttons.

Proper headings.

Screen reader friendly.

---

# Performance

Lazy load heavy components.

Memoize expensive renders.

Avoid unnecessary rerenders.

Use optimistic updates where appropriate.

Code split lobby routes.

---

# Final Requirement

Before implementing:

1. Inspect the existing project.

2. Detect existing architecture.

3. Reuse everything possible.

4. Do not recreate existing systems.

5. Build only the missing Lobby module.

6. Produce production-quality code.

7. Keep the implementation modular and maintainable.