import {
	Shield,
	Lock,
	Database,
	Eye,
	FileCheck,
	Users,
	AlertCircle,
} from "lucide-react";
import { LegalPageLayout } from "../components/legal-page-layout";

export default function DataSecurityPage() {
	return (
		<LegalPageLayout title="Data Security" lastUpdated="January 1, 2026">
			<div className="space-y-8">
				<section>
					<p className="text-muted-foreground leading-relaxed mb-8">
						At OneTool, data security and your trust are our highest priorities.
						This document outlines our comprehensive security practices,
						infrastructure safeguards, and the measures we implement to protect
						your business data from unauthorized access, alteration, and loss.
						We are committed to maintaining the confidentiality, integrity, and
						availability of your information.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						1. Security Architecture Overview
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						OneTool is built on a modern, secure architecture with multiple
						layers of defense:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Zero-Trust Architecture:</strong> All access is verified,
							regardless of location or device.
						</li>
						<li>
							<strong>Defense in Depth:</strong> Multiple security layers
							prevent single points of failure.
						</li>
						<li>
							<strong>Encryption Everywhere:</strong> All data is encrypted in
							transit and at rest.
						</li>
						<li>
							<strong>Continuous Monitoring:</strong> Real-time threat detection
							and response.
						</li>
						<li>
							<strong>Regular Audits:</strong> Third-party security assessments
							and penetration testing.
						</li>
					</ul>
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
								OneTool is hosted on enterprise-grade, SOC 2 Type II certified
								infrastructure with multiple layers of security controls:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>Cloud Hosting:</strong> Vercel for web application,
									Convex Cloud for serverless backend with built-in redundancy.
								</li>
								<li>
									<strong>Geographic Distribution:</strong> Data centers in
									multiple regions for redundancy and disaster recovery.
								</li>
								<li>
									<strong>99.9% Uptime SLA:</strong> Service level agreement
									with automatic failover and load balancing.
								</li>
								<li>
									<strong>SOC 2 Type II Certified:</strong> All infrastructure
									providers maintain SOC 2 Type II certification.
								</li>
								<li>
									<strong>ISO 27001 Compliant:</strong> Information security
									management system compliance across infrastructure.
								</li>
								<li>
									<strong>DDoS Protection:</strong> Distributed
									denial-of-service protection and mitigation built into CDN.
								</li>
								<li>
									<strong>Firewalls and IDS:</strong> Web Application Firewalls
									(WAF) and intrusion detection/prevention systems.
								</li>
								<li>
									<strong>24/7 Monitoring:</strong> Automated alerts and
									incident response team on standby.
								</li>
								<li>
									<strong>Regular Patching:</strong> Automated security patches
									and vulnerability management.
								</li>
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
								Encryption & Data Protection
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								Your data is encrypted using industry-standard cryptographic
								protocols:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>In Transit:</strong> All data transmissions use TLS
									1.3 (HTTPS) with perfect forward secrecy.
								</li>
								<li>
									<strong>At Rest:</strong> Data stored in Convex is encrypted
									using AES-256 encryption standards.
								</li>
								<li>
									<strong>Key Management:</strong> Encryption keys managed by
									cloud provider key management services.
								</li>
								<li>
									<strong>Certificates:</strong> SSL/TLS certificates from
									trusted certificate authorities with automatic renewal.
								</li>
								<li>
									<strong>Payment Data:</strong> Payment information encrypted
									and processed through PCI DSS Level 1 compliant processors
									(Stripe).
								</li>
								<li>
									<strong>Database Encryption:</strong> Convex provides
									transparent encryption of all stored data.
								</li>
								<li>
									<strong>Backup Encryption:</strong> All backups are encrypted
									and stored in secure locations.
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
									<strong>Auth Provider:</strong> Enterprise-grade
									authentication powered by Clerk.
								</li>
								<li>
									<strong>Multi-Factor Authentication:</strong> MFA available
									for all users to add extra security.
								</li>
								<li>
									<strong>Single Sign-On:</strong> SAML 2.0 and OpenID Connect
									support for enterprise customers.
								</li>
								<li>
									<strong>Role-Based Access:</strong> Fine-grained permissions
									(admin vs. member) limit data visibility.
								</li>
								<li>
									<strong>Organization Isolation:</strong> Users can only access
									data within their assigned organization.
								</li>
								<li>
									<strong>Session Management:</strong> Automatic timeout after
									30 minutes of inactivity; sessions invalidated on logout.
								</li>
								<li>
									<strong>Password Policy:</strong> Minimum 8 characters with
									enforcement of strong passwords.
								</li>
								<li>
									<strong>Password Storage:</strong> Passwords hashed using
									bcrypt with random salts.
								</li>
								<li>
									<strong>Token Management:</strong> Secure, short-lived access
									tokens with automatic expiration.
								</li>
								<li>
									<strong>Audit Logging:</strong> All authentication events
									logged and retained for 30 days minimum.
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
								Data Backup & Disaster Recovery
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								Your data is continuously backed up and protected against loss:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>Automated Backups:</strong> Convex performs automated
									backups at regular intervals.
								</li>
								<li>
									<strong>Point-in-Time Recovery:</strong> Ability to restore
									data to specific points in time (typically last 30 days).
								</li>
								<li>
									<strong>Geographic Redundancy:</strong> Backups stored in
									geographically distributed locations.
								</li>
								<li>
									<strong>Backup Encryption:</strong> All backups are encrypted
									at rest using AES-256.
								</li>
								<li>
									<strong>Integrity Testing:</strong> Regular backup integrity
									testing and recovery drills.
								</li>
								<li>
									<strong>30-Day Retention:</strong> Backup retention for
									disaster recovery scenarios.
								</li>
								<li>
									<strong>Recovery Time Objective (RTO):</strong> Less than 4
									hours for critical data recovery.
								</li>
								<li>
									<strong>Recovery Point Objective (RPO):</strong> Less than 1
									hour minimizing data loss.
								</li>
								<li>
									<strong>Business Continuity:</strong> Documented procedures
									for rapid recovery from outages.
								</li>
								<li>
									<strong>Data Export:</strong> You can export your data at any
									time for your own backup purposes.
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
								Data Isolation & Multi-Tenancy
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								We ensure strict isolation of your data from other customers:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>Logical Isolation:</strong> Organization-based data
									partitioning prevents cross-organization access.
								</li>
								<li>
									<strong>Row-Level Security:</strong> Database queries filtered
									by organization ID to ensure data isolation.
								</li>
								<li>
									<strong>No Cross-Tenant Access:</strong> System prevents any
									access to data from other organizations.
								</li>
								<li>
									<strong>Employee Access Control:</strong> OneTool employees
									cannot access production data without authorization.
								</li>
								<li>
									<strong>Access Logging:</strong> All data access logged with
									timestamp, user, and action for audit purposes.
								</li>
								<li>
									<strong>Limited Admin Access:</strong> Only designated
									security personnel can approve employee data access.
								</li>
								<li>
									<strong>Data Minimization:</strong> Employees access only data
									necessary for their role.
								</li>
								<li>
									<strong>Regular Audits:</strong> Monthly audits of employee
									data access.
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
								OneTool adheres to industry standards and international
								regulations:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>GDPR Compliant:</strong> Full compliance with General
									Data Protection Regulation for European users.
								</li>
								<li>
									<strong>CCPA Compliant:</strong> California Consumer Privacy
									Act compliance with user rights implementation.
								</li>
								<li>
									<strong>CPRA Compliant:</strong> California Privacy Rights Act
									compliance.
								</li>
								<li>
									<strong>Other State Laws:</strong> Compliance with Virginia,
									Colorado, Connecticut, and Utah privacy laws.
								</li>
								<li>
									<strong>PCI DSS Compliant:</strong> Payment processing through
									PCI DSS Level 1 certified provider (Stripe).
								</li>
								<li>
									<strong>SOC 2 Type II:</strong> Infrastructure providers
									maintain SOC 2 Type II certification.
								</li>
								<li>
									<strong>ISO 27001:</strong> Information security management
									aligned with ISO 27001 standards.
								</li>
								<li>
									<strong>HIPAA Available:</strong> Business Associate Agreement
									available for healthcare customers.
								</li>
								<li>
									<strong>Third-Party Audits:</strong> Annual security
									assessments by independent security firms.
								</li>
								<li>
									<strong>Penetration Testing:</strong> Regular penetration
									testing and vulnerability scanning.
								</li>
								<li>
									<strong>Patch Management:</strong> Rapid patching of
									vulnerabilities within 7 days (critical) or 30 days (high).
								</li>
							</ul>
						</div>
					</div>
				</section>

				<section className="bg-card border border-border rounded-lg p-6">
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-lg bg-primary/10">
							<AlertCircle className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold text-foreground mb-4">
								Third-Party Security
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								We carefully vet and monitor all third-party service providers:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>
									<strong>Clerk (Authentication):</strong> SOC 2 Type II
									certified secure authentication infrastructure.
								</li>
								<li>
									<strong>Convex (Database):</strong> SOC 2 Type II certified
									with encrypted data storage and backups.
								</li>
								<li>
									<strong>Stripe (Payments):</strong> PCI DSS Level 1 compliant
									industry-leading payment security.
								</li>
								<li>
									<strong>BoldSign (E-Signatures):</strong> Secure document
									signing with encryption and audit trails.
								</li>
								<li>
									<strong>Resend (Email):</strong> Secure email delivery with
									encryption and rate limiting.
								</li>
								<li>
									<strong>PostHog (Analytics):</strong> Privacy-conscious
									analytics with optional data anonymization.
								</li>
								<li>
									<strong>OpenAI (AI):</strong> Data processing agreements in
									place for AI feature usage.
								</li>
								<li>
									<strong>Vercel (Hosting):</strong> SOC 2 Type II certified
									with DDoS protection and CDN.
								</li>
								<li>
									<strong>Data Processing Agreements:</strong> Contracts with
									all vendors requiring adequate security.
								</li>
								<li>
									<strong>Regular Assessments:</strong> Annual review of
									third-party security certifications.
								</li>
							</ul>
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						2. Vulnerability Disclosure
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						We appreciate responsible security research:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Responsible Disclosure:</strong> Report security
							vulnerabilities to support@onetool.com.
						</li>
						<li>
							<strong>No Unauthorized Access:</strong> Do not access or modify
							data that does not belong to you.
						</li>
						<li>
							<strong>Good Faith:</strong> We will not pursue legal action
							against researchers acting in good faith.
						</li>
						<li>
							<strong>Prompt Response:</strong> We will acknowledge receipt
							within 48 hours.
						</li>
						<li>
							<strong>Coordinated Disclosure:</strong> We will work with you to
							coordinate public disclosure after patching.
						</li>
						<li>
							<strong>Patching Timeline:</strong> Critical vulnerabilities
							patched within 7 days; high-priority within 30 days.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						3. Security Incident Response
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						In the unlikely event of a security incident, we have established
						procedures to respond quickly:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							<strong>Immediate Detection:</strong> 24/7 monitoring for
							suspicious activity.
						</li>
						<li>
							<strong>Rapid Response:</strong> Incident response team activated
							immediately upon detection.
						</li>
						<li>
							<strong>Containment:</strong> Affected systems isolated to prevent
							further unauthorized access.
						</li>
						<li>
							<strong>Investigation:</strong> Thorough investigation to
							determine scope and impact.
						</li>
						<li>
							<strong>Notification:</strong> We will notify affected users
							within 72 hours of discovering a breach (as required by GDPR).
						</li>
						<li>
							<strong>Transparency:</strong> Clear communication about what
							happened and remediation steps.
						</li>
						<li>
							<strong>Recovery:</strong> Systems restored from clean backups
							after remediation.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						4. Your Security Responsibilities
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						While we implement comprehensive security measures, your vigilance
						is also important:
					</p>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
						<li>
							Use strong, unique passwords (12+ characters with mixed case,
							numbers, symbols)
						</li>
						<li>
							Enable multi-factor authentication (2FA/MFA) on your account
						</li>
						<li>Keep your login credentials confidential</li>
						<li>Review and manage user access within your organization</li>
						<li>
							Report suspicious activity immediately to support@onetool.com
						</li>
						<li>
							Keep your devices and browsers up to date with security patches
						</li>
						<li>Avoid accessing OneTool on unsecured public WiFi</li>
						<li>
							Be cautious of phishing emails; verify URLs before entering
							credentials
						</li>
						<li>
							Maintain your own independent backups of critical business
							information
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						5. Updates to This Security Policy
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						We regularly update our security practices to address new threats
						and incorporate industry best practices. This Security Policy will
						be updated as needed. We will notify users of material security
						changes via email. Your continued use of OneTool constitutes
						acceptance of updated practices.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						Questions or Concerns?
					</h2>
					<p className="text-muted-foreground leading-relaxed mb-4">
						If you have questions about our security practices or want to report
						a security concern, please contact our security team:
					</p>
					<div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
						<p className="font-semibold text-foreground mb-2">
							OneTool Security Team
						</p>
						<p>Email: support@onetool.com</p>
						<p className="text-xs text-muted-foreground mt-4">
							We aim to respond to security inquiries within 24 hours.
						</p>
					</div>
				</section>
			</div>
		</LegalPageLayout>
	);
}
