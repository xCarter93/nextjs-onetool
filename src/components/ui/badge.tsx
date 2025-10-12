import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 ring-1 ring-inset ring-transparent shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background backdrop-blur-sm overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:text-destructive",
	{
		variants: {
			variant: {
				default:
					"bg-primary/10 text-primary ring-primary/30 hover:bg-primary/15 hover:ring-primary/40 focus-visible:ring-primary/50 dark:bg-primary/20 dark:text-primary-foreground dark:ring-primary/35 dark:hover:bg-primary/25",
				secondary:
					"bg-secondary/10 text-secondary-foreground ring-secondary/30 hover:bg-secondary/15 hover:ring-secondary/40 focus-visible:ring-secondary/45 dark:bg-secondary/20 dark:ring-secondary/35",
				destructive:
					"bg-destructive/10 text-destructive ring-destructive/30 hover:bg-destructive/15 hover:ring-destructive/40 focus-visible:ring-destructive/50 dark:bg-destructive/20 dark:text-destructive-foreground dark:ring-destructive/45",
				success:
					"bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 hover:bg-emerald-500/15 hover:ring-emerald-500/40 focus-visible:ring-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-50 dark:ring-emerald-500/50",
				warning:
					"bg-amber-500/10 text-amber-600 ring-amber-500/30 hover:bg-amber-500/15 hover:ring-amber-500/40 focus-visible:ring-amber-500/50 dark:bg-amber-500/20 dark:text-amber-50 dark:ring-amber-500/50",
				outline:
					"bg-background/80 text-foreground ring-border hover:bg-accent/30 hover:text-accent-foreground focus-visible:ring-ring",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
