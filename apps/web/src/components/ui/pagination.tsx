import * as React from "react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex flex-row items-center gap-1", className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
	onClick?: () => void;
	size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg";
} & Omit<React.ComponentProps<"button">, "onClick">;

function PaginationLink({
	className,
	isActive,
	size = "sq-sm",
	onClick,
	...props
}: PaginationLinkProps) {
	return (
		<button
			type="button"
			aria-current={isActive ? "page" : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			onClick={onClick}
			className={cn(
				buttonStyles({
					intent: isActive ? "outline" : "plain",
					size,
				}),
				className
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="sm"
			className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
			{...props}
		>
			<ChevronLeftIcon className="size-4" />
			<span className="hidden sm:block">Previous</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="sm"
			className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
			{...props}
		>
			<span className="hidden sm:block">Next</span>
			<ChevronRightIcon className="size-4" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn("flex size-9 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}

// Complete pagination component with state management
interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	maxVisiblePages?: number;
}

function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
	className,
	maxVisiblePages = 5,
}: PaginationControlsProps) {
	if (totalPages <= 1) return null;

	const generatePageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const half = Math.floor(maxVisiblePages / 2);

		let start = Math.max(1, currentPage - half);
		const end = Math.min(totalPages, start + maxVisiblePages - 1);

		// Adjust start if we're near the end
		if (end - start < maxVisiblePages - 1) {
			start = Math.max(1, end - maxVisiblePages + 1);
		}

		// Add first page and ellipsis if needed
		if (start > 1) {
			pages.push(1);
			if (start > 2) {
				pages.push("ellipsis");
			}
		}

		// Add visible pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add ellipsis and last page if needed
		if (end < totalPages) {
			if (end < totalPages - 1) {
				pages.push("ellipsis");
			}
			pages.push(totalPages);
		}

		return pages;
	};

	const pages = generatePageNumbers();

	return (
		<Pagination className={className}>
			<PaginationContent>
				{/* Previous button */}
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(currentPage - 1)}
						aria-disabled={currentPage <= 1}
						className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
					/>
				</PaginationItem>

				{/* Page numbers */}
				{pages.map((page, index) => (
					<PaginationItem key={index}>
						{page === "ellipsis" ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								isActive={page === currentPage}
								onClick={() => onPageChange(page)}
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				{/* Next button */}
				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(currentPage + 1)}
						aria-disabled={currentPage >= totalPages}
						className={cn(
							currentPage >= totalPages && "pointer-events-none opacity-50"
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
	PaginationControls,
};
