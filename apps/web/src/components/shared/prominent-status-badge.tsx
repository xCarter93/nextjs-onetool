import {
	CheckCircleIcon,
	ClockIcon,
	XCircleIcon,
	ExclamationCircleIcon,
	PaperAirplaneIcon,
	BanknotesIcon,
	DocumentCheckIcon,
} from "@heroicons/react/24/solid";

type StatusSize = "default" | "large" | "xl";
type EntityType = "client" | "project" | "quote" | "invoice" | "task";

interface ProminentStatusBadgeProps {
	status: string;
	size?: StatusSize;
	showIcon?: boolean;
	entityType?: EntityType;
	className?: string;
}

const getStatusIcon = (status: string) => {
	const iconClass = "shrink-0";

	// Map common statuses to icons
	switch (status.toLowerCase()) {
		case "active":
		case "completed":
		case "approved":
			return <CheckCircleIcon className={iconClass} />;
		case "sent":
			return <PaperAirplaneIcon className={iconClass} />;
		case "paid":
			return <BanknotesIcon className={iconClass} />;
		case "pending":
		case "draft":
		case "planned":
			return <ClockIcon className={iconClass} />;
		case "declined":
		case "cancelled":
		case "archived":
			return <XCircleIcon className={iconClass} />;
		case "overdue":
		case "expired":
			return <ExclamationCircleIcon className={iconClass} />;
		case "in-progress":
			return <ClockIcon className={iconClass} />;
		case "prospect":
		case "lead":
			return <DocumentCheckIcon className={iconClass} />;
		default:
			return <ClockIcon className={iconClass} />;
	}
};

const getStatusColor = (status: string) => {
	const statusLower = status.toLowerCase();

	// Color mapping based on status
	switch (statusLower) {
		case "active":
		case "completed":
		case "paid":
		case "approved":
			return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
		case "in-progress":
		case "sent":
			return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
		case "pending":
		case "draft":
		case "planned":
			return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
		case "prospect":
		case "lead":
			return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
		case "cancelled":
		case "declined":
		case "archived":
		case "inactive":
			return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
		case "overdue":
		case "expired":
			return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
		default:
			return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
	}
};

const getSizeClasses = (size: StatusSize, showIcon: boolean) => {
	switch (size) {
		case "xl":
			return {
				container: "px-6 py-3 text-lg font-bold border-2 rounded-xl shadow-lg",
				icon: showIcon ? "w-7 h-7 mr-3" : "",
			};
		case "large":
			return {
				container:
					"px-4 py-2 text-base font-semibold border-2 rounded-lg shadow-md",
				icon: showIcon ? "w-5 h-5 mr-2" : "",
			};
		case "default":
		default:
			return {
				container: "px-3 py-1.5 text-sm font-medium border rounded-md",
				icon: showIcon ? "w-4 h-4 mr-1.5" : "",
			};
	}
};

const formatStatusText = (status: string) => {
	// Convert status to proper case
	return status
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export function ProminentStatusBadge({
	status,
	size = "default",
	showIcon = true,
	className = "",
}: ProminentStatusBadgeProps) {
	const colorClasses = getStatusColor(status);
	const sizeClasses = getSizeClasses(size, showIcon);
	const icon = showIcon ? getStatusIcon(status) : null;

	return (
		<div
			className={`inline-flex items-center justify-center ${sizeClasses.container} ${colorClasses} ${className}`}
		>
			{icon && <span className={sizeClasses.icon}>{icon}</span>}
			<span>{formatStatusText(status)}</span>
		</div>
	);
}
