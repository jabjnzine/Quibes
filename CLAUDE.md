# QUIBES CLINIC — CLAUDE.md

This file provides context for AI coding assistants (Claude Code, Cursor) working on this codebase.
Read this before generating any code.

---

## Project Overview

**QUIBES CLINIC** is a full-featured clinic management system for a **single-branch** beauty clinic.

> ⚠️ No multi-branch support. `branch_id` and `branches` table do **NOT** exist anywhere in this codebase. Never add them.

### Official Module List (8 Modules)

| # | Module | Description |
|---|---|---|
| 1 | Dashboard & Analytics | Revenue, queue, staff, OPD time — real-time |
| 2 | Patient Management | Registration, profile, medical history, before/after, LAB |
| 3 | Appointment & Treatment | Scheduling, OPD, walk-in, referral, treatment tracking |
| 4 | CRM & Communication | LINE surveys, promotions, reminders, staff assignment, LINE menu |
| 5 | Financial Management | Payment, cancellation, expenses, cash, deposits, documents |
| 6 | Inventory & System Admin | PR, PO, receiving, withdrawal, pharmacy sales, stock tracking |
| 7 | Reporting & Business Analytics | Financial, treatment, appointment, course, inventory, membership reports |
| 8 | Activity Logs & Monitoring | SMS/LINE logs, membership logs, export, price/payment/login history |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 14+ |
| Backend | NestJS | 10+ |
| Language | TypeScript | 5+ |
| Database | PostgreSQL | 15+ |
| ORM | TypeORM | 0.3+ |
| File Storage | Supabase Storage | — |
| Database | Supabase (PostgreSQL) | — |
| Auth | JWT (NestJS + Passport) | — |
| Frontend State | Zustand | — |
| Frontend Data Fetching | TanStack Query (React Query) | 5+ |
| Styling | Tailwind CSS | **4** |
| Package Manager | pnpm | — |

---

## Monorepo Structure

```
quibes-clinic/
├── apps/
│   ├── web/          ← Next.js frontend
│   └── api/          ← NestJS backend
├── packages/
│   └── shared/       ← Shared types, DTOs, constants
├── CLAUDE.md         ← This file
├── pnpm-workspace.yaml
└── docker-compose.yml
```

### Frontend (apps/web)

```
apps/web/
├── app/
│   ├── (auth)/               ← Login, logout pages
│   ├── (dashboard)/
│   │   ├── dashboard/        ← Module 1: Dashboard & Analytics
│   │   ├── patients/         ← Module 2: Patient Management
│   │   ├── appointments/     ← Module 3: Appointment & Treatment
│   │   ├── opd/              ← Module 3: OPD Management
│   │   ├── crm/              ← Module 4: CRM & Communication (LINE)
│   │   ├── finance/          ← Module 5: Financial Management
│   │   ├── inventory/        ← Module 6: Inventory & System Admin
│   │   ├── reports/          ← Module 7: Reporting & Analytics
│   │   ├── logs/             ← Module 8: Activity Logs & Monitoring
│   │   └── settings/         ← System settings (staff, services, courses)
│   └── api/                  ← Next.js API routes (LINE webhook only)
├── components/
│   ├── ui/                   ← shadcn/ui raw components (auto-generated)
│   ├── app/                  ← Base components wrap shadcn (AppDialog, AppSheet, AppBadge ฯลฯ)
│   ├── forms/                ← FormInput, FormSelect, FormDatePicker, FormPhotoUpload
│   ├── tables/               ← Data table components
│   └── layouts/              ← Sidebar, Topbar, PageHeader
├── lib/
│   ├── api.ts                ← Axios instance + JWT interceptors
│   ├── auth.ts               ← Auth helpers
│   └── utils.ts              ← cn(), formatDate(), formatCurrency()
├── hooks/                    ← Custom React hooks (one per module)
└── stores/                   ← Zustand stores
```

### Backend (apps/api)

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/       ← @CurrentUser, @Roles, etc.
│   │   ├── guards/           ← JwtAuthGuard, RolesGuard
│   │   ├── filters/          ← Global exception filter
│   │   ├── interceptors/     ← Response transform, audit logging
│   │   └── pipes/            ← Validation pipe
│   ├── config/               ← Config module (env vars)
│   ├── database/             ← TypeORM config + migrations
│   └── modules/
│       ├── auth/             ← Module: Auth
│       ├── staff/            ← Module: Staff (no branches)
│       ├── patients/         ← Module 2: Patient Management
│       ├── appointments/     ← Module 3: Appointment & Treatment
│       ├── opd/              ← Module 3: OPD Management
│       ├── lab/              ← Module 2: Laboratory Results
│       ├── finance/          ← Module 5: Financial Management
│       ├── courses/          ← Module 5: Course Management
│       ├── inventory/        ← Module 6: Inventory & System Admin
│       ├── members/          ← Module 6: Membership
│       ├── crm/              ← Module 4: CRM & Communication
│       ├── reports/          ← Module 7: Reporting & Analytics
│       └── logs/             ← Module 8: Activity Logs & Monitoring
```

---

## Tailwind CSS v4 Setup + QUIBES Design System

Tailwind v4 ไม่มี `tailwind.config.js` แล้ว — config ทุกอย่างอยู่ใน CSS

```bash
pnpm add tailwindcss@4 @tailwindcss/postcss
```

```js
// postcss.config.mjs
export default {
  plugins: { '@tailwindcss/postcss': {} },
}
```

### globals.css — QUIBES Brand Tokens (from Style Guide 1 Mar 2025)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ============================================
     QUIBES BRAND COLORS
     Source: Quibes_Style_Guide_1_Mar.pdf
  ============================================ */

  /* Primary Colors */
  --color-copper:         #AD6434;  /* QUIBES COPPER BROWN — Brand primary, CTA */
  --color-copper-80:      #BD835D;  /* Copper 80% opacity */
  --color-copper-60:      #CDA080;  /* Copper 60% opacity */
  --color-copper-30:      #E6CEB9;  /* Copper 30% opacity — hover/light bg */

  --color-caramel:        #C2A061;  /* QUIBES CARAMEL BROWN — cover bg, accent */
  --color-caramel-60:     #D4BA91;  /* Caramel 60% */
  --color-caramel-30:     #EDE3CE;  /* Caramel 30% — light surface */

  /* Secondary Colors */
  --color-mocha:          #8C6450;  /* QUIBES MOCHA BROWN — secondary action */
  --color-mocha-60:       #B4A08C;  /* Mocha 60% */
  --color-mocha-30:       #DDD3C9;  /* Mocha 30% */

  --color-olive:          #8C8C78;  /* QUIBES OLIVE GREEN — badge, tag */
  --color-olive-80:       #A3A38F;  /* Olive 80% */
  --color-olive-60:       #BABAA9;  /* Olive 60% */

  --color-espresso:       #643C28;  /* QUIBES ESPRESSO BROWN — dark text on light bg */
  --color-espresso-60:    #9A7464;  /* Espresso 60% */
  --color-espresso-30:    #CDBBB5;  /* Espresso 30% */

  /* Neutral */
  --color-black:          #000000;  /* Primary text */
  --color-white:          #FFFFFF;  /* Background */
  --color-gray-50:        #F9F7F5;  /* Page background — warm white */
  --color-gray-100:       #F0EDE8;  /* Card surface */
  --color-gray-200:       #E0D9D0;  /* Border light */
  --color-gray-400:       #A89E94;  /* Placeholder text */
  --color-gray-600:       #6B6259;  /* Secondary text */
  --color-gray-800:       #2C2520;  /* Primary text dark */

  /* Semantic — UI States */
  --color-success:        #4CAF7D;  /* Success green */
  --color-warning:        #E8A838;  /* Warning amber */
  --color-danger:         #D94F4F;  /* Error/danger red */
  --color-info:           #5B9BD5;  /* Info blue */

  /* ============================================
     TYPOGRAPHY
     Primary:   AWConqueror Std Didot (EN) — Heading, Logo
     Secondary: Than (TH + EN) — Body, UI text
     Fallback:  serif / sans-serif
  ============================================ */
  --font-display:  "AWConqueror Std Didot", "Didot", "GFS Didot", serif;
  --font-sans:     "Than", "Noto Sans Thai", "Inter", sans-serif;
  --font-mono:     "JetBrains Mono", "Fira Code", monospace;

  /* Font Weights */
  --font-weight-light:     300;   /* AWConqueror Light / Than Extra Light */
  --font-weight-regular:   400;   /* AWConqueror Regular */
  --font-weight-bold:      700;   /* AWConqueror Bold / Than Extrabold */

  /* Font Sizes — Scale */
  --font-size-xs:   12px;
  --font-size-sm:   14px;
  --font-size-base: 16px;
  --font-size-lg:   18px;
  --font-size-xl:   20px;
  --font-size-2xl:  24px;
  --font-size-3xl:  30px;
  --font-size-4xl:  36px;

  /* Line Height — 120%–150% per Style Guide */
  --line-height-tight:   1.2;   /* Heading */
  --line-height-normal:  1.4;   /* UI text */
  --line-height-relaxed: 1.6;   /* Body paragraph */

  /* ============================================
     SPACING & RADIUS
  ============================================ */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-pill: 9999px;

  --spacing-page-x:  24px;   /* Horizontal page padding */
  --spacing-card:    20px;   /* Card internal padding */
  --spacing-section: 32px;   /* Between sections */
}
```

### Usage Examples

```tsx
// Heading — ใช้ font-display (AWConqueror Didot)
<h1 className="font-display font-bold text-4xl text-copper">QUIBES</h1>

// Body Thai — ใช้ font-sans (Than)
<p className="font-sans text-base text-gray-800 leading-relaxed">ข้อมูลผู้ป่วย</p>

// Primary CTA Button
<button className="bg-copper hover:bg-espresso text-white rounded-lg px-6 py-2.5">
  บันทึก
</button>

// Card surface
<div className="bg-gray-100 border border-gray-200 rounded-lg p-5">

// Badge — status
<span className="bg-caramel-30 text-espresso text-xs rounded-pill px-3 py-1">
  รอรับบริการ
</span>
```

### Color Usage Guide

