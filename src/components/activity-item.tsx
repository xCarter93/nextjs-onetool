import { Fragment } from "react";
import Link from "next/link";
// Icons no longer needed - using initials instead
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

export default function ActivityItem({ activity, isLast }: ActivityItemProps) {
	return (
		<li>
			<div className="relative pb-8">
				{!isLast ? (
					<span
						aria-hidden="true"
						className="absolute top-5 left-5 -ml-px h-full w-1.5 bg-border/80 dark:bg-border/80"
					/>
				) : null}
				<div className="relative flex items-start space-x-3">
					{activity.type === "comment" ? (
						<CommentActivityItem activity={activity} />
					) : activity.type === "assignment" ? (
						<AssignmentActivityItem activity={activity} />
					) : activity.type === "tags" ? (
						<TagsActivityItem activity={activity} />
					) : activity.type === "client_created" ? (
						<ClientCreatedActivityItem activity={activity} />
					) : activity.type === "project_created" ? (
						<ProjectCreatedActivityItem activity={activity} />
					) : activity.type === "project_updated" ? (
						<ProjectUpdatedActivityItem activity={activity} />
					) : activity.type === "client_updated" ? (
						<ClientUpdatedActivityItem activity={activity} />
					) : activity.type === "quote_created" ? (
						<QuoteCreatedActivityItem activity={activity} />
					) : activity.type === "quote_approved" ? (
						<QuoteApprovedActivityItem activity={activity} />
					) : activity.type === "quote_sent" ? (
						<QuoteSentActivityItem activity={activity} />
					) : activity.type === "invoice_sent" ? (
						<InvoiceSentActivityItem activity={activity} />
					) : activity.type === "invoice_paid" ? (
						<InvoicePaidActivityItem activity={activity} />
					) : null}
				</div>
			</div>
		</li>
	);
}

function CommentActivityItem({ activity }: { activity: CommentActivity }) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarImage src={activity.imageUrl} alt={activity.person.name} />
					<AvatarFallback className="bg-muted text-muted-foreground">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Commented {activity.date}
					</p>
				</div>
				<div className="mt-2 text-sm text-foreground">
					<p>{activity.comment}</p>
				</div>
			</div>
		</>
	);
}

function AssignmentActivityItem({
	activity,
}: {
	activity: AssignmentActivity;
}) {
	return (
		<>
			<div className="flex-shrink-0">
				<div className="relative px-1">
					<Avatar className="size-8">
						<AvatarFallback className="bg-muted text-muted-foreground">
							{getInitials(activity.person.name)}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<div className="min-w-0 flex-1 py-1.5">
				<div className="text-sm text-muted-foreground">
					<Link
						href={activity.person.href}
						className="font-medium text-foreground hover:text-muted-foreground"
					>
						{activity.person.name}
					</Link>{" "}
					assigned{" "}
					<Link
						href={activity.assigned.href}
						className="font-medium text-foreground hover:text-muted-foreground"
					>
						{activity.assigned.name}
					</Link>{" "}
					<span className="whitespace-nowrap">{activity.date}</span>
				</div>
			</div>
		</>
	);
}

function TagsActivityItem({ activity }: { activity: TagsActivity }) {
	return (
		<>
			<div className="flex-shrink-0">
				<div className="relative px-1">
					<Avatar className="size-8">
						<AvatarFallback className="bg-muted text-muted-foreground">
							{getInitials(activity.person.name)}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<div className="min-w-0 flex-1 py-0">
				<div className="text-sm/8 text-muted-foreground">
					<span className="mr-0.5">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>{" "}
						added tags
					</span>{" "}
					<span className="mr-0.5">
						{activity.tags.map((tag) => (
							<Fragment key={tag.name}>
								<Link
									href={tag.href}
									className="inline-flex items-center gap-x-1.5 rounded-full bg-muted/50 px-2 py-1 text-xs font-medium text-foreground ring-1 ring-border/20 hover:bg-muted transition-colors"
								>
									<svg
										viewBox="0 0 6 6"
										aria-hidden="true"
										className={classNames(tag.color, "size-1.5")}
									>
										<circle r={3} cx={3} cy={3} />
									</svg>
									{tag.name}
								</Link>{" "}
							</Fragment>
						))}
					</span>
					<span className="whitespace-nowrap">{activity.date}</span>
				</div>
			</div>
		</>
	);
}

function ClientCreatedActivityItem({
	activity,
}: {
	activity: ClientCreatedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarImage src={activity.imageUrl} alt={activity.person.name} />
					<AvatarFallback className="bg-muted text-muted-foreground">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Created client{" "}
						<span className="font-medium text-foreground">
							{activity.clientName}
						</span>
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function ProjectCreatedActivityItem({
	activity,
}: {
	activity: ProjectCreatedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-green-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Created project{" "}
						<span className="font-medium text-foreground">
							&ldquo;{activity.projectName}&rdquo;
						</span>{" "}
						for {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function ProjectUpdatedActivityItem({
	activity,
}: {
	activity: ProjectUpdatedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-blue-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Updated project{" "}
						<span className="font-medium text-foreground">
							&ldquo;{activity.projectName}&rdquo;
						</span>{" "}
						to {activity.status}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function ClientUpdatedActivityItem({
	activity,
}: {
	activity: ClientUpdatedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-orange-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						{activity.action} for{" "}
						<span className="font-medium text-foreground">
							{activity.clientName}
						</span>
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function QuoteCreatedActivityItem({
	activity,
}: {
	activity: QuoteCreatedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-purple-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Created quote for{" "}
						<span className="font-medium text-foreground">
							{activity.quoteAmount}
						</span>{" "}
						with {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function QuoteApprovedActivityItem({
	activity,
}: {
	activity: QuoteApprovedActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-green-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Quote approved for{" "}
						<span className="font-medium text-foreground">
							{activity.quoteAmount}
						</span>{" "}
						by {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function QuoteSentActivityItem({ activity }: { activity: QuoteSentActivity }) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-blue-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Sent quote for{" "}
						<span className="font-medium text-foreground">
							{activity.quoteAmount}
						</span>{" "}
						to {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function InvoiceSentActivityItem({
	activity,
}: {
	activity: InvoiceSentActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-indigo-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Sent invoice for{" "}
						<span className="font-medium text-foreground">
							{activity.invoiceAmount}
						</span>{" "}
						to {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}

function InvoicePaidActivityItem({
	activity,
}: {
	activity: InvoicePaidActivity;
}) {
	return (
		<>
			<div className="relative flex-shrink-0">
				<Avatar className="size-10">
					<AvatarFallback className="bg-emerald-500 text-white">
						{getInitials(activity.person.name)}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="min-w-0 flex-1">
				<div>
					<div className="text-sm">
						<Link
							href={activity.person.href}
							className="font-medium text-foreground hover:text-muted-foreground"
						>
							{activity.person.name}
						</Link>
					</div>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Invoice paid for{" "}
						<span className="font-medium text-foreground">
							{activity.invoiceAmount}
						</span>{" "}
						by {activity.clientName}
					</p>
				</div>
				<div className="mt-1 text-sm text-muted-foreground">
					{activity.date}
				</div>
			</div>
		</>
	);
}
