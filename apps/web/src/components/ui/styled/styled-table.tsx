"use client";

import * as React from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * StyledTable - A wrapper around the base Table component with consistent styling
 */
export function StyledTable({
	className,
	...props
}: React.ComponentProps<typeof Table>) {
	return (
		<Table
			className={cn("rounded-lg border overflow-hidden", className)}
			{...props}
		/>
	);
}

export function StyledTableHeader({
	className,
	...props
}: React.ComponentProps<typeof TableHeader>) {
	return (
		<TableHeader
			className={cn("bg-muted/50 sticky top-0 z-10", className)}
			{...props}
		/>
	);
}

export function StyledTableBody({
	className,
	...props
}: React.ComponentProps<typeof TableBody>) {
	return <TableBody className={cn("", className)} {...props} />;
}

export function StyledTableRow({
	className,
	...props
}: React.ComponentProps<typeof TableRow>) {
	return (
		<TableRow
			className={cn("transition-colors hover:bg-muted/30", className)}
			{...props}
		/>
	);
}

export function StyledTableHead({
	className,
	...props
}: React.ComponentProps<typeof TableHead>) {
	return <TableHead className={cn("font-semibold", className)} {...props} />;
}

export function StyledTableCell({
	className,
	...props
}: React.ComponentProps<typeof TableCell>) {
	return <TableCell className={cn("", className)} {...props} />;
}

export function StyledTableFooter({
	className,
	...props
}: React.ComponentProps<typeof TableFooter>) {
	return <TableFooter className={cn("", className)} {...props} />;
}

export function StyledTableCaption({
	className,
	...props
}: React.ComponentProps<typeof TableCaption>) {
	return <TableCaption className={cn("", className)} {...props} />;
}
