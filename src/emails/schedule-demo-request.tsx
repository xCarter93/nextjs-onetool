import * as React from "react";

interface ScheduleDemoRequestEmailProps {
	name: string;
	email: string;
	company?: string;
	phone?: string;
	message?: string;
	timestamp: string;
}

export const ScheduleDemoRequestEmail = ({
	name,
	email,
	company,
	phone,
	message,
	timestamp,
}: ScheduleDemoRequestEmailProps) => {
	return (
		<html>
			<head>
				<style>
					{`
						body {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
							line-height: 1.6;
							color: #333;
							margin: 0;
							padding: 0;
							background-color: #f5f5f5;
						}
						.container {
							max-width: 600px;
							margin: 20px auto;
							background-color: #ffffff;
							border-radius: 8px;
							overflow: hidden;
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
						}
						.header {
							background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
							color: #ffffff;
							padding: 32px 24px;
							text-align: center;
						}
						.header h1 {
							margin: 0;
							font-size: 24px;
							font-weight: 700;
						}
						.content {
							padding: 32px 24px;
						}
						.info-section {
							margin-bottom: 24px;
							padding-bottom: 24px;
							border-bottom: 1px solid #e5e7eb;
						}
						.info-section:last-child {
							border-bottom: none;
							margin-bottom: 0;
							padding-bottom: 0;
						}
						.info-label {
							font-size: 12px;
							font-weight: 600;
							text-transform: uppercase;
							color: #6b7280;
							margin-bottom: 6px;
							letter-spacing: 0.5px;
						}
						.info-value {
							font-size: 16px;
							color: #1f2937;
							font-weight: 500;
						}
						.message-box {
							background-color: #f9fafb;
							border-left: 4px solid #3b82f6;
							padding: 16px;
							border-radius: 4px;
							margin-top: 8px;
						}
						.message-text {
							color: #374151;
							font-size: 15px;
							line-height: 1.7;
							margin: 0;
							white-space: pre-wrap;
							word-wrap: break-word;
						}
						.footer {
							background-color: #f9fafb;
							padding: 20px 24px;
							text-align: center;
							border-top: 1px solid #e5e7eb;
						}
						.timestamp {
							font-size: 13px;
							color: #6b7280;
						}
						.cta-note {
							margin-top: 24px;
							padding: 16px;
							background-color: #fef3c7;
							border-radius: 6px;
							border-left: 4px solid #f59e0b;
						}
						.cta-note p {
							margin: 0;
							color: #92400e;
							font-size: 14px;
							font-weight: 500;
						}
					`}
				</style>
			</head>
			<body>
				<div className="container">
					<div className="header">
						<h1>🎯 New Demo Request</h1>
					</div>

					<div className="content">
						<div className="info-section">
							<div className="info-label">Contact Name</div>
							<div className="info-value">{name}</div>
						</div>

						<div className="info-section">
							<div className="info-label">Email Address</div>
							<div className="info-value">
								<a
									href={`mailto:${email}`}
									style={{ color: "#3b82f6", textDecoration: "none" }}
								>
									{email}
								</a>
							</div>
						</div>

						{company && (
							<div className="info-section">
								<div className="info-label">Company</div>
								<div className="info-value">{company}</div>
							</div>
						)}

						{phone && (
							<div className="info-section">
								<div className="info-label">Phone Number</div>
								<div className="info-value">
									<a
										href={`tel:${phone}`}
										style={{ color: "#3b82f6", textDecoration: "none" }}
									>
										{phone}
									</a>
								</div>
							</div>
						)}

						{message && (
							<div className="info-section">
								<div className="info-label">Message</div>
								<div className="message-box">
									<p className="message-text">{message}</p>
								</div>
							</div>
						)}

						<div className="cta-note">
							<p>
								💡 Please reach out to this prospect within 24 hours to schedule
								their demo.
							</p>
						</div>
					</div>

					<div className="footer">
						<div className="timestamp">
							Request received: <strong>{timestamp}</strong>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
};

export default ScheduleDemoRequestEmail;
