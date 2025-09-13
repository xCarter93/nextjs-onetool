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
import { ChevronLeft, ChevronRight, FolderKanban } from "lucide-react";

type Project = {
	id: string;
	name: string;
	client: string;
	owner: string;
	status: "Planned" | "In Progress" | "Blocked" | "Completed";
	budget: string; // display only for now
	updatedAt: string; // ISO
};

const sampleProjects: Project[] = [
	{
		id: "p_1001",
		name: "Website Redesign",
		client: "Acme Corporation",
		owner: "Pat Carter",
		status: "In Progress",
		budget: "$120,000",
		updatedAt: "2025-09-11",
	},
	{
		id: "p_1002",
		name: "Payment Gateway Migration",
		client: "Globex Ltd",
		owner: "Ada Lovelace",
		status: "Planned",
		budget: "$80,000",
		updatedAt: "2025-09-08",
	},
	{
		id: "p_1003",
		name: "Mobile App MVP",
		client: "Initech",
		owner: "Grace Hopper",
		status: "Blocked",
		budget: "$60,000",
		updatedAt: "2025-09-07",
	},
	{
		id: "p_1004",
		name: "Data Warehouse Setup",
		client: "Umbrella Health",
		owner: "Linus Torvalds",
		status: "Completed",
		budget: "$200,000",
		updatedAt: "2025-09-01",
	},
];

const statusVariant = (status: Project["status"]) => {
	switch (status) {
		case "Completed":
			return "default" as const;
		case "In Progress":
			return "secondary" as const;
		case "Blocked":
			return "destructive" as const;
		case "Planned":
			return "outline" as const;
		default:
			return "outline" as const;
	}
};

const columns: ColumnDef<Project>[] = [
	{
		accessorKey: "name",
		header: "Project",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium text-foreground">{row.original.name}</span>
				<span className="text-muted-foreground text-xs">
					Client: {row.original.client}
				</span>
			</div>
		),
	},
	{
		accessorKey: "owner",
		header: "Owner",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.owner}</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={statusVariant(row.original.status)}>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "budget",
		header: "Budget",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.budget}</span>
		),
	},
	{
		accessorKey: "updatedAt",
		header: "Updated",
		cell: ({ row }) => {
			const d = new Date(row.original.updatedAt);
			return (
				<span className="text-foreground">
					{isNaN(d.getTime()) ? row.original.updatedAt : d.toLocaleDateString()}
				</span>
			);
		},
	},
];

export default function ProjectsPage() {
	const [data] = React.useState<Project[]>(sampleProjects);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [query, setQuery] = React.useState("");
	const pageSize = 10;

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter: query,
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
		table.getColumn("name")?.setFilterValue(query);
		table.getColumn("owner")?.setFilterValue(query);
		table.getColumn("status")?.setFilterValue(query);
		table.getColumn("budget")?.setFilterValue(query);
	}, [query, table]);

	const totalInProgress = React.useMemo(
		() => data.filter((p) => p.status === "In Progress").length,
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
								<h1 className="text-2xl font-bold text-foreground">Projects</h1>
								<p className="text-muted-foreground text-sm">
									Overview of your projects
								</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<FolderKanban className="size-4" /> Total Projects
								</CardTitle>
								<CardDescription>
									All projects in your workspace
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">{data.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">In Progress</CardTitle>
								<CardDescription>Currently active projects</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">{totalInProgress}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Completed</CardTitle>
								<CardDescription>Finished projects</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold">
									{data.filter((p) => p.status === "Completed").length}
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader className="flex flex-col gap-2 border-b">
							<div className="flex items-center justify-between gap-3">
								<div>
									<CardTitle>Projects</CardTitle>
									<CardDescription>
										Search, sort, and browse your projects
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Input
										placeholder="Search projects..."
										value={query}
										onChange={(e) => setQuery(e.target.value)}
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
										projects
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
