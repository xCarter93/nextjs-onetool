import { Id } from "@onetool/backend/convex/_generated/dataModel";

/**
 * Shared types for quotes and related functionality
 */

/**
 * Represents a recipient for email or signature requests
 */
export interface Recipient {
	id: string;
	name: string;
	email: string;
	signerType?: "Signer" | "CC";
}

/**
 * Represents a quote with approval information
 */
export interface ApprovedQuote {
	_id: Id<"quotes">;
	quoteNumber?: string;
	total?: number;
	_creationTime?: number;
	status?: string;
}

