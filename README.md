# Kalender

A modern scheduling and calendar application built with **Next.js 15**. This project facilitates event management, meeting scheduling, and public booking pages.

> **Note**: This is a learning project. There is no license associated with this repository.

## Portfolio Demo Status

Kalender's portfolio-demo feature and UI phases are implemented. The temporary
Theme Lab prototype routes have been removed from the deployment candidate.

The original app is already live at [kalender-tau.vercel.app](https://kalender-tau.vercel.app/).
The `ui-overhaul` audit fixes are in the working tree. On September 17, the
lockfile was repaired, clean installation passed, the dependency audit reported
zero known vulnerabilities, and `npm run check` passed all stages (26 tests).
Before a Vercel preview, resolve public demo credentials versus real-booking
access and finish configuration and deployment approval. Read the
[audit report](docs/ui-overhaul/pre-deployment-audit.md) and
[handoff](docs/ui-overhaul/README.md#current-handoff-state) before continuing.
The reservation migration has been applied to the development Neon database,
selected for the preview. Earlier configuration inspection found the existing
production deployment already shares this database; a separate preview URL
does not isolate data. Migration presence was independently verified on
September 17; live booking and browser QA are still pending.

Public demo credentials remain unpublished pending that decision. Sharing an
allowlisted login shares real Calendar invitation capability. The recommendation
is separate, disposable, non-allowlisted exploration accounts and private booking
testers; this has not yet been adopted. Exploration accounts can still edit their
own workspace, so they must not be the connected Calendar host. See the
[verified access review](docs/ui-overhaul/pre-deployment-audit.md#public-credentials-versus-real-booking-code-review-september-17).

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TurboPack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs`)
- **Database**: [Neon](https://neon.tech/) (Serverless Postgres)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (primitives), [Sonner](https://sonner.emilkowal.ski/) (toasts)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Date Handling**: `date-fns`, `react-day-picker`
- **Integrations**: Google Calendar (`googleapis`)

## ✨ Features

- **Authentication**: Secure login and registration using Clerk.
- **Event Management**: Create and manage event types (e.g., duration, active status).
- **Public Booking**: Shareable booking pages for others to schedule meetings.
- **Dashboard**: Private area for managing events and viewing schedules.
- **Availability Scheduling**: Configure availability windows (implied by schema).
- **Product surfaces**: Midnight public pages and Daylight private workspace.

## 📂 Project Structure

- **`app/(main)/(public)`**: Public-facing routes (e.g., Landing page, Booking pages).
- **`app/(main)/(private)`**: Authenticated application routes (Dashboard, Events, Schedule).
- **`app/(auth)`**: Authentication routes (Login, Register).
- **`drizzle/schema.ts`**: Profiles, events, schedules, booking history, and reservations.
- **`components`**: Reusable UI components.
- **`lib`**: Utility functions and shared logic.

## 🛠️ Getting Started

### Prerequisites

- Node.js 22.12+ (Node 22; see `.nvmrc`)
- npm or yarn or pnpm
- A Neon database instance
- A Clerk account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd kalender
   ```

2. **Install dependencies**

   The lockfile was synchronized and a clean install verified on September 17
   with Node 22.21.1 and npm 10.9.4.

   ```bash
   npm ci
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env.local` and configure the intended database and matching Clerk keys. The current preview
   plan reuses development Clerk and the shared Neon database; scope those keys
   to the preview because existing production uses a different Clerk instance. Live bookings default to disabled; approved-tester access is configured separately. Required service credentials:

   ```env
   DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Database Migration**
   Apply committed migrations to the intended database (the CLI loads `.env.local`):

   ```bash
   npm run db:migrate
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Starts the development server with TurboPack.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs non-interactive ESLint with zero warnings allowed.
- `npm test`: Runs critical-flow tests against disposable PostgreSQL and mocked APIs.
- `npm run typecheck`: Checks TypeScript.
- `npm run check`: Runs lint, tests, typecheck, build, and compiled-boundary checks.
- `npm run start`: Starts the production server.
- `npm run db:generate`: Generates Drizzle migrations.
- `npm run db:migrate`: Applies Drizzle migrations.
- `npm run db:studio`: Opens Drizzle Studio to view/edit data.
- `npm run db:seed:demo`: Seeds a curated demo workspace for a dedicated Clerk test user.
- `npm run demo:create-testers`: User-run account creation helper; changes Clerk data.
  Existing emails are reused without updating or verifying their passwords.
  Resolve the access decision in the handoff before publishing credentials or
  placing publicly shared accounts on the real-booking allowlist.

## 🤝 Contributing

This is a personal learning project and is not actively seeking contributions.

## 📄 License

No license. This is a learning project.
