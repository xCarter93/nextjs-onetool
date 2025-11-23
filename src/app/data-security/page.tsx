import Link from "next/link";
import { ArrowLeft, Shield, Lock, Database, Eye, FileCheck, Users } from "lucide-react";

export default function DataSecurityPage() {
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
					Data Security
				</h1>

				<p className="text-sm text-muted-foreground mb-8">
					Last Updated: November 23, 2025
				</p>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
					<section>
						<p className="text-muted-foreground leading-relaxed mb-8">
							At OneTool, we take data security seriously. This page outlines
							our security practices and the measures we take to protect your
							business data.
						</p>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<Shield className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Infrastructure Security
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									OneTool is built on enterprise-grade infrastructure with
									multiple layers of security:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										Hosted on secure cloud infrastructure with 99.9% uptime SLA
									</li>
									<li>
										All data centers are SOC 2 Type II certified and ISO 27001
										compliant
									</li>
									<li>Regular security audits and penetration testing</li>
									<li>
										Distributed denial-of-service (DDoS) protection and
										mitigation
									</li>
									<li>24/7 infrastructure monitoring and incident response</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<Lock className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Encryption
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									Your data is encrypted both in transit and at rest:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										All data transmissions use TLS 1.3 encryption (HTTPS)
									</li>
									<li>
										Data at rest is encrypted using AES-256 encryption standards
									</li>
									<li>
										Encryption keys are managed using industry-standard key
										management systems
									</li>
									<li>
										Payment information is encrypted and processed through
										PCI-compliant payment processors (Stripe)
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<Users className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Authentication & Access Control
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									We implement strict authentication and access control measures:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										Enterprise-grade authentication powered by Clerk with SSO
										support
									</li>
									<li>Multi-factor authentication (MFA) available for all users</li>
									<li>
										Role-based access control (RBAC) to limit data access within
										organizations
									</li>
									<li>Session management with automatic timeout</li>
									<li>Password requirements enforce strong security practices</li>
									<li>
										Regular security token rotation and secure password storage
										using bcrypt
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<Database className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Data Backup & Recovery
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									Your data is continuously backed up to prevent loss:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										Automated daily backups with point-in-time recovery
										capability
									</li>
									<li>
										Backups are encrypted and stored in geographically
										distributed locations
									</li>
									<li>Regular backup integrity testing and recovery drills</li>
									<li>
										30-day backup retention for disaster recovery scenarios
									</li>
									<li>
										Business continuity plan with defined recovery time
										objectives (RTO)
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<Eye className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Privacy & Data Isolation
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									We ensure your data remains private and isolated:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										Logical data isolation ensures organizations cannot access
										each other&apos;s data
									</li>
									<li>
										Employee access to production data is strictly controlled and
										logged
									</li>
									<li>
										No OneTool employee can view your data without explicit
										consent
									</li>
									<li>All data access is logged for audit purposes</li>
									<li>
										We do not sell, rent, or share your data with third parties
										for marketing
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="bg-card border border-border rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<FileCheck className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-foreground mb-4">
									Compliance & Certifications
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-4">
									OneTool adheres to industry standards and regulations:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>GDPR compliant for European users</li>
									<li>CCPA compliant for California residents</li>
									<li>
										PCI DSS compliant payment processing through certified
										providers
									</li>
									<li>Regular third-party security audits</li>
									<li>Vulnerability scanning and security patch management</li>
									<li>
										Incident response plan with defined notification procedures
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Your Responsibilities
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							While we implement robust security measures, you also play a role
							in keeping your data secure:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Use strong, unique passwords for your account</li>
							<li>Enable multi-factor authentication when available</li>
							<li>Keep your login credentials confidential</li>
							<li>Review and manage user access within your organization</li>
							<li>Report suspicious activity immediately</li>
							<li>Keep your devices and browsers up to date</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Security Incident Response
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							In the unlikely event of a security incident, we have established
							procedures to respond quickly and effectively. We will notify
							affected users within 72 hours of discovering any breach that may
							compromise their data, in accordance with applicable laws.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Questions or Concerns?
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							If you have questions about our security practices or want to
							report a security concern, please contact our security team at
							security@onetool.com.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

