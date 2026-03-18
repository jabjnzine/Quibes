# QUIBES CLINIC

ระบบจัดการคลินิกความงามแบบครบวงจร สำหรับสาขาเดียว

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend | NestJS 10 |
| Database | PostgreSQL (Supabase) |
| ORM | TypeORM 0.3 |
| Auth | JWT (Access + Refresh Token) |
| State | Zustand + TanStack Query v5 |
| UI | shadcn/ui + QUIBES Design System |

## Monorepo Structure

```
quibes-clinic/
├── apps/
│   ├── web/    ← Next.js frontend
│   └── api/    ← NestJS backend
├── packages/
│   └── shared/ ← Shared types, enums, constants
└── pnpm-workspace.yaml
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start backend
cd apps/api && pnpm dev

# Start frontend
cd apps/web && pnpm dev
```

## Modules

1. Dashboard & Analytics
2. Patient Management
3. Appointment & Treatment
4. CRM & Communication (LINE)
5. Financial Management
6. Inventory & System Admin
7. Reporting & Business Analytics
8. Activity Logs & Monitoring
