"use client";

import * as React from "react";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogBody,
	DialogFooter,
	DialogTrigger,
	DialogClose,
	DialogCloseIcon,
	type DialogHeaderProps,
	type DialogTitleProps,
	type DialogBodyProps,
	type DialogFooterProps,
	type DialogDescriptionProps,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * StyledDialog - A wrapper around the base Dialog component with consistent styling
 * Note: Dialog uses react-aria-components and has a complex structure
 * This wrapper adds consistent backdrop blur and styling
 */
export function StyledDialog({
	className,
	...props
}: React.ComponentProps<typeof Dialog>) {
	return (
		<Dialog
			className={cn(
				"backdrop-blur-xl bg-background/95 dark:bg-background/95",
				className
			)}
			{...props}
		/>
	);
}

export function StyledDialogHeader({
	className,
	...props
}: DialogHeaderProps) {
	return (
		<DialogHeader
			className={cn(
				"border-b border-border/40",
				className
			)}
			{...props}
		/>
	);
}

export function StyledDialogTitle({
	className,
	...props
}: DialogTitleProps) {
	return (
		<DialogTitle
			className={cn(
				"font-semibold",
				className
			)}
			{...props}
		/>
	);
}

export function StyledDialogDescription({
	className,
	...props
}: DialogDescriptionProps) {
	return (
		<DialogDescription
			className={cn(
				"text-muted-foreground",
				className
			)}
			{...props}
		/>
	);
}

export function StyledDialogBody({
	className,
	...props
}: DialogBodyProps) {
	return (
		<DialogBody
			className={cn(
				"",
				className
			)}
			{...props}
		/>
	);
}

export function StyledDialogFooter({
	className,
	...props
}: DialogFooterProps) {
	return (
		<DialogFooter
			className={cn(
				"border-t border-border/40",
				className
			)}
			{...props}
		/>
	);
}

// Re-export other dialog components as-is
export {
	DialogTrigger,
	DialogClose,
	DialogCloseIcon,
};

