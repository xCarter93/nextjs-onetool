# OneTool - Feature Documentation

A comprehensive overview of all features and capabilities in the OneTool application.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Client Management](#client-management)
3. [Project Management](#project-management)
4. [Quote Management](#quote-management)
5. [Invoice & Payments](#invoice--payments)
6. [Task Scheduling](#task-scheduling)
7. [Email Communication](#email-communication)
8. [Notifications & Mentions](#notifications--mentions)
9. [E-Signatures](#e-signatures)
10. [Organization Management](#organization-management)
11. [Dashboard & Analytics](#dashboard--analytics)
12. [Product Tours & Onboarding](#product-tours--onboarding)
13. [Authentication & Authorization](#authentication--authorization)
14. [Billing & Subscriptions](#billing--subscriptions)
15. [Data Import](#data-import)

---

## Core Architecture

### Tech Stack

- **Frontend**: Next.js 15.5 (App Router), Tailwind CSS v4, shadcn/ui
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Clerk (users + organizations)
- **Payments**: Stripe Checkout + Stripe Connect
- **Email**: Resend
- **E-Signatures**: BoldSign
- **Hosting**: Vercel (web), Convex Cloud (backend)

### Multi-Tenant Architecture

All data is organization-scoped with automatic `orgId` assignment:

```typescript
// Example from projects.ts
async function createProjectWithOrg(
	ctx: MutationCtx,
	data: Omit<Doc<"projects">, "_id" | "_creationTime" | "orgId">
): Promise<Id<"projects">> {
	const userOrgId = await getCurrentUserOrgId(ctx);
	const projectData = { ...data, orgId: userOrgId };
	return await ctx.db.insert("projects", projectData);
}
```

---

## Client Management

### Features

- **CRUD Operations**: Create, read, update, delete clients
- **Status Tracking**: Lead → Prospect → Active → Inactive → Archived
- **Client Categories**: Design, Development, Consulting, Maintenance, Marketing, Other
- **Client Properties**: Multiple properties per client with addresses
- **Client Contacts**: Multiple contacts per client with primary contact designation
- **Archiving**: Soft delete with automatic cleanup after 7 days
- **Bulk Import**: CSV import with validation

### Status Workflow

```typescript
// From clients.ts
status: v.union(
	v.literal("lead"),
	v.literal("prospect"),
	v.literal("active"),
	v.literal("inactive"),
	v.literal("archived")
);
```

### Client Properties

- Multiple properties per client
- Property types: Residential, Commercial, Industrial, Retail, Office, Mixed-use
- Address fields: Street, City, State, ZIP, Country
- Square footage tracking
- Image storage support

### Client Contacts

- Multiple contacts per client
- Primary contact designation
- Job title, role, department
- Email and phone tracking
- Photo storage support

### Bulk Operations

```typescript
// From clients.ts - bulkCreate mutation
export const bulkCreate = mutation({
	args: {
		clients: v.array(
			v.object({
				/* client fields */
			})
		),
	},
	handler: async (ctx, args) => {
		// Validates and creates multiple clients
		// Returns success/error per client
	},
});
```

---

## Project Management

### Features

- **CRUD Operations**: Full project lifecycle management
- **Status Tracking**: Planned → In-Progress → Completed → Cancelled
- **Project Types**: One-off or Recurring
- **Team Assignment**: Salesperson and assigned users
- **Date Tracking**: Start date, end date, completion date
- **Client Linking**: Projects linked to clients
- **Bulk Import**: CSV import with client name resolution
- **Member Access Control**: Members only see assigned projects

### Project Status

```typescript
// From projects.ts
status: v.union(
	v.literal("planned"),
	v.literal("in-progress"),
	v.literal("completed"),
	v.literal("cancelled")
);
```

### Cascading Deletion

When deleting a project, automatically deletes:

- All associated tasks
- All quotes and quote line items
- All invoices and invoice line items
- All related documents (PDFs)

### Member Access Control

```typescript
// From projects.ts - list query
const isUserMember = await isMember(ctx);
if (isUserMember && currentUserId) {
	projects = projects.filter(
		(project) =>
			project.assignedUserIds && project.assignedUserIds.includes(currentUserId)
	);
}
```

### Project Statistics

- Total projects by status
- Projects by type (one-off vs recurring)
- Upcoming deadlines (next 7 days)
- Overdue projects

---

## Quote Management

### Features

- **Quote Creation**: With line items, discounts, and taxes
- **PDF Generation**: Professional quote PDFs
- **E-Signature Integration**: Send quotes for client approval via BoldSign
- **Status Tracking**: Draft → Sent → Approved → Declined → Expired
- **Public Token Access**: Clients can view quotes via public URL
- **Sequential Numbering**: Auto-generated quote numbers (Q-000001)
- **Quote to Invoice**: Convert approved quotes to invoices
- **Version Tracking**: Multiple PDF versions per quote

### Quote Line Items

```typescript
// From schema.ts
quoteLineItems: defineTable({
	quoteId: v.id("quotes"),
	description: v.string(),
	quantity: v.number(),
	unit: v.string(), // "hour", "item", "day"
	rate: v.number(), // Unit price
	amount: v.number(), // quantity * rate
	cost: v.optional(v.number()), // For margin calculation
	sortOrder: v.number(),
	optional: v.optional(v.boolean()),
});
```

### Quote Totals Calculation

```typescript
// From quotes.ts - calculateQuoteTotals
async function calculateQuoteTotals(ctx, quoteId, options) {
	const lineItems = await ctx.db
		.query("quoteLineItems")
		.withIndex("by_quote", (q) => q.eq("quoteId", quoteId))
		.collect();

	const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
	// Apply discount, then tax
	return { subtotal, taxAmount, total };
}
```

### Sequential Quote Numbering

```typescript
// From quotes.ts - generateNextQuoteNumber
async function generateNextQuoteNumber(ctx, orgId) {
	const org = await ctx.db.get(orgId);
	const nextNumber = (org.lastQuoteNumber || 0) + 1;
	await ctx.db.patch(orgId, { lastQuoteNumber: nextNumber });
	return `Q-${nextNumber.toString().padStart(6, "0")}`;
}
```

### Public Quote Access

- Public token generation for client access
- No authentication required for viewing
- Approval workflow via public token

---

## Invoice & Payments

### Features

- **Invoice Creation**: Manual or from approved quotes
- **PDF Generation**: Professional invoice PDFs
- **Payment Processing**: Stripe Checkout integration
- **Status Tracking**: Draft → Sent → Paid → Overdue → Cancelled
- **Public Payment Page**: Clients can pay invoices via public URL
- **Stripe Connect**: Direct payments to organization's Stripe account
- **Invoice Line Items**: Detailed line items with quantities and prices
- **Totals Calculation**: Automatic calculation from line items

### Invoice Creation from Quote

```typescript
// From invoices.ts - createFromQuote
export const createFromQuote = mutation({
	handler: async (ctx, args) => {
		// Validates quote is approved
		// Creates invoice with copied line items
		// Generates sequential invoice number
		// Links invoice to quote
	},
});
```

### Payment Processing

```typescript
// From invoices.ts - markPaidByPublicToken
export const markPaidByPublicToken = mutation({
	args: {
		publicToken: v.string(),
		stripeSessionId: v.string(),
		stripePaymentIntentId: v.string(),
	},
	handler: async (ctx, args) => {
		// Marks invoice as paid
		// Stores Stripe payment IDs
		// Logs payment activity
	},
});
```

### Public Payment Page

- `/pay/[token]` route for client access
- Displays invoice details
- Stripe Checkout integration
- Payment confirmation

### Invoice Totals

- Calculated dynamically from line items
- Supports discounts and taxes
- Recalculation available for fixing discrepancies

---

## Task Scheduling

### Features

- **Task Creation**: With date, time, and assignment
- **Recurring Tasks**: Daily, Weekly, Monthly, Yearly
- **Status Tracking**: Pending → In-Progress → Completed → Cancelled
- **Priority Levels**: Low, Medium, High, Urgent
- **Calendar View**: Full calendar integration
- **Project Linking**: Tasks linked to projects
- **Client Linking**: Tasks can be linked to clients
- **Assignee Tracking**: Assign tasks to team members

### Task Types

```typescript
// From schema.ts
type: v.optional(v.union(v.literal("internal"), v.literal("external")));
```

### Recurring Tasks

```typescript
// From schema.ts
repeat: v.optional(v.union(
  v.literal("none"),
  v.literal("daily"),
  v.literal("weekly"),
  v.literal("monthly"),
  v.literal("yearly")
)),
repeatUntil: v.optional(v.number()),
parentTaskId: v.optional(v.id("tasks"))
```

### Calendar Integration

- Dashboard/Calendar view toggle
- Full calendar view with task display
- Date-based filtering and navigation

---

## Email Communication

### Features

- **Email Sending**: Send emails to clients via Resend
- **Email Threading**: Reply-to functionality with thread tracking
- **Organization Branding**: Custom email templates with logo and colors
- **Inbound Email**: Receive and process client emails
- **Email Tracking**: Sent, Delivered, Opened, Bounced, Complained
- **Attachment Support**: File attachments in emails
- **Receiving Address**: Unique email address per organization

### Email Sending

```typescript
// From resend.ts - sendClientEmail
export const sendClientEmail = mutation({
	handler: async (ctx, args) => {
		// Gets primary contact email
		// Builds branded HTML email
		// Sends via Resend
		// Stores email record
		// Logs activity
	},
});
```

### Email Threading

```typescript
// From resend.ts - replyToEmail
export const replyToEmail = mutation({
	handler: async (ctx, args) => {
		// Builds references chain
		// Adds "Re: " prefix to subject
		// Maintains threadId
		// Tracks inReplyTo relationship
	},
});
```

### Organization Branding

- Custom logo in email header
- Brand color customization
- Organization name and contact info in footer
- Sender name personalization

### Inbound Email Processing

- Webhook handler for Resend inbound emails
- Automatic client matching
- Thread association
- Attachment processing

---

## Notifications & Mentions

### Features

- **In-App Notifications**: Real-time notifications for users
- **Mention System**: Tag users in client/project/quote contexts
- **Notification Types**: Task reminders, quote approvals, invoice overdue, etc.
- **Attachment Support**: Files attached to mention notifications
- **Read/Unread Tracking**: Notification read status
- **Priority Levels**: Low, Medium, High, Urgent
- **Scheduled Notifications**: Future-dated notifications

### Mention Notifications

```typescript
// From notifications.ts - createMention
export const createMention = mutation({
	args: {
		taggedUserId: v.id("users"),
		message: v.string(),
		entityType: v.union("client", "project", "quote"),
		entityId: v.string(),
		attachments: v.optional(v.array(/* attachment schema */)),
	},
	handler: async (ctx, args) => {
		// Creates notification with mention type
		// Stores attachments
		// Generates action URL
		// Tracks author information
	},
});
```

### Notification Types

- `task_reminder`: Task deadline reminders
- `quote_approved`: Quote approval notifications
- `invoice_overdue`: Overdue invoice alerts
- `payment_received`: Payment confirmation
- `project_deadline`: Project deadline warnings
- `team_assignment`: Team member assignments
- `client_mention`: User mentioned in client context
- `project_mention`: User mentioned in project context
- `quote_mention`: User mentioned in quote context

### Attachment Support

- Maximum 10 attachments per message
- File size limit: 100MB
- MIME type validation
- Storage ID tracking

---

## E-Signatures

### Features

- **BoldSign Integration**: Send documents for e-signature
- **Status Tracking**: Sent → Viewed → Signed → Completed
- **Webhook Handling**: Real-time status updates
- **Signed PDF Storage**: Download and store signed documents
- **Quote Approval**: Automatic quote status update on completion
- **Usage Tracking**: Monthly e-signature count for plan limits

### BoldSign Webhook

```typescript
// From boldsign.ts - handleWebhook
export const handleWebhook = internalMutation({
	handler: async (ctx, args) => {
		// Updates document status
		// Tracks event timestamps
		// Updates quote status if applicable
		// Triggers signed PDF download
		// Increments usage counter
	},
});
```

### Document Status Flow

- **Sent**: Document sent to signers
- **Viewed**: Signer viewed the document
- **Signed**: Signer signed the document
- **Completed**: All parties signed
- **Declined**: Signer declined to sign
- **Revoked**: Document revoked by sender
- **Expired**: Document expired

### Quote Integration

- When quote PDF is sent for signature, tracks status
- On completion, automatically updates quote to "approved"
- Downloads signed PDF and stores in documents table

---

## Organization Management

### Features

- **Organization Profile**: Company information and branding
- **Logo Management**: Upload and manage organization logo
- **Brand Customization**: Brand colors, contact info
- **Document Library**: Reusable organization documents
- **SKU Management**: Reusable products/services for quotes
- **Stripe Connect**: Payment processing setup
- **Email Configuration**: Receiving email address setup
- **Settings**: Default tax rate, reminder timing, timezone

### Organization Documents

```typescript
// From schema.ts
organizationDocuments: defineTable({
	orgId: v.id("organizations"),
	name: v.string(),
	description: v.optional(v.string()),
	storageId: v.id("_storage"),
	fileSize: v.optional(v.number()),
	uploadedAt: v.number(),
	uploadedBy: v.id("users"),
});
```

### SKU Management

```typescript
// From schema.ts
skus: defineTable({
	orgId: v.id("organizations"),
	name: v.string(), // Acts as description
	unit: v.string(), // Default unit
	rate: v.number(), // Default price
	cost: v.optional(v.number()), // For margin calculation
	isActive: v.boolean(),
});
```

### Organization Settings

- Default tax rate
- Default reminder timing (hours before)
- SMS enabled/disabled
- Monthly revenue target
- Timezone (IANA timezone string)
- Logo invert in dark mode

---

## Dashboard & Analytics

### Features

- **Home Dashboard**: Overview of business metrics
- **Calendar View**: Alternative dashboard view
- **Business Stats**: Clients, projects, quotes, invoices, revenue, tasks
- **Date Range Filtering**: Custom date range selection
- **Trend Charts**: Line charts showing growth over time
- **Revenue Goal Tracking**: Set and track monthly revenue goals
- **Activity Feed**: Recent activity across the organization
- **Getting Started**: Onboarding checklist

### Dashboard Metrics

```typescript
// From home-stats-real.tsx
const metrics = [
	{ key: "clients", label: "Total Clients" },
	{ key: "projects", label: "Projects Completed" },
	{ key: "quotes", label: "Approved Quotes" },
	{ key: "invoices", label: "Invoices Paid" },
	{ key: "revenue", label: "Revenue" },
	{ key: "tasks", label: "Pending Tasks" },
];
```

### Activity Feed

- Real-time activity updates
- Filterable by activity type
- Shows user, action, and entity
- Links to related entities

### Revenue Goal Tracking

- Set monthly revenue target
- Track progress percentage
- Visual progress indicators
- Change percentage calculation

---

## Product Tours & Onboarding

### Features

- **Guided Tours**: Interactive multi-step tours for onboarding new users
- **Home Tour**: Comprehensive 9-step tour covering key dashboard features
- **Step Registration**: Automatic step detection and registration system
- **Keyboard Navigation**: Arrow keys, Enter, and Escape for tour control
- **Progress Tracking**: Visual progress indicators and step completion tracking
- **Tour Persistence**: Tracks if users have completed tours via `hasSeenTour` flag
- **Dismissal Options**: Skip tour with "don't show again" option
- **Viewport-Aware Tooltips**: Smart tooltip positioning that adapts to screen boundaries

### Tour System Architecture

The tour system is built as a reusable component library:

```typescript
// Core components
- TourContextProvider: Manages tour state with reducer pattern
- TourElement: Wraps elements to highlight during tours
- TourTooltip: Displays step information with positioning
- TourStartModal: Welcome modal to initiate tours
```

### Home Tour Steps

The home tour includes 9 steps covering essential features:

1. **Sidebar Navigation**: Main navigation menu overview
2. **Team Switcher**: Organization switching functionality
3. **User Menu**: Account and profile access
4. **View Toggle**: Dashboard/Calendar view switching
5. **Home Stats**: Business metrics overview
6. **Getting Started**: Onboarding checklist
7. **Tasks**: Task management section
8. **Revenue Goal**: Revenue tracking and goal setting
9. **Activity Feed**: Recent activity stream

### Tour State Management

```typescript
// From tour-context.tsx
interface TourState<T extends string> {
	currentStepId: T | null;
	isActive: boolean;
	completedSteps: Set<T>;
}

// Actions: START_TOUR, NEXT_STEP, PREV_STEP, GO_TO_STEP, END_TOUR, DISMISS
```

### Keyboard Navigation

- **Arrow Right / Enter**: Move to next step
- **Arrow Left**: Move to previous step
- **Escape**: Dismiss tour

### Tour Persistence

```typescript
// From userTour.ts
export const hasSeenTour = query({
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		return user.hasSeenTour ?? false;
	},
});

export const markTourComplete = mutation({
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		await ctx.db.patch(user._id, { hasSeenTour: true });
	},
});
```

### Tour Features

- **Frosted Glass Overlay**: Visual overlay that dims non-highlighted areas
- **Smooth Scrolling**: Automatically scrolls to highlighted elements
- **Responsive Positioning**: Tooltips adjust position based on viewport constraints
- **Step Registration**: Ensures all tour steps are registered before starting
- **Completion Callbacks**: `onComplete` and `onDismiss` callbacks for custom logic
- **CSS Classes**: Adds `tour-active` class to body for global styling
- **Accessibility**: ARIA attributes and keyboard navigation support

### Tour Implementation

Tours are implemented by:

1. Wrapping components with `TourElement` component
2. Providing tour context at layout level
3. Showing start modal for first-time users
4. Tracking completion in user record

---

## Authentication & Authorization

### Features

- **Clerk Integration**: User and organization management
- **Role-Based Access**: Admin vs Member roles
- **Organization Membership**: Multi-user organizations
- **Member Restrictions**: Members see only assigned projects
- **Session Management**: Last sign-in tracking

### Role-Based Access Control

```typescript
// From projects.ts
const isUserMember = await isMember(ctx);
if (isUserMember && currentUserId) {
	// Filter to only assigned projects
	projects = projects.filter(
		(project) =>
			project.assignedUserIds && project.assignedUserIds.includes(currentUserId)
	);
}
```

### Clerk Webhooks

- `user.created` / `user.updated`: Sync user data
- `user.deleted`: Cleanup user data
- `organization.created`: Create organization record
- `organization.updated`: Update organization name/logo
- `organization.deleted`: Cleanup organization data
- `organizationMembership.created`: Add user to org
- `organizationMembership.deleted`: Remove user from org

---

## Billing & Subscriptions

### Features

- **Clerk Billing Integration**: Subscription management
- **Plan Limits**: Free vs Business plan features
- **Usage Tracking**: E-signature count tracking
- **Subscription Status**: Active, Past Due, Cancelled, etc.
- **Billing Cycle Tracking**: Current period start date

### Plan Limits

**Free Plan:**

- 10 clients max
- 3 active projects per client
- 5 e-signatures per month
- Custom PDF generation

**Business Plan:**

- Unlimited clients
- Unlimited projects
- Unlimited e-signatures
- Custom SKUs
- Unlimited documents
- AI import
- Stripe Connect
- Priority support

### Usage Tracking

```typescript
// From schema.ts
usageTracking: v.optional(
	v.object({
		clientsCount: v.number(),
		esignaturesSentThisMonth: v.number(),
		lastEsignatureReset: v.number(),
	})
);
```

### Billing Webhooks

- `subscription.created`: Initialize subscription
- `subscription.active`: Activate features
- `subscription.updated`: Update subscription
- `subscription.pastDue`: Handle payment failures
- `paymentAttempt.created`: Log payment attempts
- `paymentAttempt.updated`: Track payment status

---

## Data Import

### Features

- **CSV Import**: Bulk import clients and projects
- **AI-Powered Parsing**: Mastra agent for CSV analysis
- **Data Validation**: Field validation and error reporting
- **Client Name Resolution**: Match client names to existing clients

### CSV Import Agent

```typescript
// From csv-import-agent.ts
export const csvImportAgent = new Agent({
	name: "csv-import-agent",
	instructions: "Analyze CSV files and extract structured data",
	model: openai("gpt-4o-mini"),
	tools: [parseCsvTool, mapSchemaTool, validateDataTool],
});
```

### Import Process

1. Upload CSV file
2. AI agent analyzes structure
3. Maps columns to schema
4. Validates data
5. Creates records with error reporting

---

## Additional Features

### Public Pages

- **Invoice Payment**: `/pay/[token]` - Public invoice payment page
- **Quote View**: Public quote viewing and approval

### File Storage

- PDF document storage
- Image storage for logos and properties
- Email attachment storage
- Organization document storage

### Activity Logging

- Comprehensive activity tracking
- Entity-based activity queries
- User activity history
- Visible/hidden activity flags

### Aggregates

- Pre-computed statistics for performance
- Real-time aggregate updates
- Efficient dashboard queries

### Service Status Monitoring

- External service health tracking
- Convex database status
- Clerk auth status
- Service status badges

---

## Database Schema Overview

### Core Tables

- `users`: User accounts (synced from Clerk)
- `organizations`: Organization records
- `organizationMemberships`: User-org relationships
- `clients`: Client records
- `clientContacts`: Client contact information
- `clientProperties`: Client property addresses
- `projects`: Project records
- `tasks`: Task/schedule items
- `quotes`: Quote records
- `quoteLineItems`: Quote line items
- `invoices`: Invoice records
- `invoiceLineItems`: Invoice line items
- `documents`: PDF documents (quotes/invoices)
- `notifications`: User notifications
- `messageAttachments`: Files attached to mentions
- `emailMessages`: Email records
- `emailAttachments`: Email file attachments
- `activities`: Activity log
- `organizationDocuments`: Reusable org documents
- `skus`: Reusable products/services
- `serviceStatus`: External service monitoring

---

_Last Updated: Based on current codebase analysis_
