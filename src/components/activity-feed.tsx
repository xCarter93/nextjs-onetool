"use client";

import { useState } from "react";
import ActivityItem from "./activity-item";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ScrollArea } from "./ui/scroll-area";

// Sample activity data - this would typically come from props or a data source
const activity = [
	{
		id: 1,
		type: "client_created" as const,
		person: { name: "Sarah Johnson", href: "/clients/1" },
		imageUrl:
			"https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
		clientName: "Acme Plumbing Services",
		date: "2h ago",
	},
	{
		id: 2,
		type: "project_created" as const,
		person: { name: "Mike Chen", href: "/users/2" },
		projectName: "Bathroom Renovation",
		clientName: "Downtown Apartments",
		date: "4h ago",
	},
	{
		id: 3,
		type: "quote_created" as const,
		person: { name: "Sarah Johnson", href: "/users/1" },
		quoteAmount: "$2,450.00",
		clientName: "Green Valley Homes",
		date: "6h ago",
	},
	{
		id: 4,
		type: "quote_approved" as const,
		person: { name: "David Rodriguez", href: "/users/3" },
		quoteAmount: "$1,890.00",
		clientName: "Riverside Condos",
		date: "1d ago",
	},
	{
		id: 5,
		type: "invoice_sent" as const,
		person: { name: "Sarah Johnson", href: "/users/1" },
		invoiceAmount: "$3,200.00",
		clientName: "Oakwood Construction",
		date: "1d ago",
	},
	{
		id: 6,
		type: "invoice_paid" as const,
		person: { name: "Mike Chen", href: "/users/2" },
		invoiceAmount: "$1,450.00",
		clientName: "Maple Street Properties",
		date: "2d ago",
	},
	{
		id: 7,
		type: "project_updated" as const,
		person: { name: "David Rodriguez", href: "/users/3" },
		projectName: "Kitchen Remodel",
		status: "Completed",
		date: "3d ago",
	},
	{
		id: 8,
		type: "client_updated" as const,
		person: { name: "Sarah Johnson", href: "/users/1" },
		clientName: "Sunset Realty",
		action: "Updated contact information",
		date: "4d ago",
	},
	{
		id: 9,
		type: "quote_sent" as const,
		person: { name: "Mike Chen", href: "/users/2" },
		quoteAmount: "$5,670.00",
		clientName: "Elite Developments",
		date: "5d ago",
	},
	{
		id: 10,
		type: "project_created" as const,
		person: { name: "David Rodriguez", href: "/users/3" },
		projectName: "HVAC System Installation",
		clientName: "Mountain View Resort",
		date: "6d ago",
	},
];

type TimeFilter = "1d" | "3d" | "7d" | "2w";

interface ActivityFeedProps {
	activities?: typeof activity;
}

export default function ActivityFeed({
	activities = activity,
}: ActivityFeedProps) {
	const [selectedFilter, setSelectedFilter] = useState<TimeFilter>("7d");

	// TODO: Implement filtering logic based on selectedFilter
	// For now, just show all activities

	return (
		<div className="space-y-3">
			{/* Compact Activity Feed Header */}
			<div className="flex items-start justify-between mb-8">
				<h3 className="text-base font-semibold text-foreground">
					Recent Activity
				</h3>
				<ToggleGroup
					size="sm"
					selectedKeys={new Set([selectedFilter])}
					onSelectionChange={(keys) => {
						const selectedKey = Array.from(keys)[0];
						if (selectedKey) setSelectedFilter(selectedKey as TimeFilter);
					}}
					className="bg-muted/60 dark:bg-muted/60 backdrop-blur-sm rounded-md p-0.5 border border-border/60 shadow-xs ring-1 ring-border/20"
				>
					<ToggleGroupItem id="1d">1d</ToggleGroupItem>
					<ToggleGroupItem id="3d">3d</ToggleGroupItem>
					<ToggleGroupItem id="7d">7d</ToggleGroupItem>
					<ToggleGroupItem id="2w">2w</ToggleGroupItem>
				</ToggleGroup>
			</div>

			{/* Compact List */}
			<ScrollArea className="h-96">
				<ul role="list" className="space-y-3 pr-4">
					{activities.map((activityItem, activityItemIdx) => (
						<ActivityItem
							key={activityItem.id}
							activity={activityItem}
							isLast={activityItemIdx === activities.length - 1}
						/>
					))}
				</ul>
			</ScrollArea>
		</div>
	);
}
