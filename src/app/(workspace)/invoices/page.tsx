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
	Receipt,
	Clock,
	ExternalLink,
	Trash2,
	CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";

type InvoiceWithClient = Doc<"invoices"> & {
	clientName: string;
	projectName?: string;
};

const statusVariant = (status: string, dueDate: number) => {
	// Check if overdue
	if (status === "sent" && dueDate < Date.now()) {
		return "destructive" as const;
	}

	switch (status) {
		case "paid":
			return "default" as const;
		case "sent":
			return "secondary" as const;
		case "cancelled":
			return "destructive" as const;
		case "draft":
		default:
			return "outline" as const;
	}
};

const formatStatus = (status: string, dueDate: number) => {
	// Check if overdue
	if (status === "sent" && dueDate < Date.now()) {
		return "Overdue";
	}

	switch (status) {
		case "draft":
			return "Draft";
		case "sent":
			return "Sent";
		case "paid":
			return "Paid";
		case "overdue":
			return "Overdue";
		case "cancelled":
			return "Cancelled";
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
): ColumnDef<InvoiceWithClient>[] => [
	{
		accessorKey: "invoiceNumber",
		header: "Invoice",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium text-foreground">
					{row.original.invoiceNumber}
				</span>
				<span className="text-muted-foreground text-xs">
					{row.original.projectName || "No project"}
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
			<Badge variant={statusVariant(row.original.status, row.original.dueDate)}>
				{formatStatus(row.original.status, row.original.dueDate)}
			</Badge>
		),
	},
	{
		accessorKey: "issuedDate",
		header: "Issued",
		cell: ({ row }) => {
			const d = new Date(row.original.issuedDate);
			return <span className="text-foreground">{d.toLocaleDateString()}</span>;
		},
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ row }) => {
			const d = new Date(row.original.dueDate);
			const isOverdue = d < new Date() && row.original.status !== "paid";
			return (
				<span
					className={`text-foreground ${isOverdue ? "text-destructive font-medium" : ""}`}
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
					onPress={() => router.push(`/invoices/${row.original._id}`)}
					aria-label={`View invoice ${row.original.invoiceNumber}`}
				>
					<ExternalLink className="size-4" />
				</Button>
				<Button
					intent="outline"
					size="sq-sm"
					onPress={() => onDelete(row.original._id, row.original.invoiceNumber)}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
					aria-label={`Delete invoice ${row.original.invoiceNumber}`}
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		),
	},
];

export default function InvoicesPage() {
	const router = useRouter();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [invoiceToDelete, setInvoiceToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const deleteInvoice = useMutation(api.invoices.remove);

	// Fetch data from Convex
	const invoices = useQuery(api.invoices.list, {});
	const clients = useQuery(api.clients.list, {});
	const projects = useQuery(api.projects.list, {});

	// Memoize the arrays to avoid dependency changes on every render
	const invoicesArray = React.useMemo(() => invoices || [], [invoices]);
	const clientsArray = React.useMemo(() => clients || [], [clients]);
	const projectsArray = React.useMemo(() => projects || [], [projects]);

	// Combine invoices with client and project data
	const data = React.useMemo((): InvoiceWithClient[] => {
		return invoicesArray.map((invoice) => {
			const client = clientsArray.find((c) => c._id === invoice.clientId);
			const project = projectsArray.find((p) => p._id === invoice.projectId);

			return {
				...invoice,
				clientName: client?.companyName || "Unknown Client",
				projectName: project?.title,
			};
		});
	}, [invoicesArray, clientsArray, projectsArray]);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [query, setQuery] = React.useState("");
	const pageSize = 10;

	const handleDelete = (id: string, name: string) => {
		setInvoiceToDelete({ id, name });
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (invoiceToDelete) {
			try {
				await deleteInvoice({ id: invoiceToDelete.id as Id<"invoices"> });
				setDeleteModalOpen(false);
				setInvoiceToDelete(null);
			} catch (error) {
				console.error("Failed to delete invoice:", error);
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

	// Calculate stats
	const totalOpen = React.useMemo(
		() =>
			data.filter((inv) => inv.status === "draft" || inv.status === "sent")
				.length,
		[data]
	);

	const totalPaidValue = React.useMemo(
		() =>
			data
				.filter((inv) => inv.status === "paid")
				.reduce((sum, inv) => sum + inv.total, 0),
		[data]
	);

	// Loading state
	const isLoading =
		invoices === undefined || clients === undefined || projects === undefined;
	const isEmpty = !isLoading && data.length === 0;

	return (
		<div className="relative p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					<div>
						<h1 className="text-2xl font-bold text-foreground">Invoices</h1>
						<p className="text-muted-foreground text-sm">
							Manage your invoices and track payments
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<Receipt className="size-4" /> Total Invoices
						</CardTitle>
						<CardDescription>All invoices in your workspace</CardDescription>
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
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<Clock className="size-4" /> Open Invoices
						</CardTitle>
						<CardDescription>Unpaid and draft invoices</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								totalOpen
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
					<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
					<CardHeader className="relative z-10">
						<CardTitle className="flex items-center gap-2 text-base">
							<CheckCircle className="size-4" /> Paid Value
						</CardTitle>
						<CardDescription>Total value of paid invoices</CardDescription>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-semibold">
							{isLoading ? (
								<div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							) : (
								formatCurrency(totalPaidValue)
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
				<div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
				<CardHeader className="relative z-10 flex flex-col gap-2 border-b">
					<div className="flex items-center justify-between gap-3">
						<div>
							<CardTitle>Invoices</CardTitle>
							<CardDescription>
								Search, sort, and browse your invoices
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Input
								placeholder="Search invoices..."
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
								<Receipt className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								No invoices yet
							</h3>
							<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
								Create invoices from approved quotes on the Projects page to get
								started tracking payments and revenue.
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
													No invoices match your search.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
							<div className="flex items-center justify-between py-4">
								<div className="text-muted-foreground text-sm">
									{table.getFilteredRowModel().rows.length} of {data.length}{" "}
									invoices
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
			{invoiceToDelete && (
				<DeleteConfirmationModal
					isOpen={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					title="Delete Invoice"
					itemName={invoiceToDelete.name}
					itemType="Invoice"
				/>
			)}
		</div>
	);
}
