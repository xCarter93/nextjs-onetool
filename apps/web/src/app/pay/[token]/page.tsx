"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { StyledButton } from "@/components/ui/styled/styled-button";

type InvoiceResponse = {
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

export default function PayPage() {
	const searchParams = useSearchParams();
	const routeParams = useParams<{ token: string }>();
	const token = routeParams?.token;
	const sessionId = searchParams.get("session_id");
	const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [confirming, setConfirming] = useState(false);
	const [paid, setPaid] = useState(false);

	const formattedTotal = useMemo(() => {
		if (!invoice?.invoice.total) return "$0.00";
		return `$${(invoice.invoice.total || 0).toFixed(2)}`;
	}, [invoice]);

	useEffect(() => {
		const load = async () => {
			if (!token) return;
			try {
				const res = await fetch(
					`/api/pay/invoice?token=${encodeURIComponent(token)}`,
					{ cache: "no-store" }
				);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data?.error || "Invoice not found");
				}
				setInvoice(data);
				if (data.invoice.status === "paid") {
					setPaid(true);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Unable to load invoice details."
				);
			} finally {
				setLoading(false);
			}
		};
		void load();
	}, [token]);

	useEffect(() => {
		const confirm = async () => {
			if (!sessionId || !invoice || paid || !token) return;
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
	}, [invoice, paid, sessionId, token]);

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

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<div className="mx-auto max-w-2xl px-6 py-12">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-semibold tracking-tight text-slate-900">
						Invoice Payment
					</h1>
					<p className="text-sm text-slate-500">
						Secure checkout powered by Stripe
					</p>
				</div>

				<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					{loading ? (
						<p className="text-slate-500">Loading invoice...</p>
					) : error ? (
						<p className="text-red-600">{error}</p>
					) : !invoice ? (
						<p className="text-slate-600">Invoice not found.</p>
					) : (
						<>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-wide text-slate-500">
										Invoice
									</p>
									<p className="text-lg font-semibold text-slate-900">
										{invoice.invoice.invoiceNumber ?? "Invoice"}
									</p>
									{invoice.org?.name && (
										<p className="text-sm text-slate-500">{invoice.org.name}</p>
									)}
								</div>
								<div className="text-right">
									<p className="text-xs uppercase tracking-wide text-slate-500">
										Amount Due
									</p>
									<p className="text-2xl font-bold text-slate-900">
										{formattedTotal}
									</p>
								</div>
							</div>

							<div className="mt-6 space-y-2 text-sm text-slate-600">
								<p>
									Status:{" "}
									<span className="font-medium text-slate-900">
										{paid || invoice.invoice.status === "paid"
											? "Paid"
											: "Unpaid"}
									</span>
								</p>
								{invoice.invoice.dueDate && (
									<p>
										Due date:{" "}
										<span className="font-medium text-slate-900">
											{new Date(invoice.invoice.dueDate).toLocaleDateString()}
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
											: "Pay securely with Stripe"}
									</StyledButton>
								)}
							</div>

							{confirming && (
								<p className="mt-3 text-xs text-slate-500">
									Confirming payment...
								</p>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
