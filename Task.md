The current Matchmaking implementation uses HTTP requests and/or polling.

Before implementing the Game Room, migrate the entire matchmaking flow to a WebSocket-based architecture.

IMPORTANT

Do NOT rewrite the existing implementation from scratch.

Inspect the existing frontend and backend first.

Reuse as much code as possible.

Refactor only where necessary.

The goal is to replace polling with real-time communication while keeping the existing architecture clean.

----------------------------------------------------
General Rules
----------------------------------------------------

- Do not duplicate existing services.
- Reuse authentication.
- Reuse API client.
- Reuse project architecture.
- Reuse existing dependency injection.
- Follow existing coding conventions.
- Produce production-quality code.

----------------------------------------------------
Backend
----------------------------------------------------

Inspect the backend.

If a websocket infrastructure already exists:

Reuse it.

Otherwise implement one using the project's existing technology.

If this is a NestJS backend:

Use WebSocket Gateway with Socket.IO.

Do not create a separate websocket server.

Authenticate websocket connections using the existing authentication mechanism.

Reject unauthenticated socket connections.

----------------------------------------------------
Gateway Responsibilities
----------------------------------------------------

Create a dedicated Matchmaking Gateway.

Responsibilities:

- user connected
- user disconnected
- join matchmaking queue
- leave matchmaking queue
- matchmaking status
- match found
- queue cleanup
- reconnect support

Business logic must remain inside services.

The gateway should only orchestrate events.

----------------------------------------------------
Queue Service
----------------------------------------------------

Extract matchmaking queue into its own service.

Responsibilities:

- add player
- remove player
- prevent duplicates
- prevent multiple active queue entries
- pair players
- cleanup stale users
- handle disconnects

Do not place queue logic inside the gateway.

----------------------------------------------------
Events
----------------------------------------------------

Use typed websocket events.

Example events:

client:

join_queue

leave_queue

ping

server:

queue_joined

queue_updated

searching

match_found

queue_cancelled

error

heartbeat

connected

disconnected

Avoid magic strings.

Create shared event constants or enums.

----------------------------------------------------
Frontend
----------------------------------------------------

Remove polling completely.

Do not send repeated HTTP requests while searching.

Create a reusable websocket layer.

Example architecture:

services/

socket/

SocketService

hooks/

useSocket

useMatchmaking

providers/

SocketProvider

The socket connection should be shared.

Do not create multiple socket connections.

----------------------------------------------------
Connection Lifecycle
----------------------------------------------------

Connect after authentication.

Disconnect on logout.

Automatically reconnect after temporary network failures.

Prevent duplicate socket connections.

Handle browser refresh.

Handle page navigation.

Handle tab closing.

----------------------------------------------------
Matchmaking Flow
----------------------------------------------------

When user opens Matchmaking page:

Connect to websocket if not already connected.

Emit:

join_queue

Backend responds with

queue_joined

Display

Searching...

When a match is found

Receive

match_found

Immediately stop searching.

Show opponent.

Wait about 2 seconds.

Navigate to the Game page.

----------------------------------------------------
Cancellation
----------------------------------------------------

When user clicks Cancel

Emit

leave_queue

Backend removes player from queue.

Navigate back to Lobby.

----------------------------------------------------
Disconnect Handling
----------------------------------------------------

If user disconnects while searching

Automatically remove them from queue.

If reconnect happens quickly

Optionally restore their queue position if supported.

Otherwise require joining again.

----------------------------------------------------
Security
----------------------------------------------------

Authenticate every websocket connection.

Never trust client events.

Validate every payload.

Rate limit queue joins.

Prevent spam.

Prevent duplicate joins.

Prevent replay attacks.

Validate user state before queueing.

Never expose internal server errors.

----------------------------------------------------
Performance
----------------------------------------------------

Keep one websocket connection per browser session.

Avoid unnecessary broadcasts.

Emit only required events.

Keep payloads minimal.

----------------------------------------------------
Typing
----------------------------------------------------

Use strict TypeScript.

No any.

Create DTOs/interfaces for every websocket payload.

Strongly type every emitted and received event.

----------------------------------------------------
Code Quality
----------------------------------------------------

Keep business logic out of components.

Keep gateway thin.

Keep services reusable.

Follow SOLID.

Follow Clean Architecture.

Do not introduce technical debt.

----------------------------------------------------
Future Compatibility
----------------------------------------------------

Design the websocket layer so it can later support:

- game moves
- resign
- draw offers
- player reconnect
- spectators
- chat
- clocks
- rematch

without requiring another architectural rewrite.

----------------------------------------------------
Final Requirement
----------------------------------------------------

Do not implement Game Room yet.

Only migrate the existing Matchmaking system to a production-ready websocket architecture that will be reused by all future real-time chess features.