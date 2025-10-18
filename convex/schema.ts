import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Users - synchronized from Clerk user records
	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.string(),
		lastSignedInDate: v.optional(v.number()),
		externalId: v.string(), // Clerk user ID
	})
		.index("by_external_id", ["externalId"])
		.index("by_email", ["email"]),

	// Organizations - hybrid Clerk + custom metadata
	organizations: defineTable({
		// Clerk integration
		clerkOrganizationId: v.string(), // Primary identifier from Clerk
		name: v.string(), // Synced from Clerk
		ownerUserId: v.id("users"), // Mapped from Clerk organization admin

		// Custom business metadata (not in Clerk)
		email: v.optional(v.string()),
		website: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
		logoInvertInDarkMode: v.optional(v.boolean()),
		brandColor: v.optional(v.string()),
		address: v.optional(v.string()),
		phone: v.optional(v.string()),
		companySize: v.optional(
			v.union(v.literal("1-10"), v.literal("10-100"), v.literal("100+"))
		),

		// Billing & subscription
		stripeCustomerId: v.optional(v.string()),
		plan: v.union(v.literal("trial"), v.literal("pro"), v.literal("cancelled")),

		// Default settings
		defaultTaxRate: v.optional(v.number()),
		defaultReminderTiming: v.optional(v.number()), // hours before
		smsEnabled: v.optional(v.boolean()),
		monthlyRevenueTarget: v.optional(v.number()), // Monthly Revenue target displayed on home page

		// Metadata flags
		isMetadataComplete: v.optional(v.boolean()), // Whether user completed additional onboarding
	})
		.index("by_owner", ["ownerUserId"])
		.index("by_clerk_org", ["clerkOrganizationId"]),

	organizationMemberships: defineTable({
		orgId: v.id("organizations"),
		userId: v.id("users"),
		role: v.optional(v.string()), // role from Clerk membership payload
	})
		.index("by_org", ["orgId"])
		.index("by_user", ["userId"])
		.index("by_org_user", ["orgId", "userId"]),

	// Clients - main client information
	clients: defineTable({
		orgId: v.id("organizations"),
		// Company Information
		companyName: v.string(),
		industry: v.optional(v.string()),
		companyDescription: v.optional(v.string()),

		// Status and Classification
		status: v.union(
			v.literal("lead"),
			v.literal("prospect"),
			v.literal("active"),
			v.literal("inactive"),
			v.literal("archived")
		),
		leadSource: v.optional(
			v.union(
				v.literal("word-of-mouth"),
				v.literal("website"),
				v.literal("social-media"),
				v.literal("referral"),
				v.literal("advertising"),
				v.literal("trade-show"),
				v.literal("cold-outreach"),
				v.literal("other")
			)
		),

		// Custom Categories
		category: v.optional(
			v.union(
				v.literal("design"),
				v.literal("development"),
				v.literal("consulting"),
				v.literal("maintenance"),
				v.literal("marketing"),
				v.literal("other")
			)
		),
		clientSize: v.optional(
			v.union(
				v.literal("small"),
				v.literal("medium"),
				v.literal("large"),
				v.literal("enterprise")
			)
		),
		clientType: v.optional(
			v.union(
				v.literal("new-client"),
				v.literal("existing-client"),
				v.literal("partner"),
				v.literal("vendor"),
				v.literal("contractor")
			)
		),
		isActive: v.optional(v.boolean()),
		priorityLevel: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
		projectDimensions: v.optional(v.string()),

		// Communication preferences
		communicationPreference: v.optional(
			v.union(v.literal("email"), v.literal("phone"), v.literal("both"))
		),
		emailOptIn: v.boolean(),
		smsOptIn: v.boolean(),

		// Services
		servicesNeeded: v.optional(v.array(v.string())), // Array of service types

		// Metadata
		tags: v.optional(v.array(v.string())),
		notes: v.optional(v.string()),

		// Archive functionality
		archivedAt: v.optional(v.number()), // Timestamp when client was archived
	})
		.index("by_org", ["orgId"])
		.index("by_status", ["orgId", "status"]),

	// Client Contacts - separate table for multiple contacts per client
	clientContacts: defineTable({
		clientId: v.id("clients"),
		orgId: v.id("organizations"),

		// Basic info
		firstName: v.string(),
		lastName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),

		// Role information
		jobTitle: v.optional(v.string()),
		role: v.optional(v.string()), // e.g., "Manager", "Director"
		department: v.optional(v.string()), // e.g., "Billing Contact", "Operations"

		// Contact preferences
		isPrimary: v.boolean(), // Mark primary contact
		photoUrl: v.optional(v.string()),
		photoStorageId: v.optional(v.id("_storage")),
	})
		.index("by_client", ["clientId"])
		.index("by_org", ["orgId"])
		.index("by_primary", ["clientId", "isPrimary"]),

	// Client Properties - separate table for multiple properties per client
	clientProperties: defineTable({
		clientId: v.id("clients"),
		orgId: v.id("organizations"),

		// Property details
		propertyName: v.optional(v.string()),
		propertyType: v.optional(
			v.union(
				v.literal("residential"),
				v.literal("commercial"),
				v.literal("industrial"),
				v.literal("retail"),
				v.literal("office"),
				v.literal("mixed-use")
			)
		),
		squareFootage: v.optional(v.number()),

		// Address
		streetAddress: v.string(),
		city: v.string(),
		state: v.string(),
		zipCode: v.string(),
		country: v.optional(v.string()),

		// Additional info
		description: v.optional(v.string()),
		imageStorageIds: v.optional(v.array(v.id("_storage"))), // Multiple images
		isPrimary: v.boolean(), // Mark primary property
	})
		.index("by_client", ["clientId"])
		.index("by_org", ["orgId"])
		.index("by_primary", ["clientId", "isPrimary"]),

	// Projects
	projects: defineTable({
		orgId: v.id("organizations"),
		clientId: v.id("clients"),

		// Basic info
		title: v.string(),
		description: v.optional(v.string()),
		instructions: v.optional(v.string()),
		projectNumber: v.optional(v.string()), // Custom project numbering

		// Status and type
		status: v.union(
			v.literal("planned"),
			v.literal("in-progress"),
			v.literal("completed"),
			v.literal("cancelled")
		),
		projectType: v.union(v.literal("one-off"), v.literal("recurring")),

		// Dates
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),

		// Team
		salespersonId: v.optional(v.id("users")),
		assignedUserIds: v.optional(v.array(v.id("users"))),

		// Settings
		invoiceReminderEnabled: v.optional(v.boolean()),
		scheduleForLater: v.optional(v.boolean()),
	})
		.index("by_org", ["orgId"])
		.index("by_client", ["clientId"])
		.index("by_status", ["orgId", "status"]),

	// Tasks/Schedule items
	tasks: defineTable({
		orgId: v.id("organizations"),
		projectId: v.optional(v.id("projects")),
		clientId: v.id("clients"),

		title: v.string(),
		description: v.optional(v.string()),

		// Schedule
		date: v.number(), // Date as timestamp
		startTime: v.optional(v.string()), // e.g., "14:00"
		endTime: v.optional(v.string()),

		// Assignment
		assigneeUserId: v.optional(v.id("users")),

		// Status and Priority
		status: v.union(
			v.literal("pending"),
			v.literal("in-progress"),
			v.literal("completed"),
			v.literal("cancelled")
		),
		priority: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("urgent")
			)
		),
		completedAt: v.optional(v.number()),

		// Recurrence
		repeat: v.optional(
			v.union(
				v.literal("none"),
				v.literal("daily"),
				v.literal("weekly"),
				v.literal("monthly")
			)
		),
		repeatUntil: v.optional(v.number()),
	})
		.index("by_org", ["orgId"])
		.index("by_project", ["projectId"])
		.index("by_client", ["clientId"])
		.index("by_assignee", ["assigneeUserId"])
		.index("by_date", ["orgId", "date"]),

	// Quotes
	quotes: defineTable({
		orgId: v.id("organizations"),
		clientId: v.id("clients"),
		projectId: v.optional(v.id("projects")),

		// Basic info
		title: v.optional(v.string()),
		quoteNumber: v.optional(v.string()), // Auto-generated or custom

		// Status
		status: v.union(
			v.literal("draft"),
			v.literal("sent"),
			v.literal("approved"),
			v.literal("declined"),
			v.literal("expired")
		),

		// Financial
		subtotal: v.number(),
		discountEnabled: v.optional(v.boolean()),
		discountAmount: v.optional(v.number()),
		discountType: v.optional(
			v.union(v.literal("percentage"), v.literal("fixed"))
		),
		taxEnabled: v.optional(v.boolean()),
		taxRate: v.optional(v.number()), // Percentage
		taxAmount: v.optional(v.number()),
		total: v.number(),

		// Terms and messaging
		validUntil: v.optional(v.number()),
		clientMessage: v.optional(v.string()),
		terms: v.optional(v.string()),

		// Tracking
		sentAt: v.optional(v.number()),
		approvedAt: v.optional(v.number()),
		declinedAt: v.optional(v.number()),

		// Client approval details
		approval: v.optional(
			v.object({
				clientName: v.string(),
				ipAddress: v.string(),
				userAgent: v.string(),
				signedAt: v.number(),
			})
		),

		// PDF settings for client view
		pdfSettings: v.optional(
			v.object({
				showQuantities: v.boolean(),
				showUnitPrices: v.boolean(),
				showLineItemTotals: v.boolean(),
				showTotals: v.boolean(),
			})
		),

		// Reference to the latest document version
		latestDocumentId: v.optional(v.id("documents")),

		publicToken: v.string(), // For client access
	})
		.index("by_org", ["orgId"])
		.index("by_client", ["clientId"])
		.index("by_project", ["projectId"])
		.index("by_status", ["orgId", "status"])
		.index("by_public_token", ["publicToken"]),

	// Quote Line Items
	quoteLineItems: defineTable({
		quoteId: v.id("quotes"),
		orgId: v.id("organizations"),

		description: v.string(),
		quantity: v.number(),
		unit: v.string(), // e.g., "hour", "item", "day"
		rate: v.number(), // Unit price
		amount: v.number(), // quantity * rate
		cost: v.optional(v.number()), // Cost per unit for margin calculation

		sortOrder: v.number(), // For ordering items
		optional: v.optional(v.boolean()), // Mark as optional item
	})
		.index("by_quote", ["quoteId"])
		.index("by_org", ["orgId"]),

	// Invoices
	invoices: defineTable({
		orgId: v.id("organizations"),
		clientId: v.id("clients"),
		projectId: v.optional(v.id("projects")),
		quoteId: v.optional(v.id("quotes")), // If created from quote

		// Basic info
		invoiceNumber: v.string(),

		// Status
		status: v.union(
			v.literal("draft"),
			v.literal("sent"),
			v.literal("paid"),
			v.literal("overdue"),
			v.literal("cancelled")
		),

		// Financial
		subtotal: v.number(),
		discountAmount: v.optional(v.number()),
		taxAmount: v.optional(v.number()),
		total: v.number(),

		// Dates
		issuedDate: v.number(),
		dueDate: v.number(),
		paidAt: v.optional(v.number()),

		// Payment
		paymentMethod: v.optional(v.string()),
		stripeSessionId: v.optional(v.string()),
		stripePaymentIntentId: v.optional(v.string()),

		publicToken: v.string(), // For client payment access
	})
		.index("by_org", ["orgId"])
		.index("by_client", ["clientId"])
		.index("by_project", ["projectId"])
		.index("by_quote", ["quoteId"])
		.index("by_status", ["orgId", "status"])
		.index("by_due_date", ["orgId", "dueDate"])
		.index("by_public_token", ["publicToken"]),

	// Invoice Line Items
	invoiceLineItems: defineTable({
		invoiceId: v.id("invoices"),
		orgId: v.id("organizations"),

		description: v.string(),
		quantity: v.number(),
		unitPrice: v.number(),
		total: v.number(), // quantity * unitPrice

		sortOrder: v.number(),
	})
		.index("by_invoice", ["invoiceId"])
		.index("by_org", ["orgId"]),

	// PDF Documents (for quotes and invoices)
	documents: defineTable({
		orgId: v.id("organizations"),
		documentType: v.union(v.literal("quote"), v.literal("invoice")),
		documentId: v.string(), // ID of the quote or invoice

		storageId: v.id("_storage"), // Reference to stored PDF
		generatedAt: v.number(),
		version: v.number(), // Version number for tracking PDF versions (starts at 1)

		// Top-level BoldSign document ID for efficient querying
		boldsignDocumentId: v.optional(v.string()),

		// BoldSign integration fields
		boldsign: v.optional(
			v.object({
				documentId: v.string(), // BoldSign document ID
				status: v.union(
					v.literal("Sent"),
					v.literal("Viewed"),
					v.literal("Signed"),
					v.literal("Completed"),
					v.literal("Declined"),
					v.literal("Revoked"),
					v.literal("Expired")
				),
				sentTo: v.array(
					v.object({
						id: v.optional(v.string()),
						name: v.string(),
						email: v.string(),
						signerType: v.string(), // "Signer" or "CC"
					})
				),
				sentAt: v.optional(v.number()),
				viewedAt: v.optional(v.number()),
				signedAt: v.optional(v.number()),
				completedAt: v.optional(v.number()),
				declinedAt: v.optional(v.number()),
				revokedAt: v.optional(v.number()),
				expiredAt: v.optional(v.number()),
				viewUrl: v.optional(v.string()), // Link to view document in BoldSign
			})
		),
	})
		.index("by_org", ["orgId"])
		.index("by_document", ["documentType", "documentId"])
		.index("by_document_version", ["documentType", "documentId", "version"])
		.index("by_boldsign_documentId", ["boldsignDocumentId"]),

	// Activities - for home route activity feed
	activities: defineTable({
		orgId: v.id("organizations"),
		userId: v.id("users"), // User who performed the activity
		activityType: v.union(
			v.literal("client_created"),
			v.literal("client_updated"),
			v.literal("project_created"),
			v.literal("project_updated"),
			v.literal("project_completed"),
			v.literal("quote_created"),
			v.literal("quote_sent"),
			v.literal("quote_approved"),
			v.literal("quote_declined"),
			v.literal("quote_pdf_generated"),
			v.literal("invoice_created"),
			v.literal("invoice_sent"),
			v.literal("invoice_paid"),
			v.literal("task_created"),
			v.literal("task_completed"),
			v.literal("user_invited"),
			v.literal("user_removed"),
			v.literal("organization_updated")
		),
		entityType: v.union(
			v.literal("client"),
			v.literal("project"),
			v.literal("quote"),
			v.literal("invoice"),
			v.literal("task"),
			v.literal("user"),
			v.literal("organization")
		),
		entityId: v.string(), // ID of the affected entity
		entityName: v.string(), // Display name of the affected entity
		description: v.string(), // Human-readable activity description
		metadata: v.optional(v.any()), // Additional activity-specific data
		timestamp: v.number(), // When the activity occurred
		isVisible: v.boolean(), // Whether to show in activity feeds
	})
		.index("by_org_timestamp", ["orgId", "timestamp"])
		.index("by_user", ["userId"])
		.index("by_entity", ["entityType", "entityId"])
		.index("by_type", ["orgId", "activityType"]),

	// Notifications
	notifications: defineTable({
		orgId: v.id("organizations"),
		userId: v.id("users"), // Target user for the notification
		notificationType: v.union(
			v.literal("task_reminder"),
			v.literal("quote_approved"),
			v.literal("invoice_overdue"),
			v.literal("payment_received"),
			v.literal("project_deadline"),
			v.literal("team_assignment")
		),
		title: v.string(), // Notification title
		message: v.string(), // Notification message content
		entityType: v.optional(
			v.union(
				v.literal("client"),
				v.literal("project"),
				v.literal("quote"),
				v.literal("invoice"),
				v.literal("task")
			)
		),
		entityId: v.optional(v.string()), // Related entity ID
		actionUrl: v.optional(v.string()), // URL to navigate when clicked
		isRead: v.boolean(), // Whether user has read the notification
		readAt: v.optional(v.number()), // When notification was read
		scheduledFor: v.optional(v.number()), // When to send the notification
		sentAt: v.optional(v.number()), // When notification was actually sent
		sentVia: v.optional(
			v.union(v.literal("email"), v.literal("sms"), v.literal("in_app"))
		),
		priority: v.union(
			v.literal("low"),
			v.literal("medium"),
			v.literal("high"),
			v.literal("urgent")
		),
	})
		.index("by_user_read", ["userId", "isRead"])
		.index("by_org", ["orgId"])
		.index("by_scheduled", ["scheduledFor"])
		.index("by_type", ["notificationType"]),

	// Organization Documents - reusable documents for quotes/invoices
	organizationDocuments: defineTable({
		orgId: v.id("organizations"),

		// Document metadata
		name: v.string(), // User-friendly name
		description: v.optional(v.string()), // Optional description

		// Storage
		storageId: v.id("_storage"), // Reference to stored PDF
		fileSize: v.optional(v.number()), // Size in bytes

		// Tracking
		uploadedAt: v.number(),
		uploadedBy: v.id("users"),
	})
		.index("by_org", ["orgId"])
		.index("by_org_uploaded", ["orgId", "uploadedAt"]),

	// SKUs - reusable stock keeping units for quotes
	skus: defineTable({
		orgId: v.id("organizations"),

		// SKU details
		name: v.string(), // Acts as description when used in quotes
		unit: v.string(), // Default unit (e.g., "hour", "item", "day")
		rate: v.number(), // Default price/rate
		cost: v.optional(v.number()), // Optional cost for margin calculation

		// Status
		isActive: v.boolean(), // Allow soft deletion

		// Tracking
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_org", ["orgId"])
		.index("by_org_active", ["orgId", "isActive"]),
});
