import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	CheckCircleIcon,
	UserIcon,
	BriefcaseIcon,
	DocumentTextIcon,
	CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

interface Person {
	name: string;
	href: string;
}

interface CommentActivity {
	id: number;
	type: "comment";
	person: Person;
	imageUrl: string;
	comment: string;
	date: string;
}

interface AssignmentActivity {
	id: number;
	type: "assignment";
	person: Person;
	assigned: Person;
	date: string;
}

interface Tag {
	name: string;
	href: string;
	color: string;
}

interface TagsActivity {
	id: number;
	type: "tags";
	person: Person;
	tags: Tag[];
	date: string;
}

interface ClientCreatedActivity {
	id: number;
	type: "client_created";
	person: Person;
	imageUrl: string;
	clientName: string;
	date: string;
}

interface ProjectCreatedActivity {
	id: number;
	type: "project_created";
	person: Person;
	projectName: string;
	clientName: string;
	date: string;
}

interface ProjectUpdatedActivity {
	id: number;
	type: "project_updated";
	person: Person;
	projectName: string;
	status: string;
	date: string;
}

interface ClientUpdatedActivity {
	id: number;
	type: "client_updated";
	person: Person;
	clientName: string;
	action: string;
	date: string;
}

interface QuoteCreatedActivity {
	id: number;
	type: "quote_created";
	person: Person;
	quoteAmount: string;
	clientName: string;
	date: string;
}

interface QuoteApprovedActivity {
	id: number;
	type: "quote_approved";
	person: Person;
	quoteAmount: string;
	clientName: string;
	date: string;
}

interface QuoteSentActivity {
	id: number;
	type: "quote_sent";
	person: Person;
	quoteAmount: string;
	clientName: string;
	date: string;
}

interface InvoiceSentActivity {
	id: number;
	type: "invoice_sent";
	person: Person;
	invoiceAmount: string;
	clientName: string;
	date: string;
}

interface InvoicePaidActivity {
	id: number;
	type: "invoice_paid";
	person: Person;
	invoiceAmount: string;
	clientName: string;
	date: string;
}

type ActivityItemType =
	| CommentActivity
	| AssignmentActivity
	| TagsActivity
	| ClientCreatedActivity
	| ProjectCreatedActivity
	| ProjectUpdatedActivity
	| ClientUpdatedActivity
	| QuoteCreatedActivity
	| QuoteApprovedActivity
	| QuoteSentActivity
	| InvoiceSentActivity
	| InvoicePaidActivity;

interface ActivityItemProps {
	activity: ActivityItemType;
	isLast: boolean;
}

function classNames(
	...classes: (string | boolean | undefined | null)[]
): string {
	return classes.filter(Boolean).join(" ");
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function iconForActivity(activity: ActivityItemType) {
	switch (activity.type) {
		case "client_created":
		case "client_updated":
			return UserIcon;
		case "project_created":
		case "project_updated":
			return BriefcaseIcon;
		case "quote_created":
		case "quote_sent":
		case "quote_approved":
			return DocumentTextIcon;
		case "invoice_sent":
		case "invoice_paid":
			return CurrencyDollarIcon;
		default:
			return null;
	}
}

function describeEvent(activity: ActivityItemType): string {
	switch (activity.type) {
		case "client_created":
			return "created the client.";
		case "project_created":
			return "created the project.";
		case "project_updated":
			return `updated the project${"status" in activity && (activity as ProjectUpdatedActivity).status ? ` to ${(activity as ProjectUpdatedActivity).status}.` : "."}`;
		case "client_updated":
			return "updated client details.";
		case "quote_created":
			return "created a quote.";
		case "quote_sent":
			return "sent the quote.";
		case "quote_approved":
			return "approved the quote.";
		case "invoice_sent":
			return "sent the invoice.";
		case "invoice_paid":
			return "paid the invoice.";
		case "assignment":
			return "made an assignment.";
		case "tags":
			return "added tags.";
		default:
			return "performed an action.";
	}
}

export default function ActivityItem({ activity, isLast }: ActivityItemProps) {
	const Icon = iconForActivity(activity);
	return (
		<li className="relative flex gap-x-4 items-center">
			<div
				className={classNames(
					isLast ? "h-6" : "-bottom-6",
					"absolute left-0 top-0 flex w-6 justify-center"
				)}
			>
				<div className="w-px bg-border/70 dark:bg-border/60" />
			</div>

			{activity.type === "comment" ? (
				<>
					<Avatar className="relative size-6 flex-none">
						<AvatarImage
							src={(activity as CommentActivity).imageUrl}
							alt={(activity as CommentActivity).person.name}
						/>
						<AvatarFallback className="bg-muted text-muted-foreground">
							{getInitials((activity as CommentActivity).person.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-border/40 align-middle">
						<div className="flex justify-between gap-x-4">
							<div className="py-0.5 text-xs text-muted-foreground">
								<span className="font-medium text-foreground">
									{(activity as CommentActivity).person.name}
								</span>{" "}
								commented
							</div>
							<span className="flex-none py-0.5 text-xs text-muted-foreground">
								{(activity as CommentActivity).date}
							</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{(activity as CommentActivity).comment}
						</p>
					</div>
				</>
			) : (
				<>
					<div className="relative flex size-6 flex-none items-center justify-center">
						{activity.type === "invoice_paid" ? (
							<CheckCircleIcon
								aria-hidden="true"
								className="size-5 text-indigo-500"
							/>
						) : Icon ? (
							<Icon
								aria-hidden="true"
								className="size-4 text-muted-foreground"
							/>
						) : (
							<div className="size-1.5 rounded-full bg-foreground/10 ring ring-border/40" />
						)}
					</div>
					<p className="flex-auto py-0.5 text-xs text-muted-foreground">
						<span className="font-medium text-foreground">
							{activity.person.name}
						</span>{" "}
						{describeEvent(activity)}
					</p>
					<span className="flex-none py-0.5 text-xs text-muted-foreground">
						{activity.date}
					</span>
				</>
			)}
		</li>
	);
}