| Situation | Color Token |
|---|---|
| Primary CTA, Active nav | `copper` |
| Hover state | `espresso` |
| Page background | `gray-50` |
| Card surface | `gray-100` |
| Border | `gray-200` |
| Primary text | `gray-800` / `black` |
| Secondary text | `gray-600` |
| Placeholder | `gray-400` |
| Success badge | `success` |
| Warning badge | `warning` |
| Error / delete | `danger` |
| Accent / tag | `olive` |

### Font Loading (Next.js)

```typescript
// app/layout.tsx
// AWConqueror Std Didot เป็น commercial font — ต้องซื้อ license
// ใช้ next/font/local สำหรับ self-hosted

import localFont from 'next/font/local'

const didot = localFont({
  src: [
    { path: './fonts/AWConquerorStdDidot-Light.woff2',   weight: '300' },
    { path: './fonts/AWConquerorStdDidot-Regular.woff2', weight: '400' },
    { path: './fonts/AWConquerorStdDidot-Bold.woff2',    weight: '700' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const than = localFont({
  src: [
    { path: './fonts/Than-ExtraLight.woff2', weight: '200' },
    { path: './fonts/Than-ExtraBold.woff2',  weight: '800' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${didot.variable} ${than.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

> ⚠️ **AWConqueror Std Didot** และ **Than** เป็น commercial fonts — ต้องมี license ก่อน deploy production
> ถ้ายังไม่มี license ให้ใช้ `"Cormorant Garamond"` (Google Fonts) แทน Didot ชั่วคราวได้ครับ

- ❌ ไม่มี `tailwind.config.js` — ใช้ `@theme {}` เท่านั้น
- ❌ ไม่มี `@tailwind base/components/utilities`
- ❌ ห้าม hardcode สีตรงๆ เช่น `#AD6434` ใน component — ใช้ token เสมอ
- ✅ shadcn/ui v4 compatible: `pnpm dlx shadcn@canary init`

---



### General

- **Language**: TypeScript strict mode everywhere. No `any` unless absolutely necessary.
- **Naming**:
  - Files: `kebab-case.ts`
  - Classes: `PascalCase`
  - Variables/functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Database columns: `snake_case`
- **Imports**: Use absolute paths via `@/` alias, not relative `../../`
- **Comments**: English only for code comments. Thai is fine for user-facing strings.

### Backend (NestJS)

Every module follows this exact structure — always generate all files:

```
modules/patients/
├── patients.module.ts
├── patients.controller.ts
├── patients.service.ts
├── entities/
│   └── patient.entity.ts
├── dto/
│   ├── create-patient.dto.ts
│   ├── update-patient.dto.ts
│   └── query-patient.dto.ts
└── patients.controller.spec.ts
```

**Controller pattern:**

```typescript
@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  findAll(@Query() query: QueryPatientDto) {
    return this.patientsService.findAll(query);
  }
}
```

**Service pattern:**

```typescript
@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async findAll(query: QueryPatientDto): Promise<PaginatedResult<Patient>> {
    // implementation
  }
}
```

**DTO pattern — always use class-validator:**

```typescript
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  phone?: string;
}
```

**Entity pattern:**

```typescript
@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Branch, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**API response — always wrap with this shape:**

```typescript
{
  success: true,
  data: { ... },
  meta: {          // for paginated results only
    total: 100,
    page: 1,
    limit: 20,
    totalPages: 5
  }
}
```

**Error response:**

```typescript
{
  success: false,
  message: "Patient not found",
  statusCode: 404
}
```

### Frontend (Next.js)

---

#### Hooks (hooks/)

**Rule: ทุก page ต้องเรียกข้อมูลผ่าน hook เท่านั้น — ห้ามเรียก `api` ตรงจาก component**

Hook แบ่งเป็น 2 ประเภท:
- **Data hooks** — fetch ข้อมูลด้วย TanStack Query
- **UI hooks** — จัดการ local UI state เช่น filter, pagination, modal

**Rule เลือก pattern:**

```
data ใช้แค่ใน page เดียว     → hook คืนค่าตรงๆ (ไม่ผ่าน store)
data แชร์หลาย component/page → hook fetch → set Zustand store
```

**ตัวอย่างสำหรับ QUIBES:**

| Data | Pattern | เหตุผล |
|---|---|---|
| patients list | Pattern A: hook ตรงๆ | ใช้แค่ใน patients/page.tsx |
| currentPatient | Pattern B: hook → store | หลาย component ต้องรู้ (header, form, photos) |
| patient autocomplete search | Pattern C: hook ตรงๆ + RHF | ephemeral, form-scoped — ห้ามใช้ store |
| OPD active visit | hook → store | multi-step หลาย page |
| cart items | store | ใช้ทั้ง OPD + checkout |
| appointment list | Pattern A: hook ตรงๆ | ใช้แค่ใน appointments/page.tsx |

**โครงสร้าง hooks/ ตาม Module:**

```
hooks/
├── use-auth.ts               ← login, logout, getCurrentUser
├── use-patients.ts           ← Module 2
├── use-appointments.ts       ← Module 3
├── use-opd.ts                ← Module 3
├── use-finance.ts            ← Module 5
├── use-courses.ts            ← Module 5
├── use-inventory.ts          ← Module 6
├── use-members.ts            ← Module 6
├── use-crm.ts                ← Module 4
├── use-reports.ts            ← Module 7
├── use-logs.ts               ← Module 8
└── use-dashboard.ts          ← Module 1
```

**Pattern A — hook คืนค่าตรงๆ (data ใช้แค่ที่เดียว):**

```typescript
// hooks/use-patients.ts
export function usePatients(query?: QueryPatientDto) {
  return useQuery({
    queryKey: ['patients', query],
    queryFn: () => api.get('/patients', { params: query }).then(r => r.data),
  })
}

// page รับตรงจาก hook
export default function PatientsPage() {
  const filter = usePatientFilter()
  const { data, isLoading } = usePatients({
    search: filter.search,
    page: filter.page,
  })

  return <PatientTable data={data?.data} />
}
```

**Pattern B — hook fetch → set store (data แชร์หลายที่):**

```typescript
// hooks/use-patients.ts
export function usePatient(id: string) {
  const { setCurrentPatient } = usePatientStore()

  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => api.get(`/patients/${id}`).then(r => r.data.data),
    enabled: !!id,
    onSuccess: (data) => setCurrentPatient(data),  // set store เพราะหลาย component ใช้
  })
}

// หลาย component อ่านจาก store โดยไม่ต้อง pass props
export function PatientHeader() {
  const { currentPatient } = usePatientStore()
  return <h1>{currentPatient?.firstName}</h1>
}

