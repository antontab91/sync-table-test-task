# Sync Table Test Task

A simplified Airtable-like grid for managing marketing creatives with large dataset rendering, infinite scrolling, inline editing and realtime synchronization.  
Implemented as a pnpm monorepo with:

**Backend:** Node.js 20 + Express + PostgreSQL + WebSocket
**Frontend:** React 19 + Vite + TanStack Query/Table/Virtual
**Database:** PostgreSQL 16 seeded with 50,000 creative records
**Tooling:** pnpm workspaces + Docker Compose

## Features

**Large dataset**
PostgreSQL table seeded with **50,000+** creatives
Server-side filtering, sorting and pagination

**Virtualized grid**
TanStack Table + TanStack Virtual
Only visible rows rendered

**Infinite scroll**
TanStack Query `useInfiniteQuery`
Automatic page loading

**Inline editing**
Text / number / select cells are editable
PATCH `/creatives/:id`
Optimistic UI updates

**Realtime sync**
WebSocket `ws://localhost:4000/creatives`
Broadcasts `"creativeRecord.updated"` events
All open tabs stay synchronized

**From the repository root, run:**

```bash
docker-compose up --build
```
