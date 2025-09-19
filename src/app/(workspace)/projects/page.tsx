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
import {
	ChevronLeft,
	ChevronRight,
	FolderKanban,
	ExternalLink,
	Plus,
	FolderOpen,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";

// Enhanced project type that includes client information for display
type ProjectWithClient = Doc<"projects"> & {
	client?: Doc<"clients">;
};

const statusVariant = (status: Doc<"projects">["status"]) => {
	switch (status) {
		case "completed":
			return "default" as const;
		case "in-progress":
			return "secondary" as const;
		case "cancelled":
			return "destructive" as const;
		case "planned":
			return "outline" as const;
		default:
			return "outline" as const;
	}
};

const formatStatus = (status: Doc<"projects">["status"]) => {
	switch (status) {
		case "in-progress":
			return "In Progress";
		case "completed":
			return "Completed";
		case "cancelled":
			return "Cancelled";
		case "planned":
			return "Planned";
		default:
			return status;
	}
};

const createColumns = (
	router: ReturnType<typeof useRouter>,
	onDelete: (id: string, name: string) => void
): ColumnDef<ProjectWithClient>[] => [
	{
		accessorKey: "title",
		header: "Project",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium text-foreground">
					{row.original.title}
				</span>
				<span className="text-muted-foreground text-xs">
					Client: {row.original.client?.companyName || "Unknown Client"}
				</span>
			</div>
		),
	},
	{
		accessorKey: "projectType",
		header: "Type",
		cell: ({ row }) => (
			<span className="text-foreground capitalize">
				{row.original.projectType}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={statusVariant(row.original.status)}>
				{formatStatus(row.original.status)}
			</Badge>
		),
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const startDate = row.original.startDate;
			if (!startDate)
				return <span className="text-muted-foreground">Not set</span>;
			const d = new Date(startDate);
			return <span className="text-foreground">{d.toLocaleDateString()}</span>;
		},
	},
	{
		accessorKey: "_creationTime",
		header: "Created",
		cell: ({ row }) => {
			const d = new Date(row.original._creationTime);
			return <span className="text-foreground">{d.toLocaleDateString()}</span>;
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Button
					intent="outline"
					size="sq-sm"
					onPress={() => router.push(`/projects/${row.original._id}`)}
					aria-label={`View project ${row.original.title}`}
				>
					<ExternalLink className="size-4" />
				</Button>
				<Button
					intent="outline"
					size="sq-sm"
					onPress={() => onDelete(row.original._id, row.original.title)}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
					aria-label={`Delete project ${row.original.title}`}
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		),
	},
];

export default function ProjectsPage() {
	const router = useRouter();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [query, setQuery] = React.useState("");
	const pageSize = 10;
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const deleteProject = useMutation(api.projects.remove);

	// Fetch projects and clients from Convex
	const projects = useQuery(api.projects.list, {});
	const clients = useQuery(api.clients.list, {});
	const projectStats = useQuery(api.projects.getStats, {});

	// Enhanced projects with client information
	const data = React.useMemo((): ProjectWithClient[] => {
		if (!projects || !clients) return [];

		return projects.map((project) => ({
			...project,
			client: clients.find((client) => client._id === project.clientId),
		}));
	}, [projects, clients]);

	// Loading state
	const isLoading = projects === undefined || clients === undefined;

	// Empty state
	const isEmpty = !isLoading && data.length === 0;

	const handleDelete = (id: string, name: string) => {
		setProjectToDelete({ id, name });
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (projectToDelete) {
			try {
				await deleteProject({ id: projectToDelete.id as Id<"projects"> });
				setDeleteModalOpen(false);
				setProjectToDelete(null);
			} catch (error) {
				console.error("Failed to delete project:", error);
			}
		}
	};

	const table = useReactTable({
		data,
		columns: createColumns(router, handleDelete),
		state: {
			sorting,
			columnFilters,
			globalFilter: query,
			pagination: { pageIndex: 0, pageSize },
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setQuery,
		globalFilterFn: (row, columnId, value) => {
			// If no search value, show all rows
			if (!value || value.trim() === "") return true;

			const search = value.toLowerCase().trim();
			const project = row.original;

			// Search in project title
			if (project.title && project.title.toLowerCase().includes(search))
				return true;

			// Search in project type
			if (
				project.projectType &&
				project.projectType.toLowerCase().includes(search)
			)
				return true;

			// Search in project status
			if (project.status && project.status.toLowerCase().includes(search))
				return true;

			// Search in client company name
			if (
				project.client?.companyName &&
				project.client.companyName.toLowerCase().includes(search)
			)
				return true;

			return false;
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	React.useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	return (
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
				<button
					onClick={() => router.push("/projects/new")}
					className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
				>
					<Plus className="h-4 w-4" />
					Create Project
					<span
						aria-hidden="true"
						className="group-hover:translate-x-1 transition-transform duration-200"
					>
						→
					</span>
				</button>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{[...Array(3)].map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
								<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
							</CardHeader>
							<CardContent>
								<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="flex items-center gap-2 text-base">
								<FolderKanban className="size-4" /> Total Projects
							</CardTitle>
							<CardDescription>All projects in your workspace</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10">
							<div className="text-3xl font-semibold">
								{projectStats?.total || data.length}
							</div>
						</CardContent>
					</Card>
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-base">In Progress</CardTitle>
							<CardDescription>Currently active projects</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10">
							<div className="text-3xl font-semibold">
								{projectStats?.byStatus["in-progress"] ||
									data.filter((p) => p.status === "in-progress").length}
							</div>
						</CardContent>
					</Card>
					<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-base">Completed</CardTitle>
							<CardDescription>Finished projects</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10">
							<div className="text-3xl font-semibold">
								{projectStats?.byStatus.completed ||
									data.filter((p) => p.status === "completed").length}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
				<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
				<CardHeader className="relative z-10 flex flex-col gap-2 border-b">
					<div className="flex items-center justify-between gap-3">
						<div>
							<CardTitle>Projects</CardTitle>
							<CardDescription>
								Search, sort, and browse your projects
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Input
								placeholder="Search projects, clients, or status..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-96"
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className="relative z-10 px-0">
					{isLoading ? (
						<div className="px-6">
							<div className="space-y-4">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex items-center space-x-4 p-4">
										<div className="flex-1 space-y-2">
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
											<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
										</div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
										<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									</div>
								))}
							</div>
						</div>
					) : isEmpty ? (
						<div className="px-6 py-12 text-center">
							<div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
								<FolderOpen className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								No projects yet
							</h3>
							<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
								Get started by creating your first project. Projects help you
								organize work and track progress.
							</p>
							<button
								onClick={() => router.push("/projects/new")}
								className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
							>
								<Plus className="h-4 w-4" />
								Create Your First Project
								<span
									aria-hidden="true"
									className="group-hover:translate-x-1 transition-transform duration-200"
								>
									→
								</span>
							</button>
						</div>
					) : (
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
													colSpan={createColumns(router, handleDelete).length}
													className="h-24 text-center"
												>
													No projects match your search.
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
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Modal */}
			{projectToDelete && (
				<DeleteConfirmationModal
					isOpen={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					title="Delete Project"
					itemName={projectToDelete.name}
					itemType="Project"
				/>
			)}
		</div>
	);
}
