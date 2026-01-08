"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { StyledButton } from "@/components/ui/styled/styled-button";

type PaymentResponse = {
	payment: {
		_id: string;
		publicToken: string;
		status: string;
		paymentAmount: number;
		dueDate: number;
		description?: string;
		sortOrder: number;
		paidAt?: number;
	};
	invoice: {
		_id: string;
		invoiceNumber: string;
		total: number;
		clientId: string;
		status: string;
	};
	org: {
		name?: string;
		stripeConnectAccountId?: string;
	} | null;
	paymentContext: {
		paymentNumber: number;
		totalPayments: number;
		totalPaid: number;
		totalRemaining: number;
	};
};

type LegacyInvoiceResponse = {
	invoice: {
		_id: string;
		publicToken: string;
		status: string;
		invoiceNumber?: string;
		total?: number;
		issuedDate?: number;
		dueDate?: number;
	};
	org: {
		name?: string;
		stripeConnectAccountId?: string;
	} | null;
};

type PaymentData =
	| { type: "payment"; data: PaymentResponse }
	| { type: "invoice"; data: LegacyInvoiceResponse };

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

export default function PayPage() {
	const searchParams = useSearchParams();
	const routeParams = useParams<{ token: string }>();
	const token = routeParams?.token;
	const sessionId = searchParams.get("session_id");
	const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [confirming, setConfirming] = useState(false);
	const [paid, setPaid] = useState(false);

	const displayAmount = useMemo(() => {
		if (!paymentData) return "$0.00";
		if (paymentData.type === "payment") {
			return formatCurrency(paymentData.data.payment.paymentAmount);
		}
		return formatCurrency(paymentData.data.invoice.total || 0);
	}, [paymentData]);

	useEffect(() => {
		const load = async () => {
			if (!token) return;
			try {
				// Try payment token first
				const paymentRes = await fetch(
					`/api/pay/payment?token=${encodeURIComponent(token)}`,
					{ cache: "no-store" }
				);

				if (paymentRes.ok) {
					const data: PaymentResponse = await paymentRes.json();
					setPaymentData({ type: "payment", data });
					if (data.payment.status === "paid") {
						setPaid(true);
					}
					return;
				}

				// Fall back to legacy invoice token
				const invoiceRes = await fetch(
					`/api/pay/invoice?token=${encodeURIComponent(token)}`,
					{ cache: "no-store" }
				);
				const invoiceData = await invoiceRes.json();

				if (!invoiceRes.ok) {
					throw new Error(invoiceData?.error || "Payment not found");
				}

				setPaymentData({ type: "invoice", data: invoiceData });
				if (invoiceData.invoice.status === "paid") {
					setPaid(true);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Unable to load payment details."
				);
			} finally {
				setLoading(false);
			}
		};
		void load();
	}, [token]);

	useEffect(() => {
		const confirm = async () => {
			if (!sessionId || !paymentData || paid || !token) return;
			setConfirming(true);
			try {
				const res = await fetch("/api/pay/confirm", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token, sessionId }),
				});
				const data = await res.json();
				if (res.ok && data.status === "paid") {
					setPaid(true);
				} else if (!res.ok) {
					setError(data?.error || "Payment confirmation failed.");
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Payment confirmation failed."
				);
			} finally {
				setConfirming(false);
			}
		};
		void confirm();
	}, [paymentData, paid, sessionId, token]);

	const handleCheckout = async () => {
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/pay/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});
			const data = await res.json();
			if (!res.ok || !data?.url) {
				throw new Error(data?.error || "Unable to start checkout.");
			}
			window.location.href = data.url;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Unable to start checkout."
			);
		} finally {
			setLoading(false);
		}
	};

	const renderPaymentContent = () => {
		if (!paymentData) return null;

		if (paymentData.type === "payment") {
			const { payment, invoice, org, paymentContext } = paymentData.data;
			const remainingAfterThis =
				paymentContext.totalRemaining - payment.paymentAmount;

			return (
				<>
					{/* Header */}
					<div className="border-b border-slate-200 pb-4">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-xs uppercase tracking-wide text-slate-500">
									Invoice
								</p>
								<p className="text-lg font-semibold text-slate-900">
									{invoice.invoiceNumber}
								</p>
								{org?.name && (
									<p className="text-sm text-slate-500">{org.name}</p>
								)}
							</div>
							<div className="text-right">
								<p className="text-xs uppercase tracking-wide text-slate-500">
									This Payment
								</p>
								<p className="text-3xl font-bold text-slate-900">
									{formatCurrency(payment.paymentAmount)}
								</p>
							</div>
						</div>
					</div>

					{/* Payment Info */}
					<div className="mt-4 rounded-lg bg-slate-50 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-slate-900">
									Payment {paymentContext.paymentNumber} of{" "}
									{paymentContext.totalPayments}
								</p>
								{payment.description && (
									<p className="text-sm text-slate-600">{payment.description}</p>
								)}
							</div>
							<div className="text-right">
								<p className="text-xs text-slate-500">
									Status:{" "}
									<span
										className={`font-medium ${
											paid || payment.status === "paid"
												? "text-emerald-600"
												: "text-amber-600"
										}`}
									>
										{paid || payment.status === "paid" ? "Paid" : "Due"}
									</span>
								</p>
								{payment.dueDate && (
									<p className="text-xs text-slate-500">
										Due: {new Date(payment.dueDate).toLocaleDateString()}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Invoice Context */}
					<div className="mt-4 space-y-2 text-sm">
						<div className="flex justify-between text-slate-600">
							<span>Invoice Total</span>
							<span className="font-medium text-slate-900">
								{formatCurrency(invoice.total)}
							</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>Previously Paid</span>
							<span className="font-medium text-slate-900">
								{formatCurrency(paymentContext.totalPaid)}
							</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>This Payment</span>
							<span className="font-medium text-slate-900">
								{formatCurrency(payment.paymentAmount)}
							</span>
						</div>
						<div className="border-t border-slate-200 pt-2">
							<div className="flex justify-between text-slate-600">
								<span>Remaining After This Payment</span>
								<span className="font-medium text-slate-900">
									{formatCurrency(remainingAfterThis)}
								</span>
							</div>
						</div>
					</div>

					{/* Action Button */}
					<div className="mt-8">
						{paid || payment.status === "paid" ? (
							<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
								Payment received. Thank you!
							</div>
						) : (
							<StyledButton
								size="md"
								intent="primary"
								className="w-full justify-center"
								onClick={handleCheckout}
								disabled={loading || confirming}
								showArrow={false}
							>
								{loading
									? "Starting checkout..."
									: `Pay ${formatCurrency(payment.paymentAmount)} securely with Stripe`}
							</StyledButton>
						)}
					</div>

					{confirming && (
						<p className="mt-3 text-center text-xs text-slate-500">
							Confirming payment...
						</p>
					)}
				</>
			);
		}

		// Legacy invoice flow
		const { invoice, org } = paymentData.data;

		return (
			<>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">
							Invoice
						</p>
						<p className="text-lg font-semibold text-slate-900">
							{invoice.invoiceNumber ?? "Invoice"}
						</p>
						{org?.name && <p className="text-sm text-slate-500">{org.name}</p>}
					</div>
					<div className="text-right">
						<p className="text-xs uppercase tracking-wide text-slate-500">
							Amount Due
						</p>
						<p className="text-2xl font-bold text-slate-900">{displayAmount}</p>
					</div>
				</div>

				<div className="mt-6 space-y-2 text-sm text-slate-600">
					<p>
						Status:{" "}
						<span className="font-medium text-slate-900">
							{paid || invoice.status === "paid" ? "Paid" : "Unpaid"}
						</span>
					</p>
					{invoice.dueDate && (
						<p>
							Due date:{" "}
							<span className="font-medium text-slate-900">
								{new Date(invoice.dueDate).toLocaleDateString()}
							</span>
						</p>
					)}
				</div>

				<div className="mt-8">
					{paid ? (
						<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
							Payment received. Thank you!
						</div>
					) : (
						<StyledButton
							size="md"
							intent="primary"
							className="w-full justify-center"
							onClick={handleCheckout}
							disabled={loading || confirming}
							showArrow={false}
						>
							{loading
								? "Starting checkout..."
								: `Pay ${displayAmount} securely with Stripe`}
						</StyledButton>
					)}
				</div>

				{confirming && (
					<p className="mt-3 text-xs text-slate-500">Confirming payment...</p>
				)}
			</>
		);
	};

	// Derive header text based on payment type
	const headerText = useMemo(() => {
		if (!paymentData) return "Invoice Payment";
		if (paymentData.type === "payment") {
			const { paymentContext, payment } = paymentData.data;
			const description = payment.description
				? ` - ${payment.description}`
				: "";
			return {
				title: "Invoice Payment",
				subtitle: `Payment ${paymentContext.paymentNumber} of ${paymentContext.totalPayments}${description}`,
			};
		}
		return { title: "Invoice Payment", subtitle: null };
	}, [paymentData]);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<div className="mx-auto max-w-2xl px-6 py-12">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-semibold tracking-tight text-slate-900">
						{typeof headerText === "string" ? headerText : headerText.title}
					</h1>
					{typeof headerText !== "string" && headerText.subtitle && (
						<p className="mt-1 text-lg font-medium text-slate-700">
							{headerText.subtitle}
						</p>
					)}
					<p className="text-sm text-slate-500">
						Secure checkout powered by Stripe
					</p>
				</div>

				<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					{loading ? (
						<p className="text-slate-500">Loading payment...</p>
					) : error ? (
						<p className="text-red-600">{error}</p>
					) : !paymentData ? (
						<p className="text-slate-600">Payment not found.</p>
					) : (
						renderPaymentContent()
					)}
				</div>
			</div>
		</div>
	);
}
