# MLS BOLIVIA — AI DEVELOPMENT CONTEXT
> Read this entire document before writing any code.
> This is the single source of truth for what we are building and why.

---

## 1. WHAT WE ARE BUILDING

A **B2B SaaS marketplace** that connects real estate developers (constructoras) with independent brokers (corredores) in Bolivia, starting with La Paz.

The closest reference is **Cliperty** (cliperty.com) from Chile — but tropicalized for the Bolivian market with key differences explained below.

**The core problem we solve:**
Real estate developers in Bolivia manage their off-plan project inventory via Excel + WhatsApp groups. When multiple brokers try to sell the same unit simultaneously, double bookings happen constantly — two brokers promise the same apartment to two different clients. This destroys trust between developers and brokers and costs the industry USD 30K-120K/year in La Paz alone.

**Our solution:**
A real-time stock management platform where:
- Developers upload their project inventory once
- Brokers see live availability and generate professional quote PDFs
- When a broker has a serious client, they declare a "reservation intent" that soft-locks the unit
- The developer approves or rejects — eliminating double bookings permanently

---

## 2. BUSINESS MODEL

### Revenue
- **Developers pay:** Bs 1,000/month per active project (main revenue source)
- **Brokers pay (optional):** Bs 120/month for PRO plan, Bs 500/month for agency plan
- **Free 3-month trial** for the first developer pilots to reduce onboarding friction

### Why developers pay (not just brokers)
Bolivia has ~2,500 informal/unlicensed brokers. Charging brokers a fixed monthly fee creates too much friction for adoption. Developers are established companies that already pay for services (accountants, architects, marketing) — Bs 1,000/month is justified by the operational cost savings from eliminating double bookings and WhatsApp chaos.

### Go-to-market sequence
1. Onboard 3-5 developers for free (3-month pilot) → get real stock on the platform
2. With real stock available, recruit brokers (they join free initially)
3. Month 4: activate developer billing
4. Month 7+: introduce broker PRO plan for brokers who want to declare intents

---

## 3. THE TWO SIDES OF THE MARKETPLACE

### Side A — Developer (Constructora)
A real estate company that builds and sells off-plan projects in Bolivia.

**Their pain points today:**
- Managing broker access via WhatsApp groups
- Double bookings when two brokers promise the same unit
- No visibility into which broker is working with which client
- No professional quoting tool for their external sales force
- Stock updates are manual and always out of date

**What they get on the platform:**
- Real-time inventory management
- System of record for all reservation intents
- Dashboard showing broker activity per project
- Automated notifications when a broker declares intent
- Commission tracking (not payment processing — that stays offline)

**User roles inside a developer account:**
- `DEVELOPER_ADMIN`: full control — manages projects, approves/rejects intents
- `DEVELOPER_SALES`: read-only — sees stock and intents, cannot modify anything

### Side B — Broker (Corredor)
An independent sales agent or small agency that sells real estate on commission.

**Context about Bolivian brokers:**
- ~2,500 active in Bolivia, majority informal (no license required)
- Average income: ~Bs 4,000/month
- Most work across multiple developers simultaneously
- Currently manage everything via phone calls and WhatsApp
- High turnover — many try the profession and quit within months
- Commission is paid by the developer (not the buyer), typically 2-3% of sale price

**What they get on the platform:**
- FREE plan: browse all public projects, generate quote PDFs (unlimited)
- PRO plan (Bs 120/month): everything in FREE + declare reservation intents + waitlist + CRM

**Key insight:** A broker earning a USD 1,000 commission on a single sale pays back 3.8 years of the PRO subscription. The ROI argument is very easy to make once they close one deal through the platform.

---

## 4. THE CORE TRANSACTION FLOW

This is the heart of the product. Understand this flow before touching any code.

