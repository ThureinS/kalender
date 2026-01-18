# Kalender

A modern scheduling and calendar application built with **Next.js 15**. This project facilitates event management, meeting scheduling, and public booking pages.

> **Note**: This is a learning project. There is no license associated with this repository.

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
- **Theme Support**: Dark/Light mode using `next-themes`.

## 📂 Project Structure

- **`app/(main)/(public)`**: Public-facing routes (e.g., Landing page, Booking pages).
- **`app/(main)/(private)`**: Authenticated application routes (Dashboard, Events, Schedule).
- **`app/(auth)`**: Authentication routes (Login, Register).
- **`drizzle/schema`**: Database schema definitions (Events, Meetings, Schedule).
- **`components`**: Reusable UI components.
- **`lib`**: Utility functions and shared logic.

## 🛠️ Getting Started

### Prerequisites

- Node.js (version compatible with Next.js 15)
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

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add the following variables (based on `drizzle.config.ts` and typical setups):

   ```env
   DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Database Migration**
   Push the schema to your database:

   ```bash
   npm run db:generate
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
- `npm run start`: Starts the production server.
- `npm run db:generate`: Generates Drizzle migrations.
- `npm run db:migrate`: Applies Drizzle migrations.
- `npm run db:studio`: Opens Drizzle Studio to view/edit data.

## 🤝 Contributing

This is a personal learning project and is not actively seeking contributions.

## 📄 License

No license. This is a learning project.
