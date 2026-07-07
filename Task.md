# Make the Chess Playing Room Fully Responsive (Mobile First)

Redesign the **Game Room** page for mobile devices while preserving **all existing functionality** and keeping the **desktop layout exactly the same**.

---

## Scope and Guardrails

### Non-negotiables

- Do **NOT** change any business logic or game behavior.
- Do **NOT** remove or replace features (moves, chat, controls, timers, evaluation, coordinates, etc.).
- Keep the same visual design system: colors, typography feel, shadows, border radius, spacing “style”.
- Prefer **CSS-only responsiveness** (grid/flex/media queries/container queries) over conditional rendering.
- Avoid recreating/remounting the chess board during responsive layout changes.

### Breakpoints to support

- **Mobile**: 320 / 375 / 390 / 414
- **Tablet**: 768
- **Desktop**: current behavior, unchanged

> Interpretation: treat **< 768px** as “mobile/tablet layout” unless the existing UI already handles tablet well. Desktop remains identical to current.

---

## Desktop

Keep the current desktop layout exactly as it is.

---

## Mobile Layout

The page should become a vertical layout.

### Visual order (top → bottom)

1. Top Bar
2. Chess Board
3. Players (each includes timer)
4. Action buttons / controls
5. Move history (collapsible)
6. Chat (collapsible)

---

## 1. Header (Top Bar)

Move the back button to the top-left and keep the header compact.

Display:

← Game Room

Below it show:

- Game type
- Time control

Everything should fit in one compact header.

### Sticky behavior (mobile/tablet)

- Header is **sticky** while scrolling.
- Sticky header must not overlap content (reserve space / proper z-index).

---

## 2. Chess Board (Primary)

The chess board becomes the primary focus.

Requirements:

- Width: 100%
- Keep square aspect ratio
- Maximum possible size
- Always centered
- No horizontal scrolling

Coordinates should remain visible.

Evaluation bar should move below the board.

---

## 3. Players (Compact Rows + Prominent Timers)

Instead of large horizontal player cards,
display compact player rows.

### Each player row contains

- Avatar
- Name
- Rating
- Online indicator
- Timer aligned to the right (high visibility)

### Placement (mobile/tablet)

- Opponent row (typically Black) above the board
- Local player row (typically White) below the board

Top player row:

Avatar
Name
Rating
Online indicator

Timer aligned to the right.

Bottom player:

Same layout.

Example:

[Avatar] Amir Hossein
1864 ●

               08:34

---

(Board)

---

[Avatar] Parsa
1928 ●

               06:21

Timers should stay highly visible.

---

## 4. Game Controls (Touch Friendly)

Instead of a 2x2 grid, use:

Two buttons per row.

Example:

[Draw] [Resign]

[Undo] [Settings]

Buttons:

- equal width
- equal height
- touch friendly (minimum 44px)

### Layout rules (mobile/tablet)

- Controls should not cause horizontal scrolling at 320px width.
- Use consistent gaps between buttons and sections.

---

## 5. Move History (Accordion on Mobile)

Desktop keeps the left sidebar.

On mobile:

Replace it with an accordion.

Collapsed by default.

Header:

Moves ▼

When expanded:

- Full move list
- Vertical scrolling
- Max height around 220px

### Behavior

- Accordion header is a large touch target (≥ 44px height).
- Expanded content scrolls independently (does not push the whole page excessively).

---

## 6. Chat (Accordion on Mobile)

Desktop stays unchanged.

Mobile:

Place below Move History.

Collapsed by default.

Header:

Chat ▼

When expanded:

- Existing messages
- Input
- Send button

Chat height:

220–260px

Messages should scroll independently.

### Behavior

- Keep the input usable with the on-screen keyboard (no hidden input).
- Send button remains reachable on small screens.

---

## 7. Board Priority (Always Maximize Board First)

The chess board should always receive the most visual space.

If vertical space becomes limited:

Shrink:

- paddings
- player rows
- buttons

Never shrink the board before other elements.

---

## 8. Spacing (Guidelines)

Use approximately:

Outer padding:
16px

Gap between sections:
16px

Inside cards:
12–16px

Buttons:
12px padding

---

## 9. Typography (Mobile Tweaks)

Reduce font sizes slightly on mobile.

Examples:

Title:
24px → 20px

Player name:
22px → 18px

Secondary text:
16px → 14px

Move list:
16px → 14px

Timers must remain large and readable.

---

## 10. Sticky / Scroll Behavior

Goal: keep critical game info visible without making the page feel cramped.

While scrolling:

- Keep the header sticky.
- Move History and Chat scroll independently when opened.

### Practical interpretation

- Do **not** force the board to be sticky if it causes severe layout issues on small heights.
- Prefer: board stays naturally near the top due to the vertical order, with compact spacing.

---

## 11. Touch Optimization

Increase touch targets.

Minimum touch area:

44x44px

Include:

- buttons
- move list items
- accordion headers
- chat input controls

---

## 12. Animations

Accordion:

- smooth height transition
- duration around 200ms

Do not animate the chess board.

---

## 13. Performance

Avoid unnecessary re-renders.

Do not recreate the chess board during layout changes.

Use CSS responsive layouts instead of conditional rendering whenever possible.

---

## Expected Mobile Structure

```
Header

Player (Opponent)

Chess Board

Evaluation Bar

Player (You)

Controls

▼ Moves

▼ Chat
```

The result should feel like a professional chess application similar to Chess.com or Lichess on mobile, prioritizing the board while keeping every feature easily accessible.

---

## Acceptance Criteria (Definition of Done)

- **Desktop unchanged**: desktop layout matches current UI (no visual/layout regressions).
- **No feature regressions**: all existing interactions still work (board interaction, timers, chat, moves, controls, evaluation, coordinates).
- **No horizontal scrolling** at 320px width.
- **Board stays square** and as large as possible within the viewport.
- **Players are compact** and timers are clearly visible without truncation for typical values.
- **Moves & Chat are collapsed by default** and expand/collapse smoothly.
- **Scroll behavior is sane**: expanding moves/chat does not break page scroll; inner lists scroll independently.