```
BROKER BROWSES CATALOG
        ↓
BROKER GENERATES QUOTE (FREE or PRO)
  - Selects unit(s)
  - Enters client info (name, phone, CI/DNI)
  - System generates branded PDF with developer logo + current prices
  - Does NOT block the unit
  - createdAt timestamp = legal evidence for commission disputes
        ↓
BROKER DECLARES RESERVATION INTENT (PRO only)
  - Client is serious — broker commits
  - Unit(s) status → WITH_INTEREST
  - All other brokers watching this unit are notified
  - Developer receives alert with broker profile + client info
  - Countdown timer starts (24h-168h, developer configures per project)
        ↓
DEVELOPER REVIEWS INTENT
  - Sees: broker reputation, client financing status, visited project?
  - Gets reminder at 50% and 75% of deadline if not responded
  - Options: APPROVE or REJECT (with mandatory reason)
        ↓
    APPROVED → unit status RESERVED
               commission record created
               waitlist notified ("unit taken")
               
    REJECTED → unit freed, next in waitlist activated
               broker notified with rejection reason
```

### Bundle rule (critical)
A broker can reserve multiple units together (e.g., Apartment 301 + Parking E-04 + Storage D-02).
A bundle is **atomic** — approved or rejected as a whole. Never partially approved.
If the intent is cancelled/rejected, ALL units in the bundle are freed simultaneously.

---

## 5. DOMAIN ENTITIES (TypeScript interfaces — source of truth)

