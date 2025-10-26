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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
	Trash2,
	RotateCcw,
	Archive,
	Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { StyledButton } from "@/components/ui/styled-button";
import { CsvImportModal } from "@/components/csv-import-modal";
import { useCanPerformAction } from "@/hooks/use-feature-access";
import { AlertCircle } from "lucide-react";

type Client = {
	id: string;
	name: string;
	industry: string;
	location: string;
	activeProjects: number;
	lastActivity: string; // ISO date or friendly string
	status: "Active" | "Prospect" | "Paused" | "Archived";
	primaryContact: {
		name: string;
		email: string;
		jobTitle: string;
	} | null;
};

const statusToBadgeVariant = (status: Client["status"]) => {
	switch (status) {
		case "Active":
			return "default" as const;
		case "Prospect":
			return "secondary" as const;
		case "Paused":
			return "outline" as const;
		case "Archived":
			return "outline" as const;
		default:
			return "outline" as const;
	}
};

const createColumns = (
	router: ReturnType<typeof useRouter>,
	toast: ReturnType<typeof useToast>,
	onDelete: (id: string, name: string) => void,
	onRestore?: (id: string, name: string) => void,
	isArchivedTab?: boolean
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
		accessorKey: "primaryContact",
		header: "Primary Contact",
		cell: ({ row }) => (
			<div className="flex flex-col">
				{row.original.primaryContact ? (
					<>
						<span className="font-medium text-foreground">
							{row.original.primaryContact.name}
						</span>
						<span className="text-muted-foreground text-xs">
							{row.original.primaryContact.email}
						</span>
					</>
				) : (
					<span className="text-muted-foreground text-sm">No contact</span>
				)}
			</div>
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
			<div className="flex items-center gap-2">
				<Button
					intent="outline"
					size="sq-sm"
					onPress={() => {
						router.push(`/clients/${row.original.id}`);
					}}
					aria-label={`View client ${row.original.name}`}
				>
					<ExternalLink className="size-4" />
				</Button>

				{isArchivedTab && onRestore ? (
					<Button
						intent="outline"
						size="sq-sm"
						onPress={() => onRestore(row.original.id, row.original.name)}
						className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
						aria-label={`Restore client ${row.original.name}`}
					>
						<RotateCcw className="size-4" />
					</Button>
				) : (
					<Button
						intent="outline"
						size="sq-sm"
						onPress={() => onDelete(row.original.id, row.original.name)}
						className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
						aria-label={`Archive client ${row.original.name}`}
					>
						<Trash2 className="size-4" />
					</Button>
				)}
			</div>
		),
	},
];