export function PatientPhotos() {
  const { currentPatient } = usePatientStore()
  return <PhotoGallery patientId={currentPatient?.id} />
}
```

**Mutation pattern (เหมือนกันทั้ง 2 pattern):**

```typescript
export function useCreatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePatientDto) => api.post('/patients', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  })
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreatePatientDto>) => api.patch(`/patients/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patients'] })
      qc.invalidateQueries({ queryKey: ['patients', id] })
    },
  })
}
```

**UI hook pattern (local state เท่านั้น):**

```typescript
// hooks/use-patient-filter.ts
export function usePatientFilter() {
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all')
  const [page, setPage] = useState(1)

  const reset = () => { setSearch(''); setGender('all'); setPage(1) }

  return { search, setSearch, gender, setGender, page, setPage, reset }
}
```

---

**Pattern C — Autocomplete Search (ห้ามใช้ Store):**

Search-as-you-type ใน form (เช่น PatientSearch ใน AppointmentForm) **ห้ามผ่าน Zustand store** เพราะ:

1. Store เป็น global singleton — ถ้ามี 2 form instance พร้อมกัน (create dialog + edit sheet) searchQuery ทับกัน
2. Search results เป็น ephemeral server data — TanStack Query handle cache/dedup ได้ดีกว่า
3. Selected value เก็บใน React Hook Form (`setValue`) ไม่ต้องการ global state

```typescript
// ✅ Pattern ที่ถูกต้อง: debounce ใน component, fetch ผ่าน hook
function PatientSearchField() {
  const [rawQuery,   setRawQuery]   = useState('')   // local — ไม่ไปรบกวน form อื่น
  const [debouncedQ, setDebouncedQ] = useState('')

  // TanStack Query: cache by queryKey, dedup ถ้า 2 component search คำเดียวกัน
  const { data: results = [], isFetching } = usePatientSearch(debouncedQ)

  const { setValue } = useFormContext()

  const selectPatient = (p: PatientOption) => {
    setValue('patientId',   p.id)
    setValue('patientName', `${p.firstName} ${p.lastName} (${p.code})`)
    // ✅ เก็บใน React Hook Form — form-scoped, ไม่ global
  }
}

// ❌ ห้ามทำแบบนี้
function PatientSearchField() {
  const { setSearchQuery, results } = useSearchStore() // ← store เดียวกัน ถ้ามี 2 form = conflict
}
```

```typescript
// hooks/use-patients.ts — search hook สำหรับ autocomplete
export function usePatientSearch(search: string) {
  return useQuery({
    queryKey: ['patients', 'search', search],
    queryFn: () => api.get('/patients', { params: { search, limit: 8 } }).then(r => r.data.data),
    enabled: search.trim().length > 0,
    staleTime: 30_000,          // cache 30s — พิมพ์คำเดิมซ้ำไม่ fetch ใหม่
    placeholderData: (prev) => prev,  // ไม่กระพริบระหว่าง fetch
  })
}
```

**สรุป rule:**

| State | เก็บที่ไหน | เหตุผล |
|---|---|---|
| `rawQuery` / `debouncedQ` | `useState` ใน component | local เฉพาะ form instance นั้น |
| Search results | TanStack Query | server data, cache อัตโนมัติ |
| `patientId` ที่เลือก | React Hook Form `setValue` | form-scoped |
| `currentPatient` (detail page) | Zustand store | แชร์ข้าม 7 tabs ไม่มี parent-child |

---

#### Stores (stores/)

**Rule: Zustand เก็บ 2 ประเภท**
1. **Global UI state** — sidebar, toasts, theme
2. **Shared server data** — data ที่หลาย component/page ต้องอ่านร่วมกัน

**โครงสร้าง stores/:**

```
stores/
├── auth.store.ts         ← user, token, role — persisted
├── ui.store.ts           ← sidebar, toasts
├── patient.store.ts      ← currentPatient (shared across patient detail pages)
├── opd.store.ts          ← active OPD visit flow (multi-step)
└── cart.store.ts         ← items ตอน checkout
```

> ⚠️ ไม่มี store สำหรับ list data (patients[], appointments[]) — ใช้ TanStack Query cache แทน
> มี store เฉพาะ current item ที่ต้องแชร์หลาย component

**patient.store.ts — เก็บแค่ currentPatient:**

```typescript
// stores/patient.store.ts
import { create } from 'zustand'
import type { Patient } from '@quibes/shared'

interface PatientState {
  currentPatient: Patient | null
  setCurrentPatient: (patient: Patient | null) => void
  reset: () => void
}

export const usePatientStore = create<PatientState>((set) => ({
  currentPatient: null,
  setCurrentPatient: (currentPatient) => set({ currentPatient }),
  reset: () => set({ currentPatient: null }),
}))
```

**auth.store.ts:**

```typescript
// stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Staff } from '@quibes/shared'

interface AuthState {
  user: Staff | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: Staff, token: string) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'quibes-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)
```

**ui.store.ts:**

```typescript
// stores/ui.store.ts
import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
}

interface UIState {
  sidebarOpen: boolean
  toasts: Toast[]
  toggleSidebar: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toasts: [],
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  addToast: (toast) => set(s => ({
    toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }]
  })),
  removeToast: (id) => set(s => ({
    toasts: s.toasts.filter(t => t.id !== id)
  })),
}))
```

**opd.store.ts — multi-step OPD flow:**

```typescript
// stores/opd.store.ts
import { create } from 'zustand'
import type { OpdItem } from '@quibes/shared'

interface OpdState {
  visitId: string | null
  patientId: string | null
  items: OpdItem[]
  setVisit: (visitId: string, patientId: string) => void
  addItem: (item: OpdItem) => void
  removeItem: (itemId: string) => void
  clearVisit: () => void
}

export const useOpdStore = create<OpdState>((set) => ({
  visitId: null,
  patientId: null,
  items: [],
  setVisit: (visitId, patientId) => set({ visitId, patientId }),
  addItem: (item) => set(s => ({ items: [...s.items, item] })),
  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  clearVisit: () => set({ visitId: null, patientId: null, items: [] }),
}))
```

**cart.store.ts — receipt checkout flow:**

```typescript
// stores/cart.store.ts
import { create } from 'zustand'

interface CartItem {
  type: 'service' | 'product' | 'course'
  referenceId: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (referenceId: string, qty: number) => void
  removeItem: (referenceId: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set(s => ({ items: [...s.items, item] })),
  updateQty: (id, qty) => set(s => ({
    items: s.items.map(i => i.referenceId === id ? { ...i, quantity: qty } : i)
  })),
  removeItem: (id) => set(s => ({
    items: s.items.filter(i => i.referenceId !== id)
  })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) =>
    sum + (i.unitPrice * i.quantity) - i.discount, 0
  ),
}))
```

---

**Zustand store pattern:**

```typescript
// stores/auth.store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-store' }
  )
);
```

**Form pattern — always use React Hook Form + Zod + FormProvider:**

Every form uses `FormProvider` + `useFormContext` so child components can access the form without prop drilling.

```typescript
// Pattern: always wrap with FormProvider
const schema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female']),
  dob: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PatientForm({ onSubmit }: Props) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="firstName" label="ชื่อ" required />
        <FormInput name="lastName" label="นามสกุล" required />
        <FormInput name="phone" label="เบอร์โทร" />
        <FormSelect name="gender" label="เพศ" options={genderOptions} />
        <FormDatePicker name="dob" label="วันเกิด" />
        <button type="submit">บันทึก</button>
      </form>
    </FormProvider>
  );
}
```

---

### shadcn/ui Setup

```bash
pnpm dlx shadcn@canary init
```

**Components ที่ใช้ในโปรเจกต์นี้ — install ทั้งหมดครั้งเดียว:**

```bash
pnpm dlx shadcn@canary add \
  dialog sheet alert-dialog \
  table \
  dropdown-menu select \
  calendar \
  tabs badge \
  skeleton \
  tooltip \
  command \
  toast
```

---

### Base Components (components/ui/app-*)

**Rule: ห้ามใช้ shadcn ตรงๆ ใน page/feature — ต้อง wrap เป็น base component เสมอ**

เหตุผล: ถ้าต้องเปลี่ยน style หรือ behavior ทีหลัง แก้ที่ base component ที่เดียวครบ

**โครงสร้าง:**

```
components/ui/
├── app-dialog.tsx        ← wrap Dialog
├── app-sheet.tsx         ← wrap Sheet (slide-in)
├── app-alert.tsx         ← wrap AlertDialog (confirm/delete)
├── app-table.tsx         ← wrap Table + column definitions
├── app-badge.tsx         ← wrap Badge + QUIBES status variants
├── app-skeleton.tsx      ← wrap Skeleton + preset layouts
├── app-tooltip.tsx       ← wrap Tooltip
├── app-command.tsx       ← wrap Command (global search)
└── app-tabs.tsx          ← wrap Tabs
```

**AppDialog — modal ทั่วไป:**

```tsx
// components/ui/app-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface AppDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function AppDialog({ open, onClose, title, description, children, size = 'md' }: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={sizeMap[size]}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-copper">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

**AppAlert — confirm / delete dialog:**

```tsx
// components/ui/app-alert.tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel,
         AlertDialogContent, AlertDialogDescription,
         AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface AppAlertProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

export function AppAlert({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'ยืนยัน', variant = 'default', loading
}: AppAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={variant === 'danger' ? 'bg-danger hover:bg-danger/90' : 'bg-copper hover:bg-espresso'}
          >
            {loading ? 'กำลังดำเนินการ...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**AppSheet — slide-in panel จากขวา:**

```tsx
// components/ui/app-sheet.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface AppSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'w-[360px]', md: 'w-[480px]', lg: 'w-[640px]' }

export function AppSheet({ open, onClose, title, children, side = 'right', size = 'md' }: AppSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side={side} className={sizeMap[size]}>
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-copper">{title}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
```

**AppBadge — status variants ตาม QUIBES design:**

```tsx
// components/ui/app-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type BadgeVariant = 'pending' | 'confirmed' | 'in_progress' | 'done' |
                    'cancelled' | 'paid' | 'unpaid' | 'course' | 'default'

const variantMap: Record<BadgeVariant, string> = {
  pending:      'bg-caramel-30 text-espresso',
  confirmed:    'bg-olive-30 text-espresso',
  in_progress:  'bg-caramel-30 text-copper',
  done:         'bg-success-bg text-success',
  cancelled:    'bg-danger-bg text-danger',
  paid:         'bg-success-bg text-success',
  unpaid:       'bg-warning-bg text-warning',
  course:       'bg-mocha-30 text-espresso',
  default:      'bg-gray-100 text-gray-600',
}

const labelMap: Record<BadgeVariant, string> = {
  pending:      'รอยืนยัน',
  confirmed:    'ยืนยันแล้ว',
  in_progress:  'กำลังรักษา',
  done:         'เสร็จสิ้น',
  cancelled:    'ยกเลิก',
  paid:         'ชำระแล้ว',
  unpaid:       'รอชำระ',
  course:       'คอร์ส',
  default:      '',
}

interface AppBadgeProps {
  variant?: BadgeVariant
  label?: string
  className?: string
}

export function AppBadge({ variant = 'default', label, className }: AppBadgeProps) {
  return (
    <Badge className={cn('rounded-full font-medium text-xs', variantMap[variant], className)}>
      {label ?? labelMap[variant]}
    </Badge>
  )
}
```

**AppSkeleton — preset loading layouts:**

```tsx
// components/ui/app-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <TableSkeleton rows={8} />
    </div>
  )
}
```

---

### Form Components (components/forms/)

**Rule: ใช้ `register` สำหรับ native HTML input, ใช้ `Controller` สำหรับ custom components**

| Component | Input type | ใช้ |
|---|---|---|
| `FormInput` | text, email, number, password | `register` |
| `FormSelect` | shadcn Select, custom dropdown | `Controller` |
| `FormDatePicker` | date picker | `Controller` |
| `FormTextarea` | textarea | `register` |
| `FormPhotoUpload` | file upload (Before/After) | `Controller` |
| `FormCheckbox` | checkbox | `Controller` |

**FormInput — ใช้ `register` (native input):**

```tsx
// components/forms/form-input.tsx
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormInputProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function FormInput({
  name, label, type = 'text', placeholder, required, className
}: FormInputProps) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          'h-9 rounded-md border border-gray-300 px-3 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-500 focus:ring-red-500'
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

**FormSelect — ใช้ `Controller` (shadcn/ui Select):**

```tsx
// components/forms/form-select.tsx
import { useFormContext, Controller } from 'react-hook-form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface Option { label: string; value: string }

interface FormSelectProps {
  name: string
  label: string
  options: Option[]
  placeholder?: string
  required?: boolean
}

export function FormSelect({ name, label, options, placeholder, required }: FormSelectProps) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={placeholder ?? `เลือก${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

**FormDatePicker — ใช้ `Controller`:**

```tsx
// components/forms/form-date-picker.tsx
import { useFormContext, Controller } from 'react-hook-form'
import { DatePicker } from '@/components/ui/date-picker'

export function FormDatePicker({ name, label, required }: { name: string; label: string; required?: boolean }) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker value={field.value} onChange={field.onChange} />
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

**FormPhotoUpload — ใช้ `Controller` (Before/After รูป):**

```tsx
// components/forms/form-photo-upload.tsx
// Note: ส่งไฟล์ไป POST /api/v1/patients/:id/photos (multipart/form-data)
// Backend จะ resize + upload to Supabase — ไม่ upload จาก frontend โดยตรง
import { useFormContext, Controller } from 'react-hook-form'

interface FormPhotoUploadProps {
  name: string
  label: string
  type: 'before' | 'after'
}

export function FormPhotoUpload({ name, label, type }: FormPhotoUploadProps) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors block">
            {field.value ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={URL.createObjectURL(field.value)}
                  className="max-h-40 rounded object-cover"
                  alt={label}
                />
                <span className="text-xs text-gray-400">{field.value.name}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                คลิกเพื่ออัปโหลดรูป {type === 'before' ? 'Before' : 'After'}
              </p>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => field.onChange(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

---

## Database Conventions

- All table names: **plural snake_case** (e.g., `patients`, `opd_visits`, `patient_courses`)
- All column names: **snake_case**
- All primary keys: `uuid` type, named `id`
- All tables must have: `created_at`, `updated_at` (auto-managed by TypeORM)
- Soft delete: use `deleted_at` column (TypeORM `@DeleteDateColumn`) — never hard delete
- Foreign keys: named `{table_singular}_id` (e.g., `patient_id`, `staff_id`)
- Indexes: always index foreign keys and frequently queried columns (`phone`, `code`, etc.)
- ❌ No `branch_id` anywhere — single-branch system

### Core Tables Reference

```
-- Module 2: Patient Management
patients          → id, code, first_name, last_name, dob, gender, phone, allergy, medical_history, national_id (encrypted)
patient_photos    → id, patient_id, visit_id, photo_type (before/after), storage_path, taken_at
patient_diaries   → id, patient_id, note, recorded_at
lab_results       → id, patient_id, visit_id, test_name, result, unit, ref_range, tested_at

-- Module 3: Appointment & Treatment
appointments      → id, patient_id, staff_id, service_id, scheduled_at, status, note
opd_visits        → id, patient_id, doctor_id, appointment_id, started_at, ended_at, diagnosis, note
opd_items         → id, visit_id, item_type (service/product/course), reference_id, quantity, unit_price, discount, total
referrals         → id, visit_id, patient_id, referred_to, reason, created_at

-- Module 4: CRM & Communication
surveys           → id, title, questions (jsonb), created_at
survey_responses  → id, survey_id, patient_id, answers (jsonb), submitted_at
crm_messages      → id, patient_id, channel (line/sms), content, sent_at, status
line_staff_assignments → id, patient_id, staff_id, assigned_at

-- Module 5: Financial Management
receipts          → id, visit_id, patient_id, subtotal, discount, total, payment_method, status
receipt_items     → id, receipt_id, item_type, reference_id, quantity, unit_price, total
expenses          → id, category, amount, description, paid_at, created_by
cash_transactions → id, type (in/out), amount, reference_id, note, created_at
deposits          → id, patient_id, amount, remaining, note, created_at
patient_courses   → id, patient_id, course_id, total_sessions, used_sessions, expires_at, status, sold_at, created_at, created_by

-- Module 6: Inventory & System Admin
products          → id, code, name, category, unit, cost_price, sell_price, can_partial_use, is_active
inventory_stock   → id, product_id, quantity_ml, min_quantity, updated_at
purchase_requests → id, product_id, quantity, reason, status, requested_by, created_at
purchase_orders   → id, pr_id, product_id, quantity, unit_cost, total, ordered_at, status
stock_movements   → id, product_id, type (in/out/adjust/open_vial/dispose_vial), quantity_ml, reference_id, note, created_at
pharmacy_sales    → id, product_id, quantity, unit_price, total, sold_at, sold_by
patient_vials     → id, patient_id, product_id, opd_item_id, total_ml, used_ml, remaining_ml, status (active/expired/disposed), opened_at, expires_at, disposed_at, dispose_reason, note
members           → id, patient_id, tier, points, joined_at, expires_at

-- Module 7: Staff
staff             → id, first_name, last_name, email, role, is_active, created_at

-- Module 8: Activity Logs
activity_logs     → id, user_id, action, entity, entity_id, old_value (jsonb), new_value (jsonb), ip_address, created_at
```

---

## Authentication & Authorization

### Token Strategy

| Token | อายุ | เก็บที่ | ใช้ทำอะไร |
|---|---|---|---|
| Access Token (JWT) | 15 นาที | Memory (Zustand) | ส่งใน `Authorization: Bearer` ทุก request |
| Refresh Token | 7 วัน | `httpOnly Cookie` | ขอ Access Token ใหม่เมื่อหมดอายุ |

**หลักการ:**
- Access Token อายุสั้น — ถ้าหลุดออกไปก็หมดอายุเร็ว
- Refresh Token เก็บใน `httpOnly Cookie` เท่านั้น — JS ฝั่ง client อ่านไม่ได้
- ห้ามเก็บ token ใดๆ ใน `localStorage`

---

### Backend — NestJS Auth Flow

**API Endpoints:**

```
POST /api/v1/auth/login          ← รับ email+password, return access+refresh token
POST /api/v1/auth/refresh        ← อ่าน refresh token จาก cookie, return access token ใหม่
POST /api/v1/auth/logout         ← clear httpOnly cookie
GET  /api/v1/auth/me             ← return current user (ต้องมี valid access token)
```

**Login response:**

```typescript
// auth.service.ts
async login(dto: LoginDto) {
  const staff = await this.validateStaff(dto.email, dto.password)

  const accessToken = this.jwt.sign(
    { sub: staff.id, role: staff.role },
    { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: '15m' }
  )

  const refreshToken = this.jwt.sign(
    { sub: staff.id },
    { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}
```

**Set refresh token ใน httpOnly Cookie:**

```typescript
// auth.controller.ts
@Post('login')
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken } = await this.authService.login(dto)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/api/v1/auth/refresh',     // cookie ใช้ได้แค่ route นี้เท่านั้น
  })

  return { accessToken, user: { id: staff.id, role: staff.role, name: staff.firstName } }
}

@Post('refresh')
async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const refreshToken = req.cookies['refresh_token']
  if (!refreshToken) throw new UnauthorizedException()

  const { accessToken, newRefreshToken } = await this.authService.refreshTokens(refreshToken)

  // Rotate refresh token (แทนที่ด้วยอันใหม่ทุกครั้ง)
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth/refresh',
  })

  return { accessToken }
}

@Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' })
  return { success: true }
}
```

---

### Frontend — Axios Interceptor (lib/api.ts)

Access Token เก็บใน Zustand (memory) และแนบทุก request อัตโนมัติ
เมื่อ 401 จะ auto-refresh แล้ว retry request เดิม

```typescript
// lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  withCredentials: true,   // ส่ง httpOnly cookie ไปด้วยทุก request (สำหรับ refresh)
})

// Request interceptor — แนบ access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — auto refresh เมื่อ 401
let isRefreshing = false
let queue: Array<(token: string) => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // ถ้า 401 และยังไม่เคย retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (isRefreshing) {
        // มี refresh อยู่แล้ว — เข้าคิวรอ
        return new Promise((resolve) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }

      isRefreshing = true

      try {
        const { data } = await api.post('/auth/refresh')
        const newToken = data.accessToken

        useAuthStore.getState().setToken(newToken)

        // flush queue
        queue.forEach(cb => cb(newToken))
        queue = []

        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        // refresh หมดอายุ — force logout
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
```

**อัปเดต auth.store ให้มี `setToken`:**

```typescript
// stores/auth.store.ts
interface AuthState {
  user: Staff | null
  token: string | null          // access token เท่านั้น — อยู่ใน memory
  isAuthenticated: boolean
  setAuth: (user: Staff, token: string) => void
  setToken: (token: string) => void   // ← ใช้ตอน refresh
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'quibes-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
      // ⚠️ ไม่ persist token — เก็บใน memory เท่านั้น ปลอดภัยกว่า localStorage
    }
  )
)
```

---

### Environment Variables เพิ่มเติม (Backend)

```env
JWT_ACCESS_SECRET=access-secret-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=refresh-secret-change-this-different-from-access
JWT_REFRESH_EXPIRES_IN=7d
```

> ⚠️ `JWT_ACCESS_SECRET` และ `JWT_REFRESH_SECRET` ต้องเป็นคนละค่ากัน

---

**Roles:**

```typescript
export enum Role {
  ADMIN   = 'admin',
  DOCTOR  = 'doctor',
  NURSE   = 'nurse',
  CASHIER = 'cashier',
}
```

**Permission matrix (ตรวจสอบก่อน Generate endpoint ใหม่):**

| Feature | Admin | Doctor | Nurse | Cashier |
|---|---|---|---|---|
| Settings / Staff | ✅ | ❌ | ❌ | ❌ |
| Patients (read) | ✅ | ✅ | ✅ | ✅ |
| Patients (write) | ✅ | ✅ | ✅ | ❌ |
| Appointments | ✅ | ✅ | ✅ | ✅ |
| OPD | ✅ | ✅ | ✅ | ❌ |
| Finance / Payment | ✅ | ❌ | ❌ | ✅ |
| Courses | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ❌ | ✅ | ❌ |
| CRM / LINE | ✅ | ❌ | ✅ | ❌ |
| Reports | ✅ | ❌ | ❌ | ✅ |
| Activity Logs | ✅ | ❌ | ❌ | ❌ |

---

## File Storage (Supabase)

Bucket: `clinic-photos`

Path structure:
```
patients/{patientId}/before/{visitId}_{index}.jpg
patients/{patientId}/after/{visitId}_{index}.jpg
```

### Upload Flow — always via Backend (never direct from Frontend)

รูป Before/After เป็นข้อมูลทางการแพทย์ — ต้องผ่าน NestJS เสมอเพื่อ validate, resize และ audit log

```
FE เลือกรูป
    ↓
POST /api/v1/patients/:id/photos (multipart/form-data)
    ↓
NestJS: validate (jpg/png only, max 20MB)
    ↓
NestJS: resize ด้วย sharp (max 1920px, quality 85%)
    ↓
NestJS: upload ไป Supabase Storage ด้วย service key
    ↓
NestJS: บันทึก path ลง patient_photos table + audit log
    ↓
Return { photoId, url }
```

**NestJS upload service pattern:**

```typescript
// modules/patients/patients-photo.service.ts
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

@Injectable()
export class PatientsPhotoService {
  async upload(
    patientId: string,
    visitId: string,
    type: 'before' | 'after',
    file: Express.Multer.File,
  ): Promise<PatientPhoto> {
    // 1. Validate
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, WebP allowed')
    }