```typescript
// ── ENUMS ──────────────────────────────────────────────────

enum UserRole {
  SUPER_ADMIN, DEVELOPER_ADMIN, DEVELOPER_SALES, BROKER
}

enum BrokerPlan { FREE, PRO }

enum ProjectStatus { DRAFT, PUBLISHED, PAUSED, CLOSED }
enum ProjectVisibility { PUBLIC, PRIVATE }

enum UnitStatus {
  AVAILABLE, WITH_INTEREST, RESERVED, SOLD, SUSPENDED, UNAVAILABLE
}
// SOLD and UNAVAILABLE are TERMINAL — no transitions allowed from these

enum IntentStatus {
  ACTIVE, APPROVED, REJECTED, CANCELLED, EXPIRED,
  SUSPENDED_BY_PROJECT, SUSPENDED_BY_UNIT
}

enum RejectionReason {
  CLIENT_NOT_QUALIFIED, INCOMPLETE_DATA,
  BROKER_NOT_ENABLED, TAKEN_INTERNALLY, OTHER
}

// ── UNIT ATTRIBUTES (discriminated union stored as JSON) ───

// APARTMENT, OFFICE, COMMERCIAL share the same structure
// because commercially they work the same way.
// PARKING and STORAGE have genuinely different attributes.

type UnitAttributes =
  | HabitableUnitAttributes   // APARTMENT | OFFICE | COMMERCIAL
  | ParkingAttributes
  | StorageAttributes

interface HabitableUnitAttributes {
  type: 'APARTMENT' | 'OFFICE' | 'COMMERCIAL'
  floor: number
  sqm: number
  sqmUsable: number | null
  bedrooms: number | null
  bathrooms: number | null
  halfBathrooms: number | null
  orientation: 'NORTH'|'SOUTH'|'EAST'|'WEST'|'NORTHEAST'|'NORTHWEST'|'SOUTHEAST'|'SOUTHWEST' | null
  hasBalcony: boolean
  hasLaundryRoom: boolean
  hasServantRoom: boolean   // "cuarto de empleada" — relevant selling point in Bolivia
  floorPlanUrl: string | null
  renderUrl: string | null
}

interface ParkingAttributes {
  type: 'PARKING'
  level: string      // "S1", "S2", "PB"
  spotNumber: string // "04", "E-12"
  isCovered: boolean
  sqm: number | null
}

interface StorageAttributes {
  type: 'STORAGE'
  level: string | null
  sqm: number | null
}

// ── CORE ENTITIES ──────────────────────────────────────────

interface Developer {
  id: string
  name: string          // commercial name e.g. "Pacífico S.A."
  legalName: string
  taxId: string         // NIT Bolivia
  logoUrl: string | null
  phone: string
  email: string
  createdAt: Date
}

interface User {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: UserRole
  developerId: string | null   // set for DEVELOPER_* roles
  brokerId: string | null      // set for BROKER role
  createdAt: Date
  lastLoginAt: Date | null
}

interface Broker {
  id: string
  userId: string
  plan: BrokerPlan
  agencyName: string | null
  photoUrl: string | null
  cancellationsLast30Days: number  // reputation signal — visible to developers
  createdAt: Date
  suspendedAt: Date | null
}

interface Project {
  id: string
  developerId: string
  name: string
  description: string | null
  address: string
  neighborhood: string   // e.g. "Calacoto", "Sopocachi" — important for price context
  city: string
  status: ProjectStatus
  visibility: ProjectVisibility
  deliveryDate: Date | null
  totalFloors: number | null
  totalUnits: number
  amenities: ProjectAmenity[]   // BUILDING-LEVEL features: pool, gym, rooftop, etc.
  coverImageUrl: string | null
  imageUrls: string[]
  brochureUrl: string | null
  defaultCommissionPct: number  // e.g. 2.5 = 2.5% — units can override this
  intentDeadlineHours: number   // 24-168 working hours — developer configures
  createdAt: Date
  publishedAt: Date | null
  closedAt: Date | null
}

// Amenities are predefined — no free text to avoid dirty data
enum ProjectAmenity {
  POOL, GYM, ROOFTOP, PLAYGROUND, BBQ_AREA, COWORKING,
  LOBBY, SECURITY_24H, PARKING_VISITORS, PET_FRIENDLY, SMART_HOME
}

interface Unit {
  id: string
  projectId: string
  identifier: string         // "Apto 301", "Oficina 5B", "E-04", "D-02"
  type: 'APARTMENT'|'OFFICE'|'COMMERCIAL'|'PARKING'|'STORAGE'
  status: UnitStatus
  priceUSD: number
  commissionPctOverride: number | null  // null = use project default
  attributes: UnitAttributes            // discriminated union (JSON column)
  imageUrls: string[]
  internalNotes: string | null          // NEVER shown to brokers
  createdAt: Date
  updatedAt: Date
}

interface UnitPriceHistory {
  id: string
  unitId: string
  previousPriceUSD: number
  newPriceUSD: number
  changedByUserId: string
  reason: string
  createdAt: Date   // immutable — evidence for disputes
}

interface Quote {
  id: string
  brokerId: string
  clientFullName: string
  clientNationalId: string   // CI/DNI — key for detecting duplicate clients
  clientPhone: string
  clientEmail: string | null
  unitIds: string[]
  priceSnapshotUSD: number        // immutable snapshot at generation time
  commissionSnapshotPct: number
  estimatedCommissionUSD: number
  pdfUrl: string | null
  brokerNotes: string | null
  expiresAt: Date
  createdAt: Date   // legal timestamp for commission disputes
}

interface ReservationIntent {
  id: string
  brokerId: string           // must be BrokerPlan.PRO
  projectId: string
  unitIds: string[]          // > 1 = bundle (atomic)
  status: IntentStatus
  clientFullName: string
  clientNationalId: string
  clientPhone: string
  clientEmail: string | null
  clientHasFinancing: boolean
  clientVisitedProject: boolean
  expiresAt: Date
  remainingHoursWhenSuspended: number | null
  remindersSent: number      // 0, 1, or 2
  rejectedByUserId: string | null
  rejectionReason: RejectionReason | null
  rejectionNote: string | null
  rejectedAt: Date | null
  approvedByUserId: string | null
  approvedAt: Date | null
  createdAt: Date   // legal timestamp for commission disputes
}

interface WaitlistEntry {
  id: string
  unitId: string
  brokerId: string
  position: number           // FIFO — assigned at creation, never changes
  isNotified: boolean
  notifiedAt: Date | null
  actDeadlineAt: Date | null // 2h window to declare intent after notification
  isDiscarded: boolean
  discardedAt: Date | null
  discardReason: string | null
  createdAt: Date
}

interface PrivateProjectAccess {
  id: string
  projectId: string
  brokerId: string
  isAccepted: boolean
  isRevoked: boolean
  invitedAt: Date
  respondedAt: Date | null
  revokedAt: Date | null
  revokedByUserId: string | null
  // RULE: cannot revoke if broker has ACTIVE or APPROVED intents in this project
}

interface CommissionRecord {
  id: string
  intentId: string
  brokerId: string
  developerId: string
  lineItems: CommissionLineItem[]
  totalUSD: number
  status: 'PENDING' | 'PAID' | 'IN_DISPUTE'
  paidAt: Date | null
  paidMarkedByUserId: string | null
  createdAt: Date
}

interface CommissionLineItem {
  unitId: string
  unitIdentifier: string   // denormalized for display
  salePriceUSD: number
  commissionPct: number
  commissionAmountUSD: number
}

interface Subscription {
  id: string
  plan: 'DEVELOPER_PROJECT' | 'BROKER_PRO' | 'BROKER_AGENCY'
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'
  developerId: string | null
  brokerId: string | null
  projectId: string | null    // for DEVELOPER_PROJECT plan
  agencySeats: number | null  // for BROKER_AGENCY plan
  priceBOB: number            // bolivianos — avoids USD conversion issues
  periodStart: Date
  periodEnd: Date
  trialEndsAt: Date | null
  cancelledAt: Date | null
  createdAt: Date
}
```

