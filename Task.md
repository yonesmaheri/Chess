Continue the existing implementation.

The Lobby and Matchmaking modules are already implemented.

The Matchmaking system already uses WebSocket.

Now implement the complete Online Chess Game Room.

IMPORTANT

Before writing any code:

- Inspect the existing project.
- Understand the current architecture.
- Reuse existing services.
- Reuse authentication.
- Reuse websocket infrastructure.
- Reuse API client.
- Reuse layouts.
- Reuse hooks.
- Never duplicate existing logic.

The attached design is only a visual reference.

Do NOT create a pixel-perfect copy.

Follow the project's existing design system.

--------------------------------------------------
General Goal
--------------------------------------------------

Implement a complete online multiplayer chess game that is fully responsive, production-ready, and powered by WebSocket.

The implementation must work seamlessly on:

- Desktop
- Tablet
- Mobile

without removing any functionality.

--------------------------------------------------
Responsive Layout
--------------------------------------------------

Desktop

- Left sidebar
- Chessboard in the center
- Player information above and below the board
- Move history inside the sidebar
- Chat inside the sidebar

--------------------------------------------------

Mobile

Do NOT simply stack desktop components.

Create a dedicated mobile experience.

Layout:

Opponent Information

↓

Opponent Clock

↓

Move History Strip

↓

Chess Board

↓

Player Clock

↓

Player Information

↓

Bottom Toolbar

The interface must maximize the board size while preserving every feature.

--------------------------------------------------
Move History
--------------------------------------------------

Desktop

Display the move history as a table.

Columns:

Move Number

White

Black

Highlight current move.

Scrollable.

--------------------------------------------------

Mobile

Do NOT use a table.

Display moves as a thin horizontal strip.

Example

e4 | e5 | Nf3 | Nc6 | Bb5 | a6 | O-O | ...

Requirements

- Horizontal scrolling
- Very small height
- Always visible
- Small spacing above the board
- Current move highlighted
- Smooth scrolling

--------------------------------------------------
Chat
--------------------------------------------------

Desktop

Persistent sidebar chat.

--------------------------------------------------

Mobile

Chat must open as a Bottom Sheet.

Requirements

- Slide animation
- Drag to close
- Overlay
- Keyboard friendly
- Auto scroll to latest message

Do not reduce chessboard size because of chat.

--------------------------------------------------
Player Panels
--------------------------------------------------

Each player panel displays

- Avatar
- Username
- Rating
- Online indicator
- Current clock

Clearly indicate

Current turn

Disconnected player

Winner

Loser

--------------------------------------------------
Chessboard
--------------------------------------------------

Use react-chessboard.

Support

- Drag and Drop
- Click to Move
- Legal move highlighting
- Last move highlighting
- Check highlighting
- Promotion
- Flip board
- Coordinates
- Smooth animations

--------------------------------------------------
Game Controls
--------------------------------------------------

Implement

Resign

Offer Draw

Accept Draw

Reject Draw

Undo Request (if enabled)

Accept Undo

Reject Undo

Settings

--------------------------------------------------
Timers
--------------------------------------------------

Support live synchronized chess clocks.

Update through WebSocket.

Handle

Pause

Resume

Timeout

Game over on timeout

Prevent timer drift.

--------------------------------------------------
Chat
--------------------------------------------------

Real-time chat.

Support

Send message

Receive message

Message timestamp

Auto scroll

Unread indicator

Typing indicator (architecture ready)

--------------------------------------------------
Chess Rules
--------------------------------------------------

Backend uses chess.js.

Validate every move server-side.

Support

Check

Checkmate

Draw

Stalemate

Insufficient Material

Threefold Repetition

Fifty Move Rule

Castling

En Passant

Promotion

Never trust frontend validation.

--------------------------------------------------
Game Flow
--------------------------------------------------

Game Started

↓

Players Connected

↓

Moves

↓

Clock Updates

↓

Chat

↓

Game End

↓

Rating Update

↓

Return to Lobby or Rematch

--------------------------------------------------
WebSocket Events
--------------------------------------------------

Client

join_game

leave_game

make_move

offer_draw

accept_draw

reject_draw

resign

undo_request

accept_undo

reject_undo

chat_message

heartbeat

--------------------------------------------------

Server

game_started

move_made

game_updated

timer_updated

draw_offered

draw_accepted

draw_rejected

undo_requested

undo_accepted

undo_rejected

promotion_required

chat_message

player_joined

player_left

player_reconnected

opponent_disconnected

game_over

error

--------------------------------------------------
Backend
--------------------------------------------------

Inspect the existing backend.

Implement only missing modules.

Reuse existing architecture.

Create or extend

GameModule

GameGateway

GameService

Repositories

DTOs

Validators

Reuse existing User module.

Reuse existing Rating module.

--------------------------------------------------
Game Entity
--------------------------------------------------

Store

Game ID

White Player

Black Player

Current Turn

Current FEN

Current PGN

Move History

Game Status

Winner

Result

Started At

Ended At

Created At

Updated At

--------------------------------------------------
Move Entity
--------------------------------------------------

Store

Game

Move Number

Player

SAN

UCI

FEN After Move

Time Spent

Created At

--------------------------------------------------
Chat Entity
--------------------------------------------------

Store

Game

User

Message

Timestamp

--------------------------------------------------
Draw Offer Entity
--------------------------------------------------

Store

Game

Requested By

Status

Created At

--------------------------------------------------
Server Logic
--------------------------------------------------

Every move must execute

Validate Move

↓

Apply Move

↓

Update FEN

↓

Update PGN

↓

Store Move

↓

Broadcast Move

↓

Switch Turn

↓

Update Clock

↓

Check Game Status

↓

Broadcast State

If game ends

Store Result

Update Rating

Notify both players

--------------------------------------------------
Security
--------------------------------------------------

Authenticate every websocket connection.

Validate every event.

Validate ownership of every game.

Prevent

Playing in someone else's game

Playing twice

Moving out of turn

Moving opponent pieces

Replay attacks

Duplicate websocket events

Spam

Chat flooding

Draw offer spam

Undo spam

Never expose internal errors.

--------------------------------------------------
Performance
--------------------------------------------------

Single websocket connection.

Room-based broadcasting.

Broadcast only changed state.

Memoize expensive UI.

Avoid unnecessary rerenders.

Cleanup listeners on unmount.

Handle reconnect gracefully.

--------------------------------------------------
Accessibility
--------------------------------------------------

Keyboard navigation

ARIA labels

Visible focus

Screen reader friendly

--------------------------------------------------
Future Compatibility
--------------------------------------------------

Design the architecture to support

Spectator Mode

Rematch

Tournament

Replay

Engine Analysis

Puzzle Review

Game Sharing

Match History

Voice Chat

Live Broadcast

Anti Cheat

without architectural changes.

--------------------------------------------------
Code Quality
--------------------------------------------------

Strict TypeScript

No any

SOLID

Clean Architecture

Reusable hooks

Reusable services

Reusable components

Small files

No duplicated logic

--------------------------------------------------
Final Requirement
--------------------------------------------------

Before implementation

1. Inspect the existing project.

2. Reuse existing websocket infrastructure.

3. Reuse authentication.

4. Reuse API layer.

5. Reuse current layouts.

6. Build only the missing Online Game Room.

7. Produce production-ready code suitable for scaling to thousands of concurrent games.