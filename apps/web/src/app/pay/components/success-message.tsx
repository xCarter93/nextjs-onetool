"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaymentSuccessMessageProps {
	/**
	 * The payment amount that was successfully processed
	 */
	amount: string;

	/**
	 * The organization name that received the payment
	 */
	organizationName?: string;

	/**
	 * The invoice number for reference
	 */
	invoiceNumber?: string;

	/**
	 * Optional description of the payment (e.g., "Deposit", "Final Payment")
	 */
	paymentDescription?: string;

	/**
	 * Whether to show the email confirmation note
	 */
	showEmailNote?: boolean;

	/**
	 * Additional class names for the container
	 */
	className?: string;
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<motion.path
				d="M5 13l4 4L19 7"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
			/>
		</svg>
	);
}

export default function PaymentSuccessMessage({
	amount,
	organizationName,
	invoiceNumber,
	paymentDescription,
	showEmailNote = false,
	className,
}: PaymentSuccessMessageProps) {
	return (
		<motion.div
			className={cn("flex flex-col items-center text-center", className)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{/* Success Icon */}
			<motion.div
				className="relative mb-6"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
			>
				{/* Background circle */}
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
					<motion.div
						className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
					>
						<CheckIcon className="h-7 w-7 text-white" />
					</motion.div>
				</div>
			</motion.div>

			{/* Success Text */}
			<motion.div
				className="space-y-2"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.3 }}
			>
				<h2 className="text-xl font-semibold text-slate-900">
					Payment Successful
				</h2>
				<p className="text-slate-600">Thank you for your payment</p>
			</motion.div>

			{/* Payment Details Card */}
			<motion.div
				className="mt-6 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/50 p-5"
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.5 }}
			>
				{/* Amount */}
				<div className="mb-4 border-b border-slate-200 pb-4">
					<p className="text-xs font-medium uppercase tracking-wider text-slate-400">
						Amount Paid
					</p>
					<p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600">
						{amount}
					</p>
				</div>

				{/* Details */}
				<div className="space-y-2.5 text-sm">
					{organizationName && (
						<div className="flex justify-between">
							<span className="text-slate-500">Paid to</span>
							<span className="font-medium text-slate-900">
								{organizationName}
							</span>
						</div>
					)}
					{invoiceNumber && (
						<div className="flex justify-between">
							<span className="text-slate-500">Invoice</span>
							<span className="font-medium text-slate-900">{invoiceNumber}</span>
						</div>
					)}
					{paymentDescription && (
						<div className="flex justify-between">
							<span className="text-slate-500">Description</span>
							<span className="font-medium text-slate-900">
								{paymentDescription}
							</span>
						</div>
					)}
				</div>
			</motion.div>

			{/* Confirmation Note */}
			{showEmailNote && (
				<motion.p
					className="mt-6 text-sm text-slate-500"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.7 }}
				>
					A confirmation email has been sent to your inbox.
				</motion.p>
			)}
		</motion.div>
	);
}