---

## 6. CRITICAL BUSINESS RULES

These are non-negotiable. Enforce at the service layer, not just at the API layer.

### Unit state invariants
- A unit in `AVAILABLE` status has **zero** active intents
- A unit in `WITH_INTEREST` status has **exactly one** active intent — never two
- A unit in `RESERVED` status has **exactly one** approved intent
- `SOLD` and `UNAVAILABLE` are **terminal states** — no transitions allowed
- Bundle atomicity: when a bundle intent is approved/rejected/cancelled, **all units in it transition simultaneously**

### Intent creation (race condition prevention)
- Use `SELECT FOR UPDATE` (pessimistic lock) on all units in the intent before creating it
- All units must be `AVAILABLE` at the exact same instant inside a DB transaction
- If any unit is not `AVAILABLE`, return a clear error: "Unit [X] just received an interested party. You can join the waitlist."

### Deadline calculation
- Deadlines use **working hours only** (not calendar hours)
- Default working days: Monday–Friday
- Bolivian national holidays must be pre-loaded and excluded from working hour counts
- When a project is PAUSED or a unit is SUSPENDED: freeze the countdown (save `remainingHoursWhenSuspended`)
- When resumed: recalculate `expiresAt = now + remainingHoursWhenSuspended` (in working hours)

### Reminder system
- At 50% of deadline elapsed: send reminder to developer (set `remindersSent = 1`)
- At 75% of deadline elapsed: send urgent reminder (set `remindersSent = 2`)
- If developer never responds: intent expires automatically, units freed, developer notified of inaction

### Price changes with active intent
- Price change does NOT auto-cancel the active intent
- Broker is immediately notified of the exact delta ("Price changed from USD X to USD Y")
- Broker can choose to continue or cancel manually

### Commission attribution rule
- The first broker to reach `IntentStatus.APPROVED` has the commission right recorded in the system
- `Quote.createdAt` and `ReservationIntent.createdAt` are the evidence timestamps — immutable

### Waitlist behavior
- Only PRO brokers can join a waitlist
- Queue is strictly FIFO by `createdAt`
- When the head of queue is notified, they have **2 hours** to declare an intent
- If they don't act within 2 hours: their entry is discarded, next in line is notified
- When a unit goes from `WITH_INTEREST` back to `AVAILABLE` (intent cancelled/expired):
  - If waitlist has entries: notify head of queue immediately
  - If waitlist is empty: notify all brokers who generated a quote for this unit in the last 7 days

### Private project access revocation
- Developer CANNOT revoke a broker's access if the broker has any intent in status `ACTIVE`, `APPROVED`, `SUSPENDED_BY_PROJECT`, or `SUSPENDED_BY_UNIT` within that project
- System must block the revocation and show which intents are blocking it

---

## 7. WHAT ALREADY EXISTS (BASE PROJECT)

The existing codebase is a **property registration system for real estate agents** — a simpler product where agents listed properties for sale/rent.

### What can likely be reused
- Auth system (JWT, roles, guards)
- User entity and authentication flow
- File upload infrastructure (images, PDFs)
- Basic project/property CRUD structure
- Database connection and ORM setup (likely Drizzle or Prisma with PostgreSQL)
- NestJS module structure and conventions

### What needs to be rebuilt or extended
- The core transaction flow (Quote → Intent → Approval) is entirely new
- Unit status state machine is new — the old system likely had no real-time availability
- Waitlist system is new
- Developer/Broker role separation is new (old system probably had one type of user)
- Bundle handling (multi-unit atomic operations) is new
- Working-hours deadline calculation is new
- Background jobs (intent expiration, reminders, waitlist activation) are new