    // 2. Resize with sharp (20MB → ~1-2MB)
    const compressed = await sharp(file.buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()

    // 3. Upload to Supabase with service key
    const filename = `${visitId}_${Date.now()}.jpg`
    const path = `patients/${patientId}/${type}/${filename}`

    const { error } = await this.supabase.storage
      .from('clinic-photos')
      .upload(path, compressed, { contentType: 'image/jpeg', upsert: false })

    if (error) throw new InternalServerErrorException(error.message)

    // 4. Save to DB
    return this.photoRepo.save({ patientId, visitId, photoType: type, storagePath: path })
  }
}
```

**Controller:**

```typescript
@Post(':id/photos')
@UseInterceptors(FileInterceptor('file'))
@Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
uploadPhoto(
  @Param('id') patientId: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: UploadPhotoDto,
) {
  return this.photoService.upload(patientId, dto.visitId, dto.type, file)
}
```

**Rules:**
- ✅ Always use NestJS service key — never expose to frontend
- ✅ Always resize with `sharp` before upload — saves ~80% storage
- ✅ Always log upload action in `activity_logs`
- ❌ Never upload directly from frontend to Supabase
- ❌ Never store raw original file (always compress first)

---

## Infrastructure & Deployment

| Service | Platform | Purpose |
|---|---|---|
| Frontend (Next.js) | **Vercel** | Hosting, CDN, Edge Network |
| Backend (NestJS) | **Railway** | API server, always-on, no timeout |
| Database (PostgreSQL) | **Supabase** | DB + Storage เท่านั้น (ไม่ใช้ Supabase Auth) |
| File Storage | **Supabase Storage** | รูป Before/After ผู้ป่วย |

### Vercel — Frontend

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

```json
// vercel.json (root)
{
  "buildCommand": "pnpm --filter web build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

### Railway — Backend

```bash
# railway.toml (apps/api)
[build]
builder = "nixpacks"

[deploy]
startCommand = "node dist/main"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
```

```typescript
// NestJS health check endpoint
@Get('/health')
health() { return { status: 'ok' } }
```

### Supabase — Database + Storage only

```bash
# เชื่อม NestJS กับ Supabase PostgreSQL ตรงๆ ผ่าน connection string
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

> ⚠️ ใช้ **Transaction pooler (port 6543)** สำหรับ Railway — ไม่ใช้ direct connection (port 5432)
> ⚠️ ไม่ใช้ Supabase Auth — Auth ทำเองด้วย NestJS + JWT

---

## Environment Variables

### Backend (apps/api/.env)

```env
NODE_ENV=development
PORT=3001

# Supabase PostgreSQL (Transaction Pooler)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT — NestJS ทำ Auth เอง (ไม่ใช้ Supabase Auth)
JWT_ACCESS_SECRET=change-this-in-production-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=different-secret-from-access-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# Supabase Storage (service key สำหรับ upload รูป)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Encryption — national_id AES-256-CBC
# generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-32-byte-hex-key-here

# LINE CRM
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
```

### Frontend (apps/web/.env.local)

```env
# NestJS API (Railway)
NEXT_PUBLIC_API_URL=https://quibes-api.railway.app

# Supabase (anon key — สำหรับ Storage public URL เท่านั้น)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Railway Environment Variables (Production)

ตั้งค่าใน Railway Dashboard → Variables:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<Supabase pooler URL>
JWT_ACCESS_SECRET=<strong random string>
JWT_REFRESH_SECRET=<different strong random string>
SUPABASE_URL=<from Supabase dashboard>
SUPABASE_SERVICE_KEY=<service role key>
LINE_CHANNEL_ACCESS_TOKEN=<from LINE developers>
LINE_CHANNEL_SECRET=<from LINE developers>
```



---

## API URL Conventions

```
Base URL: /api/v1

GET    /api/v1/{resource}              ← list with pagination + filters
POST   /api/v1/{resource}              ← create
GET    /api/v1/{resource}/:id          ← get one
PUT    /api/v1/{resource}/:id          ← update (full)
PATCH  /api/v1/{resource}/:id          ← update (partial)
DELETE /api/v1/{resource}/:id          ← soft delete

Nested:
GET    /api/v1/patients/:id/photos
POST   /api/v1/patients/:id/photos
POST   /api/v1/opd/visits/:id/items
POST   /api/v1/courses/:id/use
```

Pagination query params: `?page=1&limit=20&search=xxx&sortBy=createdAt&sortOrder=DESC`

---

## Vial Tracking Pattern (Partial Use)

ยาบางชนิดเปิดแล้วใช้ไม่หมดในครั้งเดียว — ระบบต้อง track ml คงเหลือต่อ vial ต่อผู้ป่วย

### กฎสำคัญ

| กฎ | รายละเอียด |
|---|---|
| 1 vial = 1 ผู้ป่วยเท่านั้น | ห้ามแชร์ข้ามผู้ป่วย |
| Filler | เปิดแล้วใช้ทันที — เหลือทิ้ง (`disposed`) อัตโนมัติ |
| Botox / ยาอื่น | เปิดแล้วเก็บได้ — หมอกำหนด `expires_at` เอง |
| หมดอายุ | ระบบ auto-mark เป็น `expired` และแจ้งเตือน |

---

### Flow การใช้ยา

```
หมอสั่งใช้ Botox 2.5ml ใน OPD
    ↓
ระบบเช็คว่ามี active vial ของผู้ป่วยคนนี้ไหม?
    ├── มี (remaining ≥ 2.5ml) → ใช้ vial เดิม / หัก remaining
    ├── มี (remaining < 2.5ml) → แจ้งหมอว่าไม่พอ
    └── ไม่มี → เปิด vial ใหม่จาก stock
                    ↓
              หมอกำหนด expires_at
              ลด inventory_stock
              สร้าง patient_vial record
              สร้าง stock_movement (open_vial)
```

---

### products — field `can_partial_use`

```typescript
// ตั้งค่าตอน setup ยา
{
  name: 'Botox 100U',
  unit: 'ml',
  can_partial_use: true,   // เก็บได้
}
{
  name: 'Filler Juvederm Ultra',
  unit: 'ml',
  can_partial_use: false,  // เปิดแล้วทิ้ง
}
```

---

### Backend — patient_vials service

```typescript
// patient-vials.service.ts

async useFromVial(
  patientId: string,
  productId: string,
  usedMl: number,
  opdItemId: string,
  doctorId: string,
): Promise<PatientVial> {
  const product = await this.productRepo.findOneOrFail({ where: { id: productId } })

  // Filler → เปิดขวดใหม่และทิ้งทันที ไม่ต้อง reuse
  if (!product.canPartialUse) {
    return this.openAndDisposeVial(patientId, productId, usedMl, opdItemId, doctorId)
  }

  // ตรวจหา active vial ของผู้ป่วยคนนี้
  const activeVial = await this.vialRepo.findOne({
    where: {
      patientId,
      productId,
      status: 'active',
    },
    order: { openedAt: 'ASC' },  // ใช้อันที่เปิดก่อนก่อน (FIFO)
  })

  if (activeVial) {
    if (activeVial.remainingMl < usedMl) {
      throw new BadRequestException(
        `Vial คงเหลือ ${activeVial.remainingMl}ml ไม่พอ (ต้องการ ${usedMl}ml)`
      )
    }
    // หัก ml จาก vial เดิม
    activeVial.usedMl += usedMl
    activeVial.remainingMl -= usedMl

    if (activeVial.remainingMl === 0) {
      activeVial.status = 'disposed'
      activeVial.disposedAt = new Date()
      activeVial.disposeReason = 'used_up'
    }

    return this.vialRepo.save(activeVial)
  }

  // ไม่มี active vial → เปิดขวดใหม่
  return this.openNewVial(patientId, productId, usedMl, opdItemId, doctorId)
}

async openNewVial(
  patientId: string,
  productId: string,
  usedMl: number,
  opdItemId: string,
  doctorId: string,
): Promise<PatientVial> {
  const product = await this.productRepo.findOneOrFail({ where: { id: productId } })

  // ลด stock
  await this.stockService.deduct(productId, product.defaultVialSizeMl, 'open_vial', opdItemId)

  // สร้าง vial record
  const vial = this.vialRepo.create({
    patientId,
    productId,
    opdItemId,
    totalMl: product.defaultVialSizeMl,
    usedMl,
    remainingMl: product.defaultVialSizeMl - usedMl,
    status: 'active',
    openedAt: new Date(),
    // expires_at → หมอกำหนดภายหลัง (PATCH /vials/:id/set-expiry)
  })

  return this.vialRepo.save(vial)
}

// หมอกำหนดวันหมดอายุ
async setExpiry(vialId: string, expiresAt: Date, doctorId: string) {
  const vial = await this.vialRepo.findOneOrFail({ where: { id: vialId } })
  vial.expiresAt = expiresAt
  return this.vialRepo.save(vial)
}

// Dispose ก่อนกำหนด (เช่น Filler เหลือทิ้ง)
async disposeVial(vialId: string, reason: string, staffId: string) {
  const vial = await this.vialRepo.findOneOrFail({ where: { id: vialId } })
  vial.status = 'disposed'
  vial.disposedAt = new Date()
  vial.disposeReason = reason
  return this.vialRepo.save(vial)
}
```

---

### Scheduled Job — auto-expire vials

```typescript
// vial-expiry.scheduler.ts — รันทุกวัน 00:00
@Cron('0 0 * * *')
async checkExpiredVials() {
  const expired = await this.vialRepo.find({
    where: {
      status: 'active',
      expiresAt: LessThan(new Date()),
    },
  })

  for (const vial of expired) {
    vial.status = 'expired'
    await this.vialRepo.save(vial)
    // TODO: แจ้งเตือน staff ผ่าน notification
  }
}
```

---

### Frontend — แสดงใน OPD Visit

```tsx
// แสดง vial ที่ active ของผู้ป่วยคนนี้
<div className="bg-caramel-30 border border-caramel-60 rounded-lg p-3">
  <span className="text-xs font-medium text-espresso">Vial คงเหลือ</span>
  <div className="mt-2 flex flex-col gap-2">
    {activeVials.map(vial => (
      <div key={vial.id} className="flex items-center justify-between">
        <span className="text-sm">{vial.productName}</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-caramel-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-copper rounded-full"
              style={{ width: `${(vial.remainingMl / vial.totalMl) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-copper">
            {vial.remainingMl}/{vial.totalMl} ml
          </span>
          {vial.expiresAt && (
            <span className="text-xs text-gray-400">
              หมด {formatDate(vial.expiresAt)}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### Rules

- ✅ ตรวจ active vial ก่อนเสมอ ก่อนเปิดขวดใหม่
- ✅ `can_partial_use: false` → dispose อัตโนมัติทันทีที่ใช้
- ✅ หมอต้องกำหนด `expires_at` ทุกครั้งที่เปิด vial ใหม่
- ✅ FIFO — ใช้ vial ที่เปิดก่อนก่อนเสมอ
- ❌ ห้ามแชร์ vial ข้ามผู้ป่วย
- ❌ ห้ามใช้ vial ที่ `expired` หรือ `disposed`

---

## Backdated Entry Pattern


ระบบรองรับการกรอกข้อมูลย้อนหลัง (Backdate) — พนักงานขายคอร์สวันที่ 1 สิ้นเดือนค่อยมากรอกได้

### หลักการ

| Field | ความหมาย | ใครกำหนด |
|---|---|---|
| `sold_at` | วันที่ขาย/ทำรายการจริง | User เลือกได้ (ย้อนหลังได้ไม่จำกัด) |
| `created_at` | วันที่บันทึกเข้าระบบ | Auto timestamp — แก้ไม่ได้ |
| `created_by` | staff_id ที่กรอก | Auto จาก JWT |

> ⚠️ **ไม่จำกัดวันย้อนหลัง** — Admin ย้อนได้ไม่มีกำหนด แต่ต้องบันทึก audit log ทุกครั้ง

---

### Tables ที่รองรับ Backdate

```
patient_courses   → sold_at (วันที่ขายคอร์ส)
receipts          → paid_at (วันที่รับเงินจริง)
expenses          → paid_at (วันที่จ่ายจริง)
opd_visits        → started_at (วันที่รักษาจริง)
stock_movements   → moved_at (วันที่เคลื่อนไหวสต็อกจริง)
```

---

### Backend — DTO + Validation

```typescript
// common/decorators/backdate.decorator.ts
// ไม่จำกัด backdate — แค่ห้ามเป็นวันในอนาคต
export function IsBackdate() {
  return Transform(({ value }) => value ? new Date(value) : new Date())
}

// dto/create-patient-course.dto.ts
export class CreatePatientCourseDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  courseId: string;

  @IsInt() @Min(1)
  totalSessions: number;

  @IsOptional()
  @IsDateString()
  @MaxDate(new Date(), { message: 'sold_at ต้องไม่เป็นวันในอนาคต' })
  soldAt?: string;  // ถ้าไม่ส่งมา ใช้ now() แทน

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
```

```typescript
// patient-courses.service.ts
async create(dto: CreatePatientCourseDto, staffId: string) {
  const course = this.courseRepo.create({
    ...dto,
    soldAt: dto.soldAt ? new Date(dto.soldAt) : new Date(),  // backdate หรือ now
    createdBy: staffId,   // auto จาก JWT — user เปลี่ยนไม่ได้
    // created_at → TypeORM @CreateDateColumn() จัดการเอง
  })

  await this.courseRepo.save(course)

  // Audit log ทุกครั้ง — บันทึกทั้ง sold_at และ created_at
  await this.auditService.log({
    userId: staffId,
    action: 'CREATE',
    entity: 'patient_courses',
    entityId: course.id,
    newValue: { soldAt: course.soldAt, createdAt: course.createdAt },
  })

  return course
}
```

---

### Frontend — Form + DatePicker

```tsx
// แสดง 2 วันที่แยกกันชัดเจน
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>

    <FormDatePicker
      name="soldAt"
      label="วันที่ขายจริง"
      maxDate={new Date()}          // ห้ามเลือกอนาคต
      defaultValue={new Date()}     // default = วันนี้
      helperText="สามารถเลือกย้อนหลังได้"
    />

    {/* created_at ไม่แสดงใน form — auto timestamp */}

  </form>
</FormProvider>
```

**แสดงผลใน UI — ต้องแสดง 2 วันที่เสมอ:**

```tsx
// components/course-card.tsx
<div>
  <span className="text-xs text-gray-400">วันที่ขาย</span>
  <span className="text-sm font-medium">{formatDate(course.soldAt)}</span>
</div>
<div>
  <span className="text-xs text-gray-400">บันทึกเมื่อ</span>
  <span className="text-sm text-gray-500">{formatDate(course.createdAt)}</span>
  <span className="text-xs text-gray-400 ml-1">โดย {course.createdByName}</span>
</div>
```

---

### Audit Log — บันทึกทุก Backdate

ทุกครั้งที่ `sold_at !== created_at` (ต่างกันเกิน 1 ชั่วโมง) ให้ log เป็น backdate entry

```typescript
// audit-logs table จะเก็บ
{
  action: 'CREATE_BACKDATE',
  entity: 'patient_courses',
  metadata: {
    soldAt: '2025-03-01',      // วันที่จริง
    createdAt: '2025-03-31',   // วันที่กรอก
    daysDiff: 30,              // ย้อนหลังกี่วัน
    staffId: 'xxx',
    staffName: 'สมศรี แพทย์ดี'
  }
}
```

---



**ทุก list page ต้องมี pagination** — ใช้ page-based (หน้า 1, 2, 3...) เสมอ ห้ามโหลดข้อมูลทั้งหมดมาแสดง

### Backend — QueryDto + PaginatedResult

```typescript
// common/dto/pagination.dto.ts — ใช้ extends ใน QueryDto ทุก module
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

// common/dto/query-patient.dto.ts
export class QueryPatientDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
```

```typescript
// common/interfaces/paginated-result.interface.ts
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

```typescript
// common/helpers/paginate.helper.ts — ใช้ใน service ทุก module
export async function paginate<T>(
  repo: Repository<T>,
  query: SelectQueryBuilder<T>,
  { page = 1, limit = 20 }: PaginationDto,
): Promise<PaginatedResult<T>> {
  const total = await query.getCount()
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getMany()

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}
```

```typescript
// patients.service.ts
async findAll(dto: QueryPatientDto): Promise<PaginatedResult<Patient>> {
  const query = this.patientRepo.createQueryBuilder('patient')

  if (dto.search) {
    query.andWhere(
      '(patient.firstName ILIKE :s OR patient.lastName ILIKE :s OR patient.phone ILIKE :s)',
      { s: `%${dto.search}%` }
    )
  }
  if (dto.gender) {
    query.andWhere('patient.gender = :gender', { gender: dto.gender })
  }

  query.orderBy(`patient.${dto.sortBy}`, dto.sortOrder)

  return paginate(this.patientRepo, query, dto)
}
```

---

### Frontend — Hook + usePagination + Component

**usePagination UI hook — ใช้ร่วมกับทุก list page:**

```typescript
// hooks/use-pagination.ts
import { useState } from 'react'

interface UsePaginationOptions {
  defaultLimit?: number
}

export function usePagination({ defaultLimit = 20 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(1)
  const [limit] = useState(defaultLimit)

  const goToPage = (p: number) => setPage(p)
  const nextPage = () => setPage(p => p + 1)
  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const reset = () => setPage(1)

  return { page, limit, goToPage, nextPage, prevPage, reset }
}
```

**List page pattern — โยน object ตรงๆ ผ่าน Axios params:**

```typescript
// app/(dashboard)/patients/page.tsx
export default function PatientsPage() {
  const pagination = usePagination()
  const filter = usePatientFilter()

  // เมื่อ filter เปลี่ยน ต้อง reset page กลับ 1
  const handleFilterChange = (newFilter) => {
    filter.setSearch(newFilter.search)
    pagination.reset()   // ← สำคัญ
  }

  const { data, isLoading } = usePatients({
    page: pagination.page,
    limit: pagination.limit,
    search: filter.search,
    gender: filter.gender,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })

  return (
    <div>
      <PageHeader title="ผู้ป่วย" />
      <PatientFilter onFilterChange={handleFilterChange} />
      <PatientTable data={data?.data} isLoading={isLoading} />
      <Pagination
        page={pagination.page}
        totalPages={data?.meta.totalPages ?? 1}
        total={data?.meta.total ?? 0}
        onPageChange={pagination.goToPage}
      />
    </div>
  )
}
```

**Pagination Component:**

```tsx
// components/ui/pagination.tsx
interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    // แสดง window 5 หน้ารอบๆ current page
    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
    return start + i
  })

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-sm text-gray-600">
        ทั้งหมด <span className="font-bold text-gray-800">{total.toLocaleString()}</span> รายการ
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-md text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-100"
        >
          ก่อนหน้า
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              p === page
                ? 'bg-copper text-white border-copper'
                : 'border-gray-200 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-md text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-100"
        >
          ถัดไป
        </button>
      </div>
    </div>
  )
}
```

**Rules:**
- ✅ ทุก list hook รับ `params` เป็น object แล้วโยนผ่าน Axios `{ params }` ได้เลย
- ✅ `queryKey` ต้องใส่ `params` ทั้งก้อน — เปลี่ยน filter/page = refetch อัตโนมัติ
- ✅ เมื่อ filter เปลี่ยน ต้อง `pagination.reset()` กลับ page 1 เสมอ
- ✅ default limit = 20 ต่อหน้า
- ❌ ห้าม fetch ทั้งหมดแล้วมา slice เอง

---

---

## National ID Encryption Pattern

`national_id` เป็น sensitive data ตาม PDPA — ต้อง encrypt ก่อนเก็บ ห้าม store plain text

### Environment Variable (เพิ่มใน .env)

```env
# 32 bytes hex string (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=your-32-byte-hex-key-here
```

### Backend — Crypto Utility (`common/utils/crypto.util.ts`)

```typescript
// Fail-fast: throws at startup if ENCRYPTION_KEY missing/invalid
export function encrypt(plaintext: string): string   // → "<iv-hex>:<cipher-hex>"
export function decrypt(ciphertext: string): string  // → plain text
export function safeDecrypt(ciphertext: string | null): string | null  // never throws
export function maskNationalId(): string             // → "X-XXXX-XXXXX-XX-X"
```

Key format: 64-char hex string (32 bytes AES-256)
```bash
# Generate key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Entity

```typescript
// patients/entities/patient.entity.ts
// select: false → never included in standard queries
// Always access via findOneWithNationalId() for role-aware decryption
@Column({ name: 'national_id', nullable: true, type: 'varchar', select: false })
nationalId: string | null  // stored encrypted always
```

### Service — Role-aware decrypt

```typescript
// Response shape (not the entity itself)
interface NationalIdResult {
  nationalId: string   // decrypted | masked | ''
  masked:     boolean  // true = NURSE received X-XXXX-XXXXX-XX-X
  hasValue:   boolean  // false = field is empty or CASHIER
}

async findOneWithNationalId(id: string, requesterRole: Role): Promise<NationalIdResult> {
  const patient = await this.repo
    .createQueryBuilder('p')
    .addSelect('p.national_id')   // bypass select:false
    .where('p.id = :id', { id })
    .getOne()

  if (!patient.nationalId) return { nationalId: '', hasValue: false, masked: false }

  if (requesterRole === Role.ADMIN || requesterRole === Role.DOCTOR) {
    return { nationalId: safeDecrypt(patient.nationalId) ?? '', hasValue: true, masked: false }
  }
  // NURSE
  return { nationalId: maskNationalId(), hasValue: true, masked: true }
}

// create/update: encrypt before save
nationalId: dto.nationalId ? encrypt(dto.nationalId) : null
```

### Controller — Separate endpoint

```typescript
// GET /patients/:id/national-id
// Roles: ADMIN, DOCTOR, NURSE only (CASHIER → 403)
@Get(':id/national-id')
@Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
getNationalId(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: StaffProfileDto) {
  if (user.role === Role.CASHIER) throw new ForbiddenException()
  return this.patientsService.findOneWithNationalId(id, user.role)
}
```

### Permission Matrix — National ID

| Role | Endpoint | Result |
|---|---|---|
| ADMIN | `GET /patients/:id/national-id` | plain text (decrypted) |
| DOCTOR | `GET /patients/:id/national-id` | plain text (decrypted) |
| NURSE | `GET /patients/:id/national-id` | `X-XXXX-XXXXX-XX-X` (masked) |
| CASHIER | — | 403 Forbidden |

### Frontend — hook + display pattern

```typescript
// hooks/use-patients.ts
export function usePatientNationalId(patientId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['patients', patientId, 'national-id'],
    queryFn: () => api.get(`/patients/${patientId}/national-id`).then(r => r.data),
    enabled: enabled && !!patientId,
    staleTime: 0,  // sensitive data — always refetch
    gcTime: 0,     // don't keep in memory after unmount
  })
}
```

```tsx
// Component: fetch only when user clicks "show" button (enabled = revealed)
const [revealed, setRevealed] = useState(false)
const { data } = usePatientNationalId(patientId, revealed)

// ADMIN/DOCTOR: show toggle button, fetch on reveal
// NURSE: always show masked, no fetch needed
// CASHIER: render nothing
```

### DTO — plain text from FE, encrypt server-side

```typescript
// create-patient.dto.ts
@IsOptional()
@IsString()
@Matches(/^\d{13}$/, { message: 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก' })
nationalId?: string  // FE sends plain text → service encrypts before save
```

### Rules

- ✅ encrypt ก่อน save เสมอ — ห้าม store plain text ใน DB
- ✅ `select: false` บน entity column — ไม่ดึงมาใน query ทั่วไป
- ✅ ใช้ `addSelect()` เฉพาะ `findOneWithNationalId()` เท่านั้น
- ✅ Response เป็น `NationalIdResult` — ไม่ return entity โดยตรง
- ✅ Frontend fetch เฉพาะเมื่อ user กด show (`enabled = revealed`)
- ✅ `gcTime: 0` + `staleTime: 0` — ไม่ cache sensitive data
- ❌ ห้าม log national_id ใด ๆ (plain หรือ encrypted)
- ❌ ห้าม return nationalId ใน list endpoint — เฉพาะ `/national-id` endpoint เท่านั้น
- ❌ ห้าม CASHIER เข้าถึง endpoint นี้

---

## What NOT to do

- ❌ Do NOT use `any` type
- ❌ Do NOT add `branch_id` or `branches` table — single-branch system, never needed
- ❌ Do NOT hardcode Thai text in backend — keep API responses in English, translate on frontend
- ❌ Do NOT put business logic in controllers — always in services
- ❌ Do NOT expose Supabase service key to frontend
- ❌ Do NOT hard delete records — always soft delete with `deleted_at`
- ❌ Do NOT skip DTO validation — all inputs must go through class-validator
- ❌ Do NOT create migrations manually — use `typeorm migration:generate`
- ❌ Do NOT use bare `<input>` with `register` directly in pages — always go through `FormInput` or form components
- ❌ Do NOT use `tailwind.config.js` — use `@theme {}` in CSS instead

---

## packages/shared Convention

`packages/shared` คือ local package สำหรับ code ที่ **FE และ BE ใช้ร่วมกัน** เท่านั้น
ไม่ต้อง deploy แยก — pnpm workspace bundle รวมเข้าไปกับ FE และ BE ตอน build อัตโนมัติ

### โครงสร้าง

```
packages/shared/
├── src/
│   ├── types/              ← TypeScript interfaces ที่ใช้ทั้ง 2 ฝั่ง
│   │   ├── patient.types.ts
│   │   ├── appointment.types.ts
│   │   ├── opd.types.ts
│   │   ├── finance.types.ts
│   │   ├── course.types.ts
│   │   ├── inventory.types.ts
│   │   ├── member.types.ts
│   │   └── pagination.types.ts
│   ├── enums/              ← Enum ที่ใช้ทั้ง 2 ฝั่ง
│   │   ├── role.enum.ts
│   │   ├── gender.enum.ts
│   │   ├── status.enum.ts
│   │   └── payment.enum.ts
│   ├── constants/          ← ค่าคงที่ร่วมกัน
│   │   └── pagination.constants.ts
│   └── index.ts            ← export ทุกอย่างจากที่นี่
└── package.json
```

### package.json

```json
{
  "name": "@quibes/shared",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

### pnpm workspace

```yaml
# pnpm-workspace.yaml (root)
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// apps/web/package.json และ apps/api/package.json
{
  "dependencies": {
    "@quibes/shared": "workspace:*"
  }
}
```

### ตัวอย่าง types ที่ควรอยู่ใน shared

```typescript
// types/pagination.types.ts
export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// types/patient.types.ts
export interface Patient {
  id: string
  code: string
  firstName: string
  lastName: string
  gender: Gender
  dob?: string
  phone?: string
  allergy?: string
  medicalHistory?: string
  createdAt: string
}

// enums/role.enum.ts
export enum Role {
  ADMIN   = 'admin',
  DOCTOR  = 'doctor',
  NURSE   = 'nurse',
  CASHIER = 'cashier',
}

// enums/status.enum.ts
export enum AppointmentStatus {
  PENDING    = 'pending',
  CONFIRMED  = 'confirmed',
  IN_PROGRESS = 'in_progress',
  DONE       = 'done',
  CANCELLED  = 'cancelled',
}

export enum PaymentStatus {
  PENDING  = 'pending',
  PAID     = 'paid',
  PARTIAL  = 'partial',
  CANCELLED = 'cancelled',
}

export enum Gender {
  MALE   = 'male',
  FEMALE = 'female',
  OTHER  = 'other',
}

// constants/pagination.constants.ts
export const DEFAULT_PAGE_LIMIT = 20
export const MAX_PAGE_LIMIT = 100
```

### วิธี import (FE และ BE เหมือนกัน)

```typescript
import { Patient, PaginatedResult, Role, AppointmentStatus, Gender } from '@quibes/shared'
```

### กฎสำคัญ — อะไรควร/ไม่ควรอยู่ใน shared

| ✅ ควรอยู่ใน shared | ❌ ไม่ควรอยู่ใน shared |
|---|---|
| TypeScript interfaces | NestJS decorators (`@IsString()`) |
| Enums | React hooks, components |
| ค่าคงที่ทั่วไป | Business logic |
| `PaginatedResult<T>` | Database entities |
| Response shape types | DTOs ที่มี class-validator |

> ⚠️ **Pure TypeScript เท่านั้น** — ห้ามมี external dependency ใดๆ ใน shared
> ถ้าต้องการ dependency แสดงว่าวางผิดที่ ให้ย้ายไป FE หรือ BE แทน

### Deploy — ไม่ต้องทำอะไรเพิ่ม

```
Vercel build Next.js  → bundle @quibes/shared เข้า FE อัตโนมัติ
Railway build NestJS  → bundle @quibes/shared เข้า BE อัตโนมัติ
shared ไม่ต้อง deploy แยก ไม่ต้อง publish npm
```

---

## Error Handling Pattern

### Stack

| Layer | Tool |
|---|---|
| Toast notification | **shadcn/ui Toast** (`useToast`) |
| Form field error | React Hook Form `setError` + `FormInput` แสดงอัตโนมัติ |
| API error interceptor | Axios response interceptor (ใน `lib/api.ts`) |
| React crash boundary | Next.js `error.tsx` per route segment |

---

### Backend — NestJS Error Response Shape

NestJS ต้อง return error ในรูปแบบนี้เสมอ — FE จะ parse ได้ consistent

```typescript
// ทุก error ต้อง return shape นี้
{
  success: false,
  statusCode: 422,
  message: "Validation failed",        // human-readable summary
  errors: {                             // field-level (optional, 400/422 เท่านั้น)
    "firstName": "กรุณากรอกชื่อ",
    "phone": "เบอร์โทรไม่ถูกต้อง"
  }
}
```

```typescript
// common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any

    // NestJS class-validator ส่ง errors มาใน array
    const errors = Array.isArray(exceptionResponse.message)
      ? this.formatValidationErrors(exceptionResponse.message)
      : undefined

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errors
        ? 'Validation failed'
        : (exceptionResponse.message ?? exception.message),
      ...(errors && { errors }),
    })
  }

  private formatValidationErrors(messages: string[]): Record<string, string> {
    const errors: Record<string, string> = {}
    for (const msg of messages) {
      const [field, ...rest] = msg.split(' ')
      errors[field] = rest.join(' ')
    }
    return errors
  }
}
```

---

### Frontend — Axios Interceptor (เพิ่มใน lib/api.ts)

```typescript
// lib/api.ts — เพิ่มใน response interceptor (ต่อจาก 401 handler)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status
    const data = error.response?.data

    // 401 — handled แยก (auto refresh + redirect)
    if (status === 401) { /* ... existing logic ... */ }

    // 403 — ไม่มีสิทธิ์
    if (status === 403) {
      toast({ title: 'ไม่มีสิทธิ์', description: 'คุณไม่มีสิทธิ์ดำเนินการนี้', variant: 'destructive' })
    }

    // 404 — ไม่พบข้อมูล
    if (status === 404) {
      toast({ title: 'ไม่พบข้อมูล', description: data?.message ?? 'ไม่พบข้อมูลที่ต้องการ', variant: 'destructive' })
    }

    // 500+ — server error
    if (status >= 500) {
      toast({ title: 'เกิดข้อผิดพลาด', description: 'กรุณาลองใหม่อีกครั้ง', variant: 'destructive' })
    }

    // 400/422 — validation error → ไม่ toast ที่นี่ ให้ form จัดการ setError เอง
    // ส่ง error ต่อไปให้ useMutation onError จัดการ

    return Promise.reject(error)
  }
)
```

---

### Frontend — Mutation + Form Error Handler

```typescript
// lib/errors.ts — helper parse error จาก API
export function getApiErrors(error: unknown): Record<string, string> | null {
  const data = (error as any)?.response?.data
  if (data?.errors && typeof data.errors === 'object') return data.errors
  return null
}

export function getApiMessage(error: unknown): string {
  return (error as any)?.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
}
```

```typescript
// ใน form component — pattern มาตรฐาน
const { setError } = useFormContext()
const { toast } = useToast()

const mutation = useCreatePatient()

const onSubmit = async (data: FormValues) => {
  try {
    await mutation.mutateAsync(data)
    toast({ title: 'บันทึกสำเร็จ', description: 'เพิ่มผู้ป่วยเรียบร้อยแล้ว' })
    onClose?.()
  } catch (error) {
    const fieldErrors = getApiErrors(error)

    if (fieldErrors) {
      // 400/422 — map field errors ลงใต้ input โดยตรง
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as keyof FormValues, { message })
      })
      toast({
        title: 'กรุณาตรวจสอบข้อมูล',
        description: 'มีข้อมูลบางส่วนไม่ถูกต้อง',
        variant: 'destructive',
      })
    } else {
      // error อื่นๆ — toast อย่างเดียว
      toast({ title: 'เกิดข้อผิดพลาด', description: getApiMessage(error), variant: 'destructive' })
    }
  }
}
```

---

### Frontend — shadcn/ui Toast Setup

```typescript
// app/layout.tsx — ต้องวาง Toaster ไว้ที่ root
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
        <Toaster />   {/* ← ต้องมีทุก layout */}
      </body>
    </html>
  )
}
```

```typescript
// ใช้ toast ใน component — import จาก shadcn
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

// Success
toast({ title: 'บันทึกสำเร็จ' })

// Error
toast({ title: 'เกิดข้อผิดพลาด', description: 'ข้อความ', variant: 'destructive' })

// Warning
toast({ title: 'คำเตือน', description: 'ข้อความ', variant: 'warning' })
```

---

### Frontend — Error Boundary (Next.js)

```typescript
// app/(dashboard)/patients/error.tsx — per route segment
'use client'

export default function PatientError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-gray-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      <button onClick={reset} className="btn btn-primary">ลองใหม่</button>
    </div>
  )
}

// app/global-error.tsx — catch ทุกอย่างที่ error.tsx พลาด
'use client'
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html><body>
      <div>เกิดข้อผิดพลาดร้ายแรง <button onClick={reset}>ลองใหม่</button></div>
    </body></html>
  )
}
```

---

### Summary — Error ไหน จัดการที่ไหน

| Status | จัดการที่ | แสดงผล |
|---|---|---|
| 400/422 Validation | `onSubmit` → `setError` | Field error ใต้ input + toast warning |
| 401 Unauthorized | Axios interceptor | Auto refresh → redirect /login |
| 403 Forbidden | Axios interceptor | Toast destructive |
| 404 Not Found | Axios interceptor | Toast destructive |
| 500+ Server | Axios interceptor | Toast destructive |
| React crash | `error.tsx` | Fallback UI + reset button |

---

## Agent Skills + Memory

### claude-mem — Session Memory (ประหยัด token ข้ามวัน)

claude-mem ใช้ AI observer คอย capture ทุก decision, bug fix, architectural choice ระหว่าง session แล้ว inject กลับมาใน session ใหม่อัตโนมัติ — โหลดแค่ index (~40 tokens/observation) แล้ว fetch full detail เฉพาะเมื่อต้องการ

**ติดตั้งครั้งเดียวต่อ project:**

```bash
/plugin marketplace add thedotmack/claude-mem && /plugin install claude-mem
```

**ทำไมต้องใช้กับ QUIBES:**

| ไม่มี claude-mem | มี claude-mem |
|---|---|
| Session ใหม่ → อธิบาย context ซ้ำทุกครั้ง | Session ใหม่ → รู้ทันทีว่าทำถึงไหน |
| เสีย token อธิบาย sprint progress | ประหยัด token — แค่ index เบาๆ |
| ลืม decision เก่าว่าทำไมถึงเลือก pattern นั้น | Query ได้ เช่น `decisions about "token refresh"` |

**Query pattern ที่ใช้บ่อย:**
```
decisions for src/modules/auth/       ← ดู decision ของ auth module
bugfix file:src/hooks/use-patients.ts ← bug ที่แก้ไปแล้ว
feature type:feature                  ← features ที่ implement แล้ว
```

> ⚠️ ใช้ได้กับ **Claude Code เท่านั้น** — ไม่ใช่ claude.ai
> CLAUDE.md จัดการ project convention, claude-mem จัดการ session memory — ใช้ร่วมกัน

---

### Agent Skills — Code Quality

ติดตั้ง skills เพิ่มเติมแยกต่างหาก — ไม่ได้รวมอยู่ใน CLAUDE.md เพื่อไม่ให้ context ใหญ่เกิน
AI จะอ่าน SKILL.md ที่ติดตั้งไว้โดยอัตโนมัติเมื่อเกี่ยวข้องกับงานนั้น

### ติดตั้งทั้งหมดสำหรับโปรเจกต์นี้

```bash
# Frontend — Next.js
npx skills add https://github.com/vercel-labs/next-skills --skill next-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add wshobson/agents --skill tailwind-design-system

# Backend — NestJS
npx skills add Kadajett/agent-nestjs-skills --skill nestjs-best-practices
```

### Skills ที่ติดตั้งและ scope การใช้งาน

| Skill | ใช้เมื่อ | Rules |
|---|---|---|
| `next-best-practices` | เขียน/รีวิว Next.js pages, RSC, routing, data fetching | 18 categories |
| `vercel-react-best-practices` | optimize React components, bundle, re-render | 57 rules |
| `tailwind-design-system` | เขียน Tailwind v4, design tokens, dark mode | v4 specific |
| `nestjs-best-practices` | เขียน NestJS module, controller, service, guard | 26 rules |

### Key rules ที่ต้องจำสำหรับโปรเจกต์นี้

**Next.js (next-best-practices)**
- RSC by default — ใช้ `'use client'` เฉพาะเมื่อต้องการ interactivity
- async `params` และ `searchParams` ใน Next.js 15+ ต้อง await
- ใช้ `next/image` เสมอ — ห้ามใช้ `<img>` ตรงๆ
- `useSearchParams` ต้องครอบด้วย `<Suspense>`

**React (vercel-react-best-practices)**
- `async-parallel` — ใช้ `Promise.all()` สำหรับ independent fetches
- `bundle-barrel-imports` — import ตรง ห้ามใช้ `index.ts` barrel
- `bundle-dynamic-imports` — `next/dynamic` สำหรับ heavy components
- `rerender-memo` — memoize เฉพาะ component ที่ expensive จริงๆ

**Tailwind v4 (tailwind-design-system)**
- ห้ามใช้ `tailwind.config.ts` — ใช้ `@theme {}` ใน CSS เท่านั้น
- ห้ามใช้ `@tailwind` directives — ใช้ `@import "tailwindcss"`
- ห้าม hardcode colors — ใช้ semantic tokens ที่ define ใน `@theme`
- ห้ามใช้ arbitrary values `[...]` — extend `@theme` แทน
- React 19: ห้ามใช้ `forwardRef` — pass `ref` เป็น prop ตรงๆ ได้เลย

**NestJS (nestjs-best-practices)**
- Business logic อยู่ใน Service เท่านั้น — Controller แค่ route
- ใช้ class-validator + class-transformer ทุก DTO
- ใช้ TypeORM Repository pattern — ไม่ใช้ raw query ยกเว้นจำเป็น
- Guard สำหรับ auth, Interceptor สำหรับ transform response

---

## Common Commands

```bash
# Backend
cd apps/api
pnpm dev                          # Start dev server
pnpm migration:generate -- -n NameHere   # Generate migration
pnpm migration:run                # Run pending migrations
pnpm test                         # Unit tests

# Frontend
cd apps/web
pnpm dev                          # Start dev server
pnpm build                        # Production build

# Root
pnpm install                      # Install all dependencies
```

---

## AI Assistant Instructions

When generating code for this project:

1. **Always check this file first** for conventions before writing anything
2. **Generate complete modules** — entity + DTO + service + controller + module registration
3. **Follow the exact file structure** defined above
4. **Use the permission matrix** when adding `@Roles()` decorators
5. **Wrap all API responses** in the standard response shape
6. **Add Swagger decorators** (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) on every endpoint
7. **Write TypeScript strictly** — no implicit `any`, always type return values
8. **For frontend pages** — always pair with a custom hook in `/hooks/`
9. **For forms** — always use `FormProvider` + custom form components (`FormInput`, `FormSelect`, etc.) Never use bare `<input>` or `register` directly in page/form components
10. **For native inputs** — use `register` inside `FormInput` component only
11. **For custom/shadcn components** — use `Controller` inside form components only
12. **When in doubt** — ask before generating, don't assume

---

*Last updated: March 2026*
