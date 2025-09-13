"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

type Client = {
	id: string;
	name: string;
	industry: string;
	location: string;
	activeProjects: number;
	lastActivity: string; // ISO date or friendly string
	status: "Active" | "Prospect" | "Paused";
};

const sampleClients: Client[] = [
	{
		id: "c_001",
		name: "Acme Corporation",
		industry: "Manufacturing",
		location: "Denver, CO",
		activeProjects: 4,
		lastActivity: "2025-09-10",
		status: "Active",
	},
	{
		id: "c_002",
		name: "Globex Ltd",
		industry: "FinTech",
		location: "Austin, TX",
		activeProjects: 2,
		lastActivity: "2025-09-12",
		status: "Prospect",
	},
	{
		id: "c_003",
		name: "Initech",
		industry: "Software",
		location: "San Jose, CA",
		activeProjects: 6,
		lastActivity: "2025-09-09",
		status: "Active",
	},
	{
		id: "c_004",
		name: "Umbrella Health",
		industry: "Healthcare",
		location: "Boston, MA",
		activeProjects: 1,
		lastActivity: "2025-09-01",
		status: "Paused",
	},
	{
		id: "c_005",
		name: "Wayne Enterprises",
		industry: "Defense",
		location: "Gotham, NJ",
		activeProjects: 3,
		lastActivity: "2025-09-11",
		status: "Active",
	},
];

const statusToBadgeVariant = (status: Client["status"]) => {
	switch (status) {
		case "Active":
			return "default" as const;
		case "Prospect":
			return "secondary" as const;
		case "Paused":
			return "outline" as const;
		default:
			return "outline" as const;
	}
};

const columns: ColumnDef<Client>[] = [
	{
		accessorKey: "name",
		header: () => <div className="flex items-center gap-1">Name</div>,
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium text-foreground">{row.original.name}</span>
				<span className="text-muted-foreground text-xs">
					{row.original.location}
				</span>
			</div>
		),
	},
	{
		accessorKey: "industry",
		header: "Industry",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.industry}</span>
		),
	},
	{
		accessorKey: "activeProjects",
		header: "Active Projects",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.activeProjects}</span>
		),
	},
	{
		accessorKey: "lastActivity",
		header: "Last Activity",
		cell: ({ row }) => {
			const date = new Date(row.original.lastActivity);
			return (
				<span className="text-foreground">
					{isNaN(date.getTime())
						? row.original.lastActivity
						: date.toLocaleDateString()}
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={statusToBadgeVariant(row.original.status)}>
				{row.original.status}
			</Badge>
		),
	},
];

export default function ClientsPage() {
	const [data] = React.useState<Client[]>(sampleClients);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [globalQuery, setGlobalQuery] = React.useState("");
	const pageSize = 10;

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter: globalQuery,
			pagination: { pageIndex: 0, pageSize },
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	React.useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	React.useEffect(() => {
		// Basic global filtering across name, industry, location
		const nameCol = table.getColumn("name");
		const industryCol = table.getColumn("industry");
		// Apply simple text filter to name and industry columns; location is displayed under name.
		nameCol?.setFilterValue(globalQuery);
		industryCol?.setFilterValue(globalQuery);
	}, [globalQuery, table]);

	const totalActive = React.useMemo(
		() => data.filter((d) => d.status === "Active").length,
		[data]
	);

	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] md:min-h-min rounded-xl">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.08),transparent_50%)] rounded-xl" />
				<div className="relative p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
							<div>
								<h1 className="text-2xl font-bold text-foreground">Clients</h1>
								<p className="text-muted-foreground text-sm">
									Overview of your clients
								</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Users className="size-4" /> Total Clients
								</CardTitle>
								<CardDescription>All clients in your workspace</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">{data.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Active</CardTitle>
								<CardDescription>Currently engaged clients</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">{totalActive}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Prospects</CardTitle>
								<CardDescription>Potential clients</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">
									{data.filter((d) => d.status === "Prospect").length}
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader className="flex flex-col gap-2 border-b">
							<div className="flex items-center justify-between gap-3">
								<div>
									<CardTitle>Clients</CardTitle>
									<CardDescription>
										Search, sort, and browse your client list
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Input
										placeholder="Search clients..."
										value={globalQuery}
										onChange={(e) => setGlobalQuery(e.target.value)}
										className="w-56"
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="px-0">
							<div className="px-6">
								<div className="overflow-hidden rounded-lg border">
									<Table>
										<TableHeader className="bg-muted sticky top-0 z-10">
											{table.getHeaderGroups().map((headerGroup) => (
												<TableRow key={headerGroup.id}>
													{headerGroup.headers.map((header) => (
														<TableHead key={header.id}>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																	)}
														</TableHead>
													))}
												</TableRow>
											))}
										</TableHeader>
										<TableBody>
											{table.getRowModel().rows?.length ? (
												table.getRowModel().rows.map((row) => (
													<TableRow
														key={row.id}
														data-state={row.getIsSelected() && "selected"}
													>
														{row.getVisibleCells().map((cell) => (
															<TableCell key={cell.id}>
																{flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext()
																)}
															</TableCell>
														))}
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={columns.length}
														className="h-24 text-center"
													>
														No results.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
								<div className="flex items-center justify-between py-4">
									<div className="text-muted-foreground text-sm">
										{table.getFilteredRowModel().rows.length} of {data.length}{" "}
										clients
									</div>
									<div className="flex items-center gap-2">
										<Button
											intent="outline"
											size="sq-sm"
											onPress={() => table.previousPage()}
											isDisabled={!table.getCanPreviousPage()}
											aria-label="Previous page"
										>
											<ChevronLeft className="size-4" />
										</Button>
										<div className="text-sm font-medium">
											Page {table.getState().pagination?.pageIndex + 1} of{" "}
											{table.getPageCount()}
										</div>
										<Button
											intent="outline"
											size="sq-sm"
											onPress={() => table.nextPage()}
											isDisabled={!table.getCanNextPage()}
											aria-label="Next page"
										>
											<ChevronRight className="size-4" />
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