### Key question to ask before starting
Before touching anything, inspect the existing codebase and understand:
1. What ORM is being used? (Drizzle / Prisma / TypeORM)
2. What is the existing User/Auth structure?
3. What does the existing "property" entity look like — can it map to our `Unit`?
4. What background job infrastructure exists, if any?

---

## 8. TECH STACK

- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM (preferred) or whatever the base project uses
- **Background jobs:** To be decided based on existing infrastructure (BullMQ recommended)
- **File storage:** AWS S3 or Google Cloud Storage (for images, PDFs, brochures)
- **PDF generation:** PDFMonkey or similar (for quote PDFs)
- **Notifications:** WhatsApp via Meta Cloud API + email fallback
- **Payments:** PayPhone Bolivia (not Stripe — Stripe is not widely supported in Bolivia)
- **Deployment:** Railway or Render for MVP (low ops overhead)

---

## 9. BACKGROUND JOBS REQUIRED

These run independently of user actions. Implement with BullMQ or pg-boss.

| Job | Frequency | What it does |
|-----|-----------|--------------|
| `ExpireIntents` | Every 5 min | Find ACTIVE intents where `expiresAt <= now` → transition to EXPIRED, release units, activate waitlist |
| `SendDeadlineReminders` | Every 30 min | Find intents at 50%/75% of deadline with `remindersSent < 2` → notify developer |
| `ExpireWaitlistNotifications` | Every 5 min | Find NOTIFIED waitlist entries where `actDeadlineAt <= now` → discard, notify next in line |
| `ExpireQuotes` | Daily | Find ACTIVE quotes where `expiresAt <= now` → mark as EXPIRED |

---

## 10. BOLIVIAN MARKET SPECIFICS

Things that make this market different from Chile or other reference markets:

1. **Informal brokers:** Most brokers have no license or formal registration. Don't require a license number to sign up — just email + phone + CI.

2. **Currency:** All property prices are in USD (standard in Bolivia). Subscriptions are billed in Bolivianos (BOB). Store both. Current rate context: Bs ~6.96/USD official, but there's a parallel market. Always store `priceBOB` for subscriptions.

3. **Payment methods:** PayPhone QR and bank transfers are the standard. No credit card culture for B2B payments. Plan for manual payment confirmation in the MVP.

4. **Anticretico:** A uniquely Bolivian property tenure where a lump sum is paid upfront and returned at contract end (no monthly rent). Out of scope for MVP but worth keeping in mind for future expansion.

5. **WhatsApp first:** Every notification should have a WhatsApp version. Email is secondary. Bolivian professionals live on WhatsApp.

6. **Market size La Paz:** Estimated 35-60 active off-plan projects, 300-600 active brokers, 20-40 developer companies. This is a small market — personal relationships matter more than SEO.

---

## 11. WHAT WE ARE NOT BUILDING (MVP SCOPE)

Explicitly out of scope for the first version:

- Payment processing (commissions are tracked but paid offline)
- E-signature or digital contracts
- Post-sale management (handover, snagging)
- Client-facing portal (end buyers don't have accounts)
- Property valuation tools
- Mortgage/financing calculators
- Secondary market (resale of already-built properties)
- Multi-city rollout (La Paz first, then Santa Cruz, then Cochabamba)
- Mobile app (responsive web only for MVP)

---

## 12. GLOSSARY

| Term | Meaning |
|------|---------|
| Constructora / Developer | The real estate company that builds and sells the project |
| Corredor / Broker | The independent sales agent who earns commission |
| Proyecto / Project | The real estate development (e.g., "Edificio Vitrubio") |
| Unidad / Unit | The individual asset being sold (apartment, parking, storage) |
| Intención de Reserva / Reservation Intent | The formal declaration by a broker that their client wants a unit |
| Double booking | Two brokers promising the same unit to two different clients — the core problem |
| Off-plan | Property sold before or during construction (not a finished, existing building) |
| Anticretico | Bolivia-specific tenure: lump sum paid upfront, returned at end of contract |
| Bundle | A reservation intent that covers multiple units simultaneously (e.g., apt + parking) |
| NIT | Número de Identificación Tributaria — Bolivian tax ID for companies |
| CI | Cédula de Identidad — Bolivian national ID for individuals |
