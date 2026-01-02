import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 lg:px-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Home
				</Link>

				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
					Terms of Service
				</h1>

				<p className="text-sm text-muted-foreground mb-8">
					Last Updated: November 23, 2025
				</p>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							1. Acceptance of Terms
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							By accessing and using OneTool (&quot;the Service&quot;), you
							accept and agree to be bound by the terms and provision of this
							agreement. If you do not agree to abide by the above, please do
							not use this service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							2. Use License
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							Permission is granted to temporarily access OneTool for personal
							or commercial use. This is the grant of a license, not a transfer
							of title, and under this license you may not:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Modify or copy the materials</li>
							<li>
								Use the materials for any commercial purpose without proper
								subscription
							</li>
							<li>
								Attempt to decompile or reverse engineer any software contained
								in OneTool
							</li>
							<li>
								Remove any copyright or other proprietary notations from the
								materials
							</li>
							<li>
								Transfer the materials to another person or &quot;mirror&quot;
								the materials on any other server
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							3. User Accounts
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							When you create an account with us, you must provide accurate,
							complete, and current information. Failure to do so constitutes a
							breach of the Terms. You are responsible for safeguarding the
							password and for all activities that occur under your account.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							4. Subscription and Billing
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Some parts of the Service are billed on a subscription basis. You
							will be billed in advance on a recurring and periodic basis.
							Billing cycles are set on a monthly or annual basis, depending on
							the type of subscription plan you select.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							5. Cancellation and Refunds
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							You may cancel your subscription at any time through your account
							settings. Upon cancellation, you will retain access to the Service
							until the end of your current billing period. Refunds are handled
							on a case-by-case basis and are not guaranteed.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							6. Limitation of Liability
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							In no event shall OneTool or its suppliers be liable for any
							damages (including, without limitation, damages for loss of data
							or profit, or due to business interruption) arising out of the use
							or inability to use OneTool.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							7. Changes to Terms
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We reserve the right to modify or replace these Terms at any time.
							If a revision is material, we will provide at least 30 days&apos;
							notice prior to any new terms taking effect.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							8. Contact Information
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							If you have any questions about these Terms, please contact us at
							support@onetool.com.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
