# Kalender

A modern scheduling and calendar application built with **Next.js 15**. This project facilitates event management, meeting scheduling, and public booking pages.

> **Note**: This is a learning project. There is no license associated with this repository.

## Portfolio Demo Status

The overhaul is available locally and on a protected, browse-only
[Vercel Preview](https://kalender-git-ui-overhaul-thureinss-projects.vercel.app/).
The original production app remains at
[kalender-tau.vercel.app](https://kalender-tau.vercel.app/).
See the short [current handoff](docs/ui-overhaul/README.md) for verified status
and [open backlog](docs/ui-overhaul/backlog.md) for remaining work. This README
contains setup and visitor instructions; session history lives in the archive.

## Try the local demo

Open [demo visitor instructions](http://localhost:3000/#demo-access) while signed
out, or go directly to [Portfolio Review](http://localhost:3000/book/demo-strategy-studio/portfolio-review).
These accounts belong to the configured development Clerk instance; they do not
work on the existing production site. No registration or Calendar connection is needed.

1. On Portfolio Review, select **Login** in the header.
2. Sign in with any visitor email below and the shared password.
3. If asked to check your email, enter **424242**; no inbox is needed.
4. After login, you return to Portfolio Review. Explore timezone, date, time and
   form fields without submitting a booking.

| Visitor | Email |
| --- | --- |
| 1 | `demo-tester-1+clerk_test@example.com` |
| 2 | `demo-tester-2+clerk_test@example.com` |
| 3 | `demo-tester-3+clerk_test@example.com` |

Shared demo-only password: `Aa9!Tv__ZajQ_8U4xfxuDWMYcqbU`

These credentials are intentionally public and for shared visitor accounts only.
Keep personal information out of their profiles. Booking submission creates a
real Calendar event and sends an invitation, although no meeting takes place.
For an intended booking, use your own inbox in the form, not the shared login email.

The landing-page instructions appear only in demo mode with the verified demo
host and matching development Clerk instance. They are now in local source;
this does not deploy or publish the overhaul to the live site.
See [demo visitor setup](docs/ui-overhaul/demo-visitors.md) for maintainer details.

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
- **Product surfaces**: Midnight public pages and a dark-by-default workspace,
  with a light/dark toggle beside the account avatar. The workspace preference
  persists in this browser; public booking and auth pages stay Midnight.

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
   to the preview because existing production uses a different Clerk instance. Live bookings default to disabled; demo-host access is configured separately. Required service credentials:

   ```env
   DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

   To enable demo booking, verify `accutility778@gmail.com` in that Clerk instance
   and set `KALENDER_DEMO_HOST_CLERK_USER_ID` to its user ID, plus
   `KALENDER_BOOKING_MODE=demo`. Any signed-in visitor can then book only that
   host. Missing host configuration and the retired `testers` mode block writes;
   `KALENDER_DEMO_BOOKER_IDS` is no longer used. Shared demo logins are visitors,
   not the Calendar host. Enter your own real email in the booking form to test
   Google Calendar invitations; the login email can stay a demo address.

   Google sign-in should request only identity scopes in Clerk's Google
   connection. Hosts grant Calendar permissions separately through Integrations.
   For shared visitor logins, follow the [demo visitor setup](docs/ui-overhaul/demo-visitors.md)
   before running the account helper; password sign-in and credential verification
   are prerequisites to publishing logins.

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
  Development Clerk only; defaults to `demo-tester-N+clerk_test@example.com`
  with development email verification code `424242`.
  Existing emails are reused without updating or verifying their passwords.
  Creates visitor logins, not the Calendar host. Verify sign-in before publishing
  credentials; no visitor allowlist is needed in demo mode.

## 🤝 Contributing

This is a personal learning project and is not actively seeking contributions.

## 📄 License

No license. This is a learning project.
