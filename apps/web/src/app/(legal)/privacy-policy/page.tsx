import { LegalPageLayout } from "../components/legal-page-layout";

export default function PrivacyPolicyPage() {
	return (
		<LegalPageLayout title="Privacy Policy" lastUpdated="January 1, 2026">
			<div className="space-y-8">
				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						1. Introduction
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						OneTool (&quot;we,&quot; &quot;our,&quot; &quot;us,&quot; or
						&quot;Company&quot;) is committed to protecting your privacy and
						ensuring transparency about how we collect, use, disclose, and
						safeguard your information. This Privacy Policy describes our
						practices regarding personal data and information collected when you
						access or use our web and mobile applications, as well as related
						services (collectively, the &quot;Service&quot;). This policy
						applies to all users, including field-service business owners, team
						members, and any third parties whose information may be collected
						through the Service.
					</p>
					<p className="text-muted-foreground leading-relaxed mt-4">
						Please read this Privacy Policy carefully. By accessing or using
						OneTool, you acknowledge that you have read, understood, and agree
						to the practices described here. If you do not agree with our
						privacy practices, please do not use the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						2. Information We Collect
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We collect information from multiple sources to provide and improve
						the Service:
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						2.1 Information You Provide Directly
					</h3>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Account Registration:</strong> When you create an account,
							we collect your name, email address, phone number (optional), and
							organization details. This information is processed through Clerk,
							our authentication provider.
						</li>
						<li>
							<strong>Business Information:</strong> Client names, email
							addresses, phone numbers, physical addresses, and property
							information; project details, descriptions, and status; quote line
							items, pricing, and customer details; invoice information, payment
							amounts, and transaction history; task descriptions, schedules,
							and assignments.
						</li>
						<li>
							<strong>Communication Data:</strong> Emails you send through the
							Service, inbound client emails, message content and attachments,
							and communication history and metadata.
						</li>
						<li>
							<strong>File Uploads:</strong> CSV files imported for bulk
							operations, quote and invoice PDFs, signed documents from
							BoldSign, and user-uploaded attachments.
						</li>
						<li>
							<strong>Payment Information:</strong> Payment method details
							(processed securely through Stripe, not stored on our servers),
							billing address, and transaction history.
						</li>
						<li>
							<strong>Support Communications:</strong> Any messages you send to
							our support team, feedback, and information you provide when
							reporting issues.
						</li>
					</ul>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						2.2 Information Collected Automatically
					</h3>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Device Information:</strong> IP address, browser type and
							version, operating system, device type, and device identifiers.
						</li>
						<li>
							<strong>Usage Data:</strong> Pages visited, features accessed,
							time spent in the application, actions performed, and interaction
							patterns collected through PostHog analytics.
						</li>
						<li>
							<strong>Log Data:</strong> Server logs including access times,
							page requests, error messages, and referrer information.
						</li>
						<li>
							<strong>Cookies and Similar Technologies:</strong> Session cookies
							for authentication, preference cookies for storing your settings,
							and analytics cookies to track usage patterns (see Section 9 for
							details).
						</li>
						<li>
							<strong>Location Information:</strong> We may collect approximate
							location data from IP addresses. We do not collect precise GPS
							location data unless you explicitly enable location services
							within the mobile app.
						</li>
					</ul>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						2.3 Information from Third Parties
					</h3>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							Information provided by Clerk regarding your account and
							organization membership.
						</li>
						<li>
							Payment information from Stripe related to subscription and
							invoice payments.
						</li>
						<li>E-signature and document signing information from BoldSign.</li>
						<li>Email event data from Resend (delivery, opens, clicks).</li>
						<li>Analytics data from PostHog regarding your usage patterns.</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						3. How We Use Your Information
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We use the information we collect for the following purposes:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Service Delivery:</strong> To provide, maintain, and
							operate the Service and its features.
						</li>
						<li>
							<strong>Account Management:</strong> To create and manage your
							account, authenticate users, and manage organization access and
							permissions.
						</li>
						<li>
							<strong>Communication:</strong> To send you transactional emails
							(account confirmation, password reset, billing notifications),
							support responses, and system alerts.
						</li>
						<li>
							<strong>Payment Processing:</strong> To process subscription
							payments, invoice payments, and handle billing inquiries.
						</li>
						<li>
							<strong>Feature Improvements:</strong> To analyze usage patterns,
							identify trends, and improve the Service based on user behavior
							and feedback.
						</li>
						<li>
							<strong>Analytics and Reporting:</strong> To generate business
							reports, usage statistics, and analytics for you and our team to
							understand platform usage.
						</li>
						<li>
							<strong>AI-Powered Features:</strong> To power CSV import and
							report generation features using OpenAI APIs (you control whether
							to use these features).
						</li>
						<li>
							<strong>Security and Fraud Prevention:</strong> To detect,
							prevent, and address technical issues, security threats, fraud,
							abuse, and unauthorized access.
						</li>
						<li>
							<strong>Legal Compliance:</strong> To comply with legal
							obligations, enforce our Terms of Service, and protect the rights
							and safety of our users and company.
						</li>
						<li>
							<strong>Product Development:</strong> To develop new features,
							conduct research, and test improvements to the Service.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						4. How We Share Your Information
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We do not sell, rent, or trade your personal information to third
						parties for their independent marketing purposes. However, we may
						share information in the following circumstances:
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						4.1 Third-Party Service Providers
					</h3>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We share information with third parties that provide essential
						services to operate the Service:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Clerk:</strong> Authentication provider - receives user
							email and account information for authentication and organization
							management.
						</li>
						<li>
							<strong>Convex:</strong> Backend database provider - stores all
							user and business data with encryption.
						</li>
						<li>
							<strong>Stripe:</strong> Payment processor - receives payment
							information for subscription and invoice payments; also processes
							direct client payments through Stripe Connect.
						</li>
						<li>
							<strong>BoldSign:</strong> E-signature provider - receives
							quote/document details and client email addresses for signature
							requests.
						</li>
						<li>
							<strong>Resend:</strong> Email delivery provider - receives email
							content and recipient addresses for sending and tracking
							transactional emails.
						</li>
						<li>
							<strong>PostHog:</strong> Analytics provider - receives usage data
							and user behavior information (anonymized where possible) to help
							us understand how you use the Service.
						</li>
						<li>
							<strong>OpenAI:</strong> AI provider - receives CSV file contents
							and report parameters only when you explicitly use AI-powered
							features.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						These service providers are contractually obligated to use your
						information only as necessary to provide services to OneTool and to
						maintain the confidentiality and security of your data. Each
						provider has its own privacy policy; we recommend reviewing them to
						understand their data practices.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						4.2 Organization Members
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						Any information you create within your organization (clients,
						projects, quotes, invoices, tasks) is visible to other members of
						your organization who have appropriate access permissions. You
						control who can access your organization and what data they can see
						through role-based access controls (admin vs. member).
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						4.3 Legal Requirements and Protection
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						We may disclose your information if required by law, court order,
						government request, or when we believe in good faith that disclosure
						is necessary to:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>Comply with applicable laws, regulations, or legal process.</li>
						<li>
							Protect the safety, rights, and property of OneTool, our users,
							and the public.
						</li>
						<li>
							Detect, investigate, or address fraud, security issues, or
							technical problems.
						</li>
						<li>Enforce our Terms of Service and other agreements.</li>
					</ul>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						4.4 Business Transfers
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						If OneTool is involved in a merger, acquisition, bankruptcy,
						dissolution, restructuring, or similar transaction or proceeding,
						your information may be transferred as part of that transaction. We
						will provide notice and opportunity to opt out where required by
						law.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						5. Data Security
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We implement comprehensive technical, administrative, and physical
						security measures to protect your personal information from
						unauthorized access, alteration, disclosure, or destruction:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Encryption:</strong> All data is encrypted in transit
							using TLS 1.3 (HTTPS) and at rest using AES-256 encryption.
						</li>
						<li>
							<strong>Authentication:</strong> Strong user authentication
							powered by Clerk with optional multi-factor authentication (MFA).
						</li>
						<li>
							<strong>Access Control:</strong> Role-based access controls
							limiting data visibility within organizations; employee access to
							production data is strictly controlled and audited.
						</li>
						<li>
							<strong>Infrastructure Security:</strong> Secure cloud
							infrastructure with DDoS protection, firewalls, and intrusion
							detection systems.
						</li>
						<li>
							<strong>Monitoring:</strong> Continuous monitoring and automated
							alerts for suspicious activity and security incidents.
						</li>
						<li>
							<strong>Data Isolation:</strong> Logical isolation of data by
							organization preventing cross-organization access.
						</li>
						<li>
							<strong>Regular Audits:</strong> Regular security audits,
							vulnerability assessments, and penetration testing.
						</li>
						<li>
							<strong>Incident Response:</strong> Established procedures to
							respond to security incidents quickly and notify affected users.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						However, no method of transmission over the internet or electronic
						storage is 100% secure. While we implement robust security measures,
						we cannot guarantee absolute security. We encourage you to protect
						your login credentials and notify us immediately of any unauthorized
						access.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						6. Data Retention
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We retain your information for as long as necessary to provide the
						Service and for legitimate business purposes:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Account Data:</strong> While your account is active. After
							cancellation, we retain your data for 30 days to allow recovery
							before permanent deletion.
						</li>
						<li>
							<strong>Usage Analytics:</strong> Retained for up to 12 months for
							analytics and improvement purposes.
						</li>
						<li>
							<strong>Email Communications:</strong> Retained for the duration
							of your account and 30 days post-cancellation.
						</li>
						<li>
							<strong>Payment Records:</strong> Retained for 7 years as required
							for tax and legal compliance purposes.
						</li>
						<li>
							<strong>Backups:</strong> Encrypted backups may be retained for up
							to 30 days for disaster recovery purposes.
						</li>
						<li>
							<strong>Legal Holds:</strong> If required by law, we may retain
							information for longer periods.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						You can request deletion of your account and associated data at any
						time. Upon request, we will delete your data within 30 days, except
						where retention is required by law. You may request data export
						before deletion.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						7. Your Privacy Rights and Choices
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						You have the following rights regarding your personal information:
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.1 Access and Portability
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You have the right to access and receive a copy of your personal
						information in a machine-readable format (JSON or CSV). Contact
						support@onetool.com to request your data.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.2 Correction and Update
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You can correct, update, or modify your account information directly
						through the Service settings. For data you cannot modify yourself,
						contact support@onetool.com.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.3 Deletion
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You have the right to request deletion of your account and
						associated data. Upon cancellation, we will delete your data after
						30 days. You can expedite deletion by requesting it through your
						account settings or contacting support@onetool.com. Deletion removes
						you from the Service, though legal obligations may require us to
						retain certain information.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.4 Restrict Processing
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You may request restrictions on how we process your data, though
						this may limit our ability to provide the Service. Contact
						support@onetool.com with specific restrictions you request.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.5 Marketing Communications
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						We send transactional emails required for the Service. For
						non-essential communications, you can opt out by clicking the
						unsubscribe link in emails or adjusting notification preferences in
						your account settings.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.6 Cookie Preferences
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You can control cookies through your browser settings, though
						disabling essential cookies may affect Service functionality. See
						Section 9 for more details.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						7.7 Exercising Your Rights
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						To exercise any of these rights, contact us at support@onetool.com.
						We will respond to verified requests within 30 days (45 days if
						complex). We may request identification to verify your request and
						ensure we are disclosing data only to the data subject.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						8. International Data Transfers
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						Your information is processed and stored in the United States and
						may be transferred to, stored in, and processed in other countries.
						These countries may have data protection laws different from your
						country of origin.
					</p>
					<p className="text-muted-foreground leading-relaxed mb-4">
						By using OneTool, you consent to the transfer of your information to
						countries outside your country of residence, which may have
						different data protection rules. We implement safeguards to protect
						your information during international transfers, including:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>Encryption of data in transit and at rest.</li>
						<li>
							Standard contractual clauses approved by regulatory authorities.
						</li>
						<li>
							Binding data transfer agreements with our service providers.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						If you reside in the European Economic Area (EEA), United Kingdom,
						or Switzerland, additional privacy rights may apply under GDPR and
						similar laws. We process your data on the legal basis of contractual
						necessity (to provide the Service) and, where applicable, your
						consent or our legitimate interests in operating and improving the
						Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						9. Cookies and Tracking Technologies
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We use cookies and similar tracking technologies to enhance your
						experience with the Service:
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						9.1 Types of Cookies We Use
					</h3>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Essential Cookies:</strong> Required for the Service to
							function (authentication, security, session management).
						</li>
						<li>
							<strong>Preference Cookies:</strong> Remember your settings and
							preferences (theme, language, layout).
						</li>
						<li>
							<strong>Analytics Cookies:</strong> Track usage patterns through
							PostHog to understand how users interact with the Service.
						</li>
					</ul>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						9.2 Your Cookie Choices
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						You can control cookies through your browser settings. Most browsers
						allow you to:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>View cookies and delete them.</li>
						<li>Block all cookies or only third-party cookies.</li>
						<li>Set preferences to be notified when cookies are set.</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						Note that disabling essential cookies may impair Service
						functionality. Analytics cookies are non-essential and can be
						disabled without affecting core functionality.
					</p>

					<h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
						9.3 Do Not Track
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						Some browsers include a Do Not Track feature. We honor Do Not Track
						signals by not loading PostHog analytics when DNT is enabled in your
						browser.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						10. Children&apos;s Privacy (COPPA Compliance)
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						OneTool is not intended for children under 13 years of age, and we
						do not knowingly collect personal information from children under
						13. If we become aware that we have collected information from a
						child under 13 without parental consent, we will take immediate
						steps to delete such information and terminate the child&apos;s
						account.
					</p>
					<p className="text-muted-foreground leading-relaxed mt-4">
						Our Service is designed for business owners and team members of
						field-service businesses. If you believe we have collected
						information from a child under 13, please contact
						support@onetool.com immediately.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						11. Third-Party Links and Services
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						OneTool may contain links to third-party websites and services that
						are not operated by us. This Privacy Policy applies only to
						information collected through the Service. We are not responsible
						for the privacy practices of third parties. We recommend reviewing
						the privacy policies of any third-party services before providing
						your information or using their services. Your use of third-party
						integrations (Stripe, BoldSign, Resend, etc.) is governed by their
						respective privacy policies.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						12. Data Processing in California and Other US States
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						If you are a California resident, you have additional privacy rights
						under the California Consumer Privacy Act (CCPA):
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							Right to know what personal information we collect and how we use
							it.
						</li>
						<li>
							Right to delete personal information (with limited exceptions).
						</li>
						<li>
							Right to opt-out of the sale of personal information (we do not
							sell personal information).
						</li>
						<li>
							Right to non-discrimination for exercising your CCPA rights.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						To exercise these rights, contact support@onetool.com. If you are a
						California resident and have other questions about CCPA, you may
						contact the California Attorney General.
					</p>
					<p className="text-muted-foreground leading-relaxed mt-4">
						Other US states with comprehensive privacy laws (Virginia, Colorado,
						Connecticut, Utah) have similar rights. We comply with these laws
						and honor similar requests from residents of these states.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						13. GDPR Compliance for European Users
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						If you are located in the European Economic Area, United Kingdom, or
						Switzerland, you have rights under the General Data Protection
						Regulation (GDPR) and similar laws. Key information:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Data Controller:</strong> OneTool is the data controller
							for personal information we collect about you.
						</li>
						<li>
							<strong>Legal Basis:</strong> We process your data based on
							contractual necessity (to provide the Service) and your consent.
						</li>
						<li>
							<strong>Rights:</strong> You have rights to access, correct,
							delete, restrict processing, port your data, and object to
							processing.
						</li>
						<li>
							<strong>Data Protection Officer:</strong> Contact
							support@onetool.com for any GDPR-related inquiries.
						</li>
						<li>
							<strong>Withdrawal of Consent:</strong> You can withdraw consent
							at any time by contacting support@onetool.com (though this may
							limit our ability to provide the Service).
						</li>
						<li>
							<strong>Complaints:</strong> You have the right to lodge a
							complaint with your local data protection authority.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						14. Updates to This Privacy Policy
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We may update this Privacy Policy from time to time to reflect
						changes in our practices, technology, legal requirements, or other
						factors. When we make material changes, we will:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							Post the updated Privacy Policy on this page with an updated
							effective date.
						</li>
						<li>
							Notify you via email if the changes materially affect how we use
							your personal information.
						</li>
						<li>
							Require your consent or provide opt-out options if required by
							law.
						</li>
					</ul>
					<p className="text-muted-foreground leading-relaxed mt-4">
						Your continued use of the Service after changes become effective
						constitutes your acceptance of the updated Privacy Policy. We
						encourage you to review this policy regularly to stay informed about
						how we protect your information.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						15. Contact Us
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						If you have questions, concerns, or requests regarding this Privacy
						Policy or our privacy practices, please contact us:
					</p>
					<div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
						<p className="font-semibold text-foreground mb-2">
							OneTool Privacy Team
						</p>
						<p>Email: support@onetool.com</p>
						<p className="text-xs text-muted-foreground mt-4">
							Response time: We will respond to privacy requests within 30 days.
						</p>
					</div>
				</section>

				<section className="pt-4 border-t border-border mt-8">
					<p className="text-xs text-muted-foreground">
						This Privacy Policy is effective as of January 1, 2026. Your
						continued use of OneTool after any modifications to this policy
						constitutes your acceptance of the revised terms.
					</p>
				</section>
			</div>
		</LegalPageLayout>
	);
}
