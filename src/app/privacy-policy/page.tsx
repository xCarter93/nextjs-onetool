import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
					Privacy Policy
				</h1>

				<p className="text-sm text-muted-foreground mb-8">
					Last Updated: November 23, 2025
				</p>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							1. Introduction
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							OneTool (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
							committed to protecting your privacy. This Privacy Policy explains
							how we collect, use, disclose, and safeguard your information when
							you use our service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							2. Information We Collect
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							We collect information that you provide directly to us, including:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>
								Account information (name, email address, password, organization
								details)
							</li>
							<li>
								Business data (clients, projects, quotes, invoices, tasks)
							</li>
							<li>Payment information (processed securely through Stripe)</li>
							<li>
								Usage data (how you interact with our service, features used)
							</li>
							<li>
								Device information (IP address, browser type, operating system)
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							3. How We Use Your Information
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							We use the information we collect to:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Provide, maintain, and improve our services</li>
							<li>Process transactions and send related information</li>
							<li>Send technical notices and support messages</li>
							<li>Respond to your comments and questions</li>
							<li>Monitor and analyze trends, usage, and activities</li>
							<li>
								Detect, prevent, and address technical issues and security
								threats
							</li>
							<li>
								Comply with legal obligations and enforce our terms of service
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							4. Information Sharing
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							We do not sell your personal information. We may share your
							information in the following circumstances:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>
								With service providers who perform services on our behalf (e.g.,
								Clerk for authentication, Convex for data storage, Stripe for
								payments)
							</li>
							<li>
								With your organization members (data you enter is shared with
								your team)
							</li>
							<li>
								If required by law or to protect our rights and the safety of
								our users
							</li>
							<li>
								In connection with a merger, acquisition, or sale of assets
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							5. Data Security
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We implement appropriate technical and organizational measures to
							protect your information. However, no method of transmission over
							the internet or electronic storage is 100% secure. While we strive
							to protect your personal information, we cannot guarantee its
							absolute security.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							6. Data Retention
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We retain your information for as long as your account is active
							or as needed to provide you services. You may request deletion of
							your account and data at any time through your account settings or
							by contacting us.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							7. Your Rights
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							You have the right to:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Access and receive a copy of your personal information</li>
							<li>Correct inaccurate or incomplete information</li>
							<li>Request deletion of your information</li>
							<li>
								Object to or restrict certain processing of your information
							</li>
							<li>Export your data in a portable format</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							8. Cookies and Tracking
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We use cookies and similar tracking technologies to track activity
							on our service and hold certain information. You can instruct your
							browser to refuse all cookies or to indicate when a cookie is
							being sent.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							9. Children&apos;s Privacy
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Our service is not intended for children under 13 years of age. We
							do not knowingly collect personal information from children under
							13.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							10. Changes to This Privacy Policy
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We may update our Privacy Policy from time to time. We will notify
							you of any changes by posting the new Privacy Policy on this page
							and updating the &quot;Last Updated&quot; date.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							11. Contact Us
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							If you have any questions about this Privacy Policy, please
							contact us at privacy@onetool.com.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
