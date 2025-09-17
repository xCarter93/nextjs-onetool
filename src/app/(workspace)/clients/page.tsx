"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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
import {
	ChevronLeft,
	ChevronRight,
	Users,
	ExternalLink,
	Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Client = {
	id: string;
	name: string;
	industry: string;
	location: string;
	activeProjects: number;
	lastActivity: string; // ISO date or friendly string
	status: "Active" | "Prospect" | "Paused";
};

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

const createColumns = (
	router: ReturnType<typeof useRouter>,
	toast: ReturnType<typeof useToast>
): ColumnDef<Client>[] => [
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
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Button
				intent="outline"
				size="sq-sm"
				onPress={() => {
					router.push(`/clients/${row.original.id}`);
					toast.info(
						"Opening Client",
						`Viewing details for ${row.original.name}`
					);
				}}
				aria-label={`View client ${row.original.name}`}
			>
				<ExternalLink className="size-4" />
			</Button>
		),
	},
];

export default function ClientsPage() {
	const router = useRouter();
	const toast = useToast();

	// Fetch clients with project counts from Convex
	const convexClients = useQuery(api.clients.listWithProjectCounts, {});
	const clientsStats = useQuery(api.clients.getStats, {});

	// Transform the data to match our Client type
	const data = React.useMemo(() => {
		if (!convexClients) return [];
		return convexClients;
	}, [convexClients]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [globalQuery, setGlobalQuery] = React.useState("");
	const pageSize = 10;

	const table = useReactTable({
		data,
		columns: createColumns(router, toast),
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

	// Loading state
	if (convexClients === undefined || clientsStats === undefined) {
		return (
			<div className="relative p-6 space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
						<div>
							<h1 className="text-2xl font-bold text-foreground">Clients</h1>
							<p className="text-muted-foreground text-sm">
								Loading clients...
							</p>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardHeader>
								<div className="h-4 bg-muted rounded animate-pulse" />
							</CardHeader>
							<CardContent>
								<div className="h-8 bg-muted rounded animate-pulse" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
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
				<button
					onClick={() => router.push("/clients/new")}
					className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
				>
					<Plus className="h-4 w-4" />
					Add Client
					<span
						aria-hidden="true"
						className="group-hover:translate-x-1 transition-transform duration-200"
					>
						→
					</span>
				</button>
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
						<div className="text-3xl font-semibold">{clientsStats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Active</CardTitle>
						<CardDescription>Currently engaged clients</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">
							{clientsStats.byStatus.active}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Prospects</CardTitle>
						<CardDescription>Potential clients</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">
							{clientsStats.byStatus.prospect}
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
												colSpan={createColumns(router, toast).length}
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
	);
}
