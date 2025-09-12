# OneTool

<div align="center">
  <img src="./public/OneTool.png" alt="OneTool Logo" width="200" height="200" />
</div>

## Overview

OneTool is a lightweight, modern alternative to Jobber for small field-service businesses (cleaning, landscaping, HVAC, trades). The product focuses on **clarity, speed, and essential workflows** without the bloat. MVP delivers: client & project tracking, quoting (with PDF + e-signature), task scheduling, invoicing & payments, notifications, and a concise insights dashboard.

### Key Features

- **Client Management**: Create, track, and manage client relationships with consent flags
- **Project Tracking**: Link projects to clients with status tracking and task management
- **Quote Management**: Create professional quotes with line items, PDF generation, and e-signature
- **Task Scheduling**: Schedule and track tasks with reminders and calendar integration
- **Invoice & Payments**: Generate invoices from quotes with Stripe payment integration
- **Real-time Dashboard**: Key metrics and insights for business performance
- **Multi-tenant Architecture**: Organization-scoped data with Clerk authentication

## Tech Stack

- **Frontend**: Next.js 15.5 (App Router, Turbopack), Tailwind CSS v4, shadcn/ui components
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Clerk (auth + organizations + Stripe billing)
- **Payments**: Stripe Checkout + Webhooks
- **Email**: Resend
- **SMS**: Twilio (basic reminders)
- **Analytics**: PostHog
- **Hosting**: Vercel (web), Convex Cloud (backend)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Convex account and deployment
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-onetool
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables in `.env.local`:

```bash
# Convex
CONVEX_DEPLOYMENT=your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Clerk (when implemented)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
# CLERK_SECRET_KEY=your-clerk-secret

# Add other service keys as needed
```

4. Run the development server:

```bash
pnpm dev
```

5. Start Convex development server in a separate terminal:

```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # Context providers
│   └── env.ts              # Environment variables
├── convex/                 # Convex backend functions and schema
├── public/                 # Static assets
└── CLAUDE.md              # Development guidance
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production with Turbopack
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Convex development (run in separate terminal)
npx convex dev
```

## Roadmap

This project follows a 6-week MVP timeline:

- **Week 1**: Project setup, authentication, basic UI ✅
- **Week 2**: Organization setup, client management
- **Week 3**: Projects, tasks, and scheduling
- **Week 4**: Quotes with PDF generation and e-signature
- **Week 5**: Invoices and Stripe payment integration
- **Week 6**: Dashboard, notifications, and final polish

## Contributing

1. Check the [TODO.md](TODO.md) for current development tasks
2. Review the [PRD.md](PRD.md) for detailed requirements
3. Follow the development guidelines in [CLAUDE.md](CLAUDE.md)
4. Create feature branches and submit pull requests

## License

This project is private and proprietary to OneTool.
