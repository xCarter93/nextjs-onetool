"use client";

import * as React from "react";
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * StyledCard - A wrapper around the base Card component with consistent glassmorphism styling
 */
export function StyledCard({
	className,
	children,
	...props
}: React.ComponentProps<typeof Card>) {
	return (
		<Card
			className={cn(
				"group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40",
				className
			)}
			{...props}
		>
			{/* Glassmorphism gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl pointer-events-none" />
			<div className="relative z-10">{children}</div>
		</Card>
	);
}

export function StyledCardHeader({
	className,
	...props
}: React.ComponentProps<typeof CardHeader>) {
	return <CardHeader className={cn("relative z-10", className)} {...props} />;
}

export function StyledCardTitle({
	className,
	...props
}: React.ComponentProps<typeof CardTitle>) {
	return <CardTitle className={cn("relative z-10", className)} {...props} />;
}

export function StyledCardDescription({
	className,
	...props
}: React.ComponentProps<typeof CardDescription>) {
	return (
		<CardDescription className={cn("relative z-10", className)} {...props} />
	);
}

export function StyledCardContent({
	className,
	...props
}: React.ComponentProps<typeof CardContent>) {
	return <CardContent className={cn("relative z-10", className)} {...props} />;
}

export function StyledCardFooter({
	className,
	...props
}: React.ComponentProps<typeof CardFooter>) {
	return <CardFooter className={cn("relative z-10", className)} {...props} />;
}

export function StyledCardAction({
	className,
	...props
}: React.ComponentProps<typeof CardAction>) {
	return <CardAction className={cn("relative z-10", className)} {...props} />;
}
