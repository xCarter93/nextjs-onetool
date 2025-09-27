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
	FileText,
	DollarSign,
	Clock,
	ExternalLink,
	Plus,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";

type QuoteWithClient = Doc<"quotes"> & {
	clientName: string;
	projectName?: string;
};

const statusVariant = (status: string) => {
	switch (status) {
		case "approved":
			return "default" as const;
		case "sent":
			return "secondary" as const;
		case "declined":
		case "expired":
			return "destructive" as const;
		case "draft":
		default:
			return "outline" as const;
	}
};

const formatStatus = (status: string) => {
	switch (status) {
		case "draft":
			return "Draft";
		case "sent":
			return "Sent";
		case "approved":
			return "Approved";
		case "declined":
			return "Declined";
		case "expired":
			return "Expired";
		default:
			return status;
	}
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const createColumns = (
	router: ReturnType<typeof useRouter>,
	onDelete: (id: string, name: string) => void
): ColumnDef<QuoteWithClient>[] => [
	{
		accessorKey: "quoteNumber",
		header: "Quote",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium text-foreground">
					{row.original.quoteNumber || `#${row.original._id.slice(-6)}`}
				</span>
				<span className="text-muted-foreground text-xs">
					{row.original.title || row.original.projectName || "Untitled Quote"}
				</span>
			</div>
		),
	},
	{
		accessorKey: "clientName",
		header: "Client",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.clientName}</span>
		),
	},
	{
		accessorKey: "total",
		header: "Amount",
		cell: ({ row }) => (
			<span className="text-foreground font-medium">
				{formatCurrency(row.original.total)}
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
		accessorKey: "_creationTime",
		header: "Created",
		cell: ({ row }) => {
			const d = new Date(row.original._creationTime);
			return <span className="text-foreground">{d.toLocaleDateString()}</span>;
		},
	},
	{
		accessorKey: "validUntil",
		header: "Valid Until",
		cell: ({ row }) => {
			if (!row.original.validUntil) {
				return <span className="text-muted-foreground">-</span>;
			}
			const d = new Date(row.original.validUntil);
			const isExpired = d < new Date();
			return (
				<span
					className={`text-foreground ${isExpired ? "text-destructive" : ""}`}
				>
					{d.toLocaleDateString()}
				</span>
			);
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
					onPress={() => router.push(`/quotes/${row.original._id}`)}
					aria-label={`View quote ${row.original.quoteNumber || row.original._id.slice(-6)}`}
				>
					<ExternalLink className="size-4" />
				</Button>
				<Button
					intent="outline"
					size="sq-sm"
					onPress={() =>
						onDelete(
							row.original._id,
							row.original.quoteNumber || row.original._id.slice(-6)
						)
					}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
					aria-label={`Delete quote ${row.original.quoteNumber || row.original._id.slice(-6)}`}
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		),
	},
];

export default function QuotesPage() {
	const router = useRouter();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [quoteToDelete, setQuoteToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const deleteQuote = useMutation(api.quotes.remove);

	// Fetch data from Convex
	const quotes = useQuery(api.quotes.list, {});
	const clients = useQuery(api.clients.list, {});
	const projects = useQuery(api.projects.list, {});

	// Memoize the arrays to avoid dependency changes on every render
	const quotesArray = React.useMemo(() => quotes || [], [quotes]);
	const clientsArray = React.useMemo(() => clients || [], [clients]);
	const projectsArray = React.useMemo(() => projects || [], [projects]);

	// Combine quotes with client and project data
	const data = React.useMemo((): QuoteWithClient[] => {
		return quotesArray.map((quote) => {
			const client = clientsArray.find((c) => c._id === quote.clientId);
			const project = projectsArray.find((p) => p._id === quote.projectId);

			return {
				...quote,
				clientName: client?.companyName || "Unknown Client",
				projectName: project?.title,
			};
		});
	}, [quotesArray, clientsArray, projectsArray]);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [query, setQuery] = React.useState("");
	const pageSize = 10;

	const handleDelete = (id: string, name: string) => {
		setQuoteToDelete({ id, name });
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (quoteToDelete) {
			try {
				await deleteQuote({ id: quoteToDelete.id as Id<"quotes"> });
				setDeleteModalOpen(false);
				setQuoteToDelete(null);
			} catch (error) {
				console.error("Failed to delete quote:", error);
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
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	React.useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	React.useEffect(() => {
		table.getColumn("quoteNumber")?.setFilterValue(query);
		table.getColumn("clientName")?.setFilterValue(query);
		table.getColumn("status")?.setFilterValue(query);
	}, [query, table]);

	const totalPending = React.useMemo(
		() => data.filter((q) => q.status === "sent").length,
		[data]
	);

	const totalValue = React.useMemo(
		() =>
			data
				.filter((q) => q.status === "approved")
				.reduce((sum, q) => sum + q.total, 0),
		[data]
	);

	// Loading state
	const isLoading =
		quotes === undefined || clients === undefined || projects === undefined;
	const isEmpty = !isLoading && data.length === 0;

	return (
		<div className="relative p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<div>
						<h1 className="text-2xl font-bold text-foreground">Quotes</h1>
						<p className="text-muted-foreground text-sm">
							Overview of your quotes and proposals
						</p>
					</div>
				</div>
				<button
					onClick={() => router.push("/quotes/new")}
					className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm"
				>
					<Plus className="h-4 w-4" />
					Create Quote
					<span
						aria-hidden="true"
						className="group-hover:translate-x-1 transition-transform duration-200"
					>
						→
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<FileText className="size-4" /> Total Quotes
						</CardTitle>
						<CardDescription>All quotes in your workspace</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								data.length
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<Clock className="size-4" /> Pending Approval
						</CardTitle>
						<CardDescription>Quotes awaiting client response</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								totalPending
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<DollarSign className="size-4" /> Approved Value
						</CardTitle>
						<CardDescription>Total value of approved quotes</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								formatCurrency(totalValue)
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
				<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
				<CardHeader className="relative z-10 flex flex-col gap-2 border-b">
					<div className="flex items-center justify-between gap-3">
						<div>
							<CardTitle>Quotes</CardTitle>
							<CardDescription>
								Search, sort, and browse your quotes
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Input
								placeholder="Search quotes..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-96"
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className="relative z-10 px-0">
					{isEmpty ? (
						<div className="px-6 py-12 text-center">
							<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
								<FileText className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								No quotes yet
							</h3>
							<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
								Create your first quote to get started and track proposals in
								one place.
							</p>
							<button
								onClick={() => router.push("/quotes/new")}
								className="group inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary/15 hover:text-primary/80 hover:shadow-md ring-1 ring-primary/30 hover:ring-primary/40 backdrop-blur-sm"
							>
								<Plus className="h-4 w-4" />
								Create Your First Quote
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
										{isLoading ? (
											Array.from({ length: 5 }).map((_, i) => (
												<TableRow key={i}>
													{Array.from({
														length: createColumns(router, handleDelete).length,
													}).map((_, j) => (
														<TableCell key={j}>
															<div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
														</TableCell>
													))}
												</TableRow>
											))
										) : table.getRowModel().rows?.length ? (
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
													No quotes match your search.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
							<div className="flex items-center justify-between py-4">
								<div className="text-muted-foreground text-sm">
									{table.getFilteredRowModel().rows.length} of {data.length}{" "}
									quotes
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
			{quoteToDelete && (
				<DeleteConfirmationModal
					isOpen={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					title="Delete Quote"
					itemName={quoteToDelete.name}
					itemType="Quote"
				/>
			)}
		</div>
	);
}
