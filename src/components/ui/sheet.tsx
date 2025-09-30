"use client";

import type {
	DialogProps,
	DialogTriggerProps,
	ModalOverlayProps,
} from "react-aria-components";
import {
	composeRenderProps,
	DialogTrigger as DialogTriggerPrimitive,
	Modal,
	ModalOverlay,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";
import { tv } from "tailwind-variants";
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogCloseIcon,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

type Sides = "top" | "bottom" | "left" | "right";
const generateCompoundVariants = (sides: Array<Sides>) => {
	return sides.map((side) => ({
		side,
		isFloat: true,
		className:
			side === "top"
				? "top-2 inset-x-2 rounded-lg ring-1 border-b-0"
				: side === "bottom"
					? "bottom-2 inset-x-2 rounded-lg ring-1 border-t-0"
					: side === "left"
						? "left-2 inset-y-2 rounded-lg ring-1 border-r-0"
						: "right-2 inset-y-2 rounded-lg ring-1 border-l-0",
	}));
};

const sheetContentStyles = tv({
	base: [
		"fixed z-50 grid gap-4 border-muted-fg/20 bg-white text-foreground shadow-lg dark:bg-gray-900 dark:border-border",
		"transform-gpu will-change-transform",
	],
	variants: {
		isEntering: {
			true: "[animation-duration:300ms] [animation-timing-function:ease-out]",
		},
		isExiting: {
			true: "[animation-duration:200ms] [animation-timing-function:ease-in]",
		},
		side: {
			top: "[animation-name:slideInFromTop] entering:[animation-name:slideInFromTop] exiting:[animation-name:slideOutToTop] inset-x-0 top-0 rounded-b-2xl border-b",
			bottom:
				"[animation-name:slideInFromBottom] entering:[animation-name:slideInFromBottom] exiting:[animation-name:slideOutToBottom] inset-x-0 bottom-0 rounded-t-2xl border-t",
			left: "[animation-name:slideInFromLeft] entering:[animation-name:slideInFromLeft] exiting:[animation-name:slideOutToLeft] inset-y-0 left-0 h-auto w-3/4 overflow-y-auto border-r sm:max-w-sm",
			right:
				"[animation-name:slideInFromRight] entering:[animation-name:slideInFromRight] exiting:[animation-name:slideOutToRight] inset-y-0 right-0 h-auto w-3/4 overflow-y-auto border-l sm:max-w-sm",
		},
		isFloat: {
			false: "border-fg/20 dark:border-border",
			true: "ring-fg/5 dark:ring-border",
		},
	},
	compoundVariants: generateCompoundVariants([
		"top",
		"bottom",
		"left",
		"right",
	]),
});

type SheetProps = DialogTriggerProps;
const Sheet = (props: SheetProps) => {
	return <DialogTriggerPrimitive {...props} />;
};

interface SheetContentProps
	extends Omit<ModalOverlayProps, "children">,
		Pick<DialogProps, "aria-label" | "role" | "aria-labelledby" | "children"> {
	closeButton?: boolean;
	isBlurred?: boolean;
	isFloat?: boolean;
	side?: Sides;
	overlay?: Omit<ModalOverlayProps, "children">;
}

const SheetContent = ({
	className,
	isBlurred = false,
	isDismissable: isDismissableInternal,
	side = "right",
	role = "dialog",
	closeButton = true,
	isFloat = true,
	children,
	...props
}: SheetContentProps) => {
	const isDismissable = isDismissableInternal ?? role !== "alertdialog";
	return (
		<ModalOverlay
			isDismissable={isDismissable}
			className={twJoin(
				"fixed inset-0 z-50 h-(--visual-viewport-height,100vh) w-screen overflow-hidden bg-black/50 transition-opacity",
				"entering:opacity-100 entering:duration-300",
				"exiting:opacity-0 exiting:duration-200",
				isBlurred && "backdrop-blur-sm backdrop-filter"
			)}
			{...props}
		>
			<Modal
				className={composeRenderProps(className, (className, renderProps) =>
					sheetContentStyles({
						...renderProps,
						side,
						isFloat,
						className,
					})
				)}
			>
				<Dialog aria-label={props["aria-label"]} role={role}>
					{(values) => (
						<>
							{typeof children === "function" ? children(values) : children}
							{closeButton && (
								<DialogCloseIcon
									className="top-2.5 right-2.5"
									isDismissable={isDismissable}
								/>
							)}
						</>
					)}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
};

const SheetTrigger = DialogTrigger;
const SheetFooter = DialogFooter;
const SheetHeader = DialogHeader;
const SheetTitle = DialogTitle;
const SheetDescription = DialogDescription;
const SheetBody = DialogBody;
const SheetClose = DialogClose;

Sheet.Trigger = SheetTrigger;
Sheet.Footer = SheetFooter;
Sheet.Header = SheetHeader;
Sheet.Title = SheetTitle;
Sheet.Description = SheetDescription;
Sheet.Body = SheetBody;
Sheet.Close = SheetClose;
Sheet.Content = SheetContent;

export type { SheetProps, SheetContentProps, Sides };
export {
	Sheet,
	SheetTrigger,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetBody,
	SheetClose,
	SheetContent,
};