export default function ClientsPage() {
	const router = useRouter();
	const toast = useToast();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [importModalOpen, setImportModalOpen] = useState(false);
	const [clientToDelete, setClientToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [activeTab, setActiveTab] = useState("active");

	// Check if user can create new clients
	const { canPerform, reason, currentUsage, limit } =
		useCanPerformAction("create_client");

	const handleAddClient = () => {
		if (!canPerform) {
			toast.toast({
				title: "Upgrade Required",
				description: reason || "You've reached your client limit",
				variant: "destructive",
			});
			return;
		}
		router.push("/clients/new");
	};

	const archiveClient = useMutation(api.clients.archive);
	const restoreClient = useMutation(api.clients.restore);

	// Fetch clients with project counts from Convex
	const convexClients = useQuery(api.clients.listWithProjectCounts, {});
	const archivedClients = useQuery(api.clients.listWithProjectCounts, {
		status: "archived" as const,
		includeArchived: true,
	});
	const clientsStats = useQuery(api.clients.getStats, {});

	// Transform the data to match our Client type
	const activeData = React.useMemo(() => {
		if (!convexClients) return [];
		return convexClients;
	}, [convexClients]);

	const archivedData = React.useMemo(() => {
		if (!archivedClients) return [];
		return archivedClients;
	}, [archivedClients]);

	const isActiveEmpty = activeData.length === 0;
	const isArchivedEmpty = archivedData.length === 0;
	const currentData = activeTab === "active" ? activeData : archivedData;
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [globalQuery, setGlobalQuery] = React.useState("");
	const pageSize = 10;

	const handleDelete = (id: string, name: string) => {
		setClientToDelete({ id, name });
		setDeleteModalOpen(true);
	};

	const handleRestore = async (id: string, name: string) => {
		try {
			await restoreClient({ id: id as Id<"clients"> });
			toast.success(
				"Client Restored",
				`${name} has been restored and is now active.`
			);
		} catch (error) {
			console.error("Failed to restore client:", error);
			toast.error(
				"Restore Failed",
				"Failed to restore the client. Please try again."
			);
		}
	};

	const confirmDelete = async () => {
		if (clientToDelete) {
			try {
				await archiveClient({ id: clientToDelete.id as Id<"clients"> });
				setDeleteModalOpen(false);
				setClientToDelete(null);
				toast.success(
					"Client Archived",
					`${clientToDelete.name} has been archived. It will be permanently deleted in 7 days.`
				);
			} catch (error) {
				console.error("Failed to archive client:", error);
				toast.error(
					"Archive Failed",
					"Failed to archive the client. Please try again."
				);
			}
		}
	};

	const isArchivedTab = activeTab === "archived";
	const columns = createColumns(
		router,
		toast,
		handleDelete,
		handleRestore,
		isArchivedTab
	);

	const table = useReactTable({
		data: currentData,
		columns,
		state: {
			sorting,
			columnFilters,
			globalFilter: globalQuery,
			pagination: { pageIndex: 0, pageSize },
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalQuery,
		globalFilterFn: (row, columnId, value) => {
			// If no search value, show all rows
			if (!value || value.trim() === "") return true;

			const search = value.toLowerCase().trim();
			const client = row.original;

			// Search in client name
			if (client.name && client.name.toLowerCase().includes(search))
				return true;

			// Search in industry
			if (client.industry && client.industry.toLowerCase().includes(search))
				return true;

			// Search in primary contact name and email
			if (client.primaryContact) {
				if (
					client.primaryContact.name &&
					client.primaryContact.name.toLowerCase().includes(search)
				)
					return true;
				if (
					client.primaryContact.email &&
					client.primaryContact.email.toLowerCase().includes(search)
				)
					return true;
			}

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

	// Loading state
	if (
		convexClients === undefined ||
		archivedClients === undefined ||
		clientsStats === undefined
	) {
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
				<div className="flex gap-2">
					<StyledButton
						intent="outline"
						size="sm"
						onClick={() => setImportModalOpen(true)}
					>
						<Upload className="h-4 w-4" />
						Import Clients
					</StyledButton>
					<button
						onClick={handleAddClient}
						disabled={!canPerform}
						className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
						title={!canPerform ? reason : undefined}
					>
						<Plus className="h-4 w-4" />
						Add Client
						{!canPerform &&
							limit &&
							limit !== "unlimited" &&
							currentUsage !== undefined && (
								<Badge variant="secondary" className="ml-1 text-xs">
									{currentUsage}/{limit}
								</Badge>
							)}
						<span
							aria-hidden="true"
							className="group-hover:translate-x-1 transition-transform duration-200"
						>
							→
						</span>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<Users className="size-4" /> Prospective Clients
						</CardTitle>
						<CardDescription>
							Clients currently marked as prospects
						</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{clientsStats?.groupedByStatus?.prospective ?? 0}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="text-base">Active Clients</CardTitle>
						<CardDescription>Clients engaged in work right now</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{clientsStats?.groupedByStatus?.active ?? 0}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="text-base">Inactive Clients</CardTitle>
						<CardDescription>
							Clients marked inactive or archived
						</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{clientsStats?.groupedByStatus?.inactive ?? 0}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
				<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
				<CardHeader className="relative z-10 flex flex-col gap-2 border-b">
					<div className="flex items-center justify-between gap-3">
						<div>
							<CardTitle>Clients</CardTitle>
							<CardDescription>
								Search, sort, and browse your client list
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Input
								placeholder="Search clients, contacts, or industry..."
								value={globalQuery}
								onChange={(e) => setGlobalQuery(e.target.value)}
								className="w-96"
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className="relative z-10 px-0">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<div className="px-6 pt-4">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="active">Active Clients</TabsTrigger>
								<TabsTrigger value="archived">Archived Clients</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent value="active" className="mt-0">
							{isActiveEmpty ? (
								<div className="px-6 py-12 text-center">
									<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
										<Users className="h-12 w-12 text-muted-foreground" />
									</div>
									<h3 className="mb-2 text-lg font-semibold text-foreground">
										No clients yet
									</h3>
									<p className="mx-auto mb-6 max-w-sm text-muted-foreground">
										Create your first client to start organizing relationships
										and tracking activity.
									</p>
									<button
										onClick={handleAddClient}
										disabled={!canPerform}
										className="group inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary/15 hover:text-primary/80 hover:shadow-md ring-1 ring-primary/30 hover:ring-primary/40 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
										title={!canPerform ? reason : undefined}
									>
										<Plus className="h-4 w-4" />
										Add Your First Client
										<span
											aria-hidden="true"
											className="transition-transform duration-200 group-hover:translate-x-1"
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
															colSpan={columns.length}
															className="h-24 text-center"
														>
															No clients match your search.
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									</div>
									<div className="flex items-center justify-between py-4">
										<div className="text-sm text-muted-foreground">
											{table.getFilteredRowModel().rows.length} of{" "}
											{activeData.length} active clients
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
						</TabsContent>
						<TabsContent value="archived" className="mt-0">
							{isArchivedEmpty ? (
								<div className="px-6 py-12 text-center">
									<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
										<Archive className="h-12 w-12 text-muted-foreground" />
									</div>
									<h3 className="mb-2 text-lg font-semibold text-foreground">
										No archived clients
									</h3>
									<p className="mx-auto max-w-sm text-muted-foreground">
										Clients you archive will appear here for seven days before
										being permanently deleted.
									</p>
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
															colSpan={columns.length}
															className="h-24 text-center"
														>
															No archived clients match your search.
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									</div>
									<div className="flex items-center justify-between py-4">
										<div className="text-sm text-muted-foreground">
											{table.getFilteredRowModel().rows.length} of{" "}
											{archivedData.length} archived clients
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
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Archive Confirmation Modal */}
			{clientToDelete && (
				<DeleteConfirmationModal
					isOpen={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					title="Archive Client"
					itemName={clientToDelete.name}
					itemType="Client"
					isArchive={true}
				/>
			)}

			{/* Import Clients Modal */}
			<CsvImportModal
				isOpen={importModalOpen}
				onClose={() => setImportModalOpen(false)}
				onComplete={() => {
					setImportModalOpen(false);
					toast.success(
						"Clients Imported",
						"Your clients have been successfully imported."
					);
				}}
			/>
		</div>
	);
}
