"use client";

import { PricingTable } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StyledButton } from "@/components/ui/styled/styled-button";

export default function PricingPage() {
	const { resolvedTheme } = useTheme();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const currentTheme = mounted ? resolvedTheme : "light";
	const isDark = currentTheme === "dark";

	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			{/* Animated background blobs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className={`absolute top-0 -left-4 w-72 h-72 ${
						isDark ? "bg-primary/20" : "bg-primary/10"
					} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob`}
				/>
				<div
					className={`absolute top-0 -right-4 w-72 h-72 ${
						isDark ? "bg-purple-500/20" : "bg-purple-300/20"
					} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000`}
				/>
				<div
					className={`absolute -bottom-8 left-20 w-72 h-72 ${
						isDark ? "bg-pink-500/20" : "bg-pink-300/20"
					} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000`}
				/>
			</div>

			{/* Main content grid */}
			<div className="relative min-h-screen grid lg:grid-cols-2 gap-8">
				{/* Left side - Pricing Table */}
				<div className="flex items-center justify-center p-8 lg:p-12 relative z-10">
					<div className="w-full max-w-4xl">
						<div className="mb-8 text-center lg:text-left">
							<h1 className="text-4xl lg:text-5xl font-bold mb-4 text-primary">
								Choose Your Plan
							</h1>
							<p className="text-lg text-muted-foreground">
								Select the perfect plan for your business needs
							</p>
						</div>

						<PricingTable
							for="organization"
							newSubscriptionRedirectUrl="/home"
							appearance={{
								elements: {
									// Root container
									rootBox: {
										backgroundColor: "transparent",
										border: "none",
									},
									// Card styling
									card: {
										backgroundColor: isDark
											? "oklch(0.21 0.006 285.885)"
											: "oklch(1 0 0)",
										border: `1px solid ${isDark ? "oklch(0.27 0.013 285.805)" : "oklch(0.911 0.006 286.286)"}`,
										borderRadius: "var(--radius-lg)",
										boxShadow: isDark
											? "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -1px rgb(0 0 0 / 0.2)"
											: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
									},
									cardBox: {
										padding: "1.5rem",
									},
									// Popular badge
									badge: {
										backgroundColor: "rgb(0, 166, 244)",
										color: "white",
										borderRadius: "9999px",
										padding: "0.25rem 0.75rem",
										fontSize: "0.875rem",
										fontWeight: "500",
									},
									// Plan name
									planName: {
										color: isDark
											? "oklch(0.985 0 0)"
											: "oklch(0.141 0.005 285.823)",
										fontSize: "1.875rem",
										fontWeight: "600",
										marginBottom: "0.5rem",
									},
									// Plan description
									planDescription: {
										color: isDark
											? "oklch(0.705 0.015 286.067)"
											: "oklch(0.552 0.016 285.938)",
										fontSize: "0.875rem",
										lineHeight: "1.25rem",
										marginBottom: "1rem",
									},
									// Price
									planPrice: {
										color: isDark
											? "oklch(0.985 0 0)"
											: "oklch(0.141 0.005 285.823)",
										fontSize: "2.25rem",
										fontWeight: "600",
										display: "flex",
										alignItems: "baseline",
									},
									planPriceCurrency: {
										fontSize: "2.25rem",
									},
									planPriceText: {
										fontSize: "2.25rem",
									},
									planPricePeriod: {
										color: isDark
											? "oklch(0.705 0.015 286.067)"
											: "oklch(0.552 0.016 285.938)",
										fontSize: "1rem",
										marginLeft: "0.25rem",
									},
									// CTA Button
									buttonPrimary: {
										backgroundColor: "rgb(0, 166, 244)",
										color: "white",
										borderRadius: "var(--radius-md)",
										padding: "0.625rem 3rem",
										fontSize: "1rem",
										fontWeight: "500",
										transition: "all 0.2s",
										border: "none",
										"&:hover": {
											opacity: "0.9",
											transform: "translateY(-1px)",
										},
										"&:focus": {
											outline: "2px solid rgb(0, 166, 244)",
											outlineOffset: "2px",
										},
									},
									buttonSecondary: {
										backgroundColor: isDark
											? "oklch(0.244 0.006 286.033)"
											: "oklch(0.92 0.004 286.32)",
										color: isDark
											? "oklch(0.985 0 0)"
											: "oklch(0.141 0.005 285.823)",
										border: `1px solid ${isDark ? "oklch(0.27 0.013 285.805)" : "oklch(0.911 0.006 286.286)"}`,
										borderRadius: "var(--radius-md)",
										padding: "0.625rem 3rem",
										fontSize: "1rem",
										fontWeight: "500",
										transition: "all 0.2s",
										"&:hover": {
											backgroundColor: isDark
												? "oklch(0.274 0.006 286.033)"
												: "oklch(0.92 0.004 286.32)",
										},
										"&:focus": {
											outline: "2px solid rgb(0, 166, 244)",
											outlineOffset: "2px",
										},
									},
									// Features list
									featureList: {
										marginTop: "1.5rem",
										display: "flex",
										flexDirection: "column",
										gap: "0.5rem",
									},
									featureListItem: {
										color: isDark
											? "oklch(0.705 0.015 286.067)"
											: "oklch(0.552 0.016 285.938)",
										fontSize: "0.875rem",
										display: "flex",
										alignItems: "center",
										gap: "0.75rem",
									},
									featureListItemIcon: {
										color: "rgb(0, 166, 244)",
										width: "1.25rem",
										height: "1.25rem",
										flexShrink: "0",
									},
									// Billing period toggle
									switchContainer: {
										display: "flex",
										justifyContent: "center",
										marginBottom: "2rem",
									},
									switchButton: {
										backgroundColor: isDark
											? "oklch(0.21 0.006 285.885)"
											: "oklch(0.967 0.001 286.375)",
										color: isDark
											? "oklch(0.705 0.015 286.067)"
											: "oklch(0.552 0.016 285.938)",
										borderRadius: "9999px",
										padding: "0.25rem",
										border: `1px solid ${isDark ? "oklch(0.27 0.013 285.805)" : "oklch(0.911 0.006 286.286)"}`,
									},
									switchButtonActive: {
										backgroundColor: "rgb(0, 166, 244)",
										color: "white",
										boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
									},
								},
								variables: {
									colorPrimary: "rgb(0, 166, 244)",
									colorText: isDark
										? "oklch(0.985 0 0)"
										: "oklch(0.141 0.005 285.823)",
									colorTextSecondary: isDark
										? "oklch(0.705 0.015 286.067)"
										: "oklch(0.552 0.016 285.938)",
									colorBackground: isDark
										? "oklch(0.091 0.005 285.823)"
										: "oklch(1 0 0)",
									colorInputBackground: isDark
										? "oklch(0.32 0.013 285.805)"
										: "oklch(0.871 0.006 286.286)",
									colorInputText: isDark
										? "oklch(0.985 0 0)"
										: "oklch(0.141 0.005 285.823)",
									borderRadius: "0.5rem",
									fontFamily: "var(--font-geist-sans)",
									fontSize: "1rem",
								},
							}}
							checkoutProps={{
								appearance: {
									elements: {
										// Make checkout modal completely opaque
										modalBackdrop: {
											backgroundColor: isDark
												? "rgba(0, 0, 0, 0.9)"
												: "rgba(0, 0, 0, 0.7)",
											backdropFilter: "blur(8px)",
										},
										modalContent: {
											backgroundColor: isDark
												? "oklch(0.21 0.006 285.885)"
												: "oklch(1 0 0)",
											opacity: "1",
										},
										card: {
											backgroundColor: isDark
												? "oklch(0.21 0.006 285.885)"
												: "oklch(1 0 0)",
											border: `1px solid ${isDark ? "oklch(0.27 0.013 285.805)" : "oklch(0.911 0.006 286.286)"}`,
											borderRadius: "var(--radius-lg)",
											opacity: "1",
										},
										rootBox: {
											backgroundColor: isDark
												? "oklch(0.21 0.006 285.885)"
												: "oklch(1 0 0)",
											opacity: "1",
										},
										formButtonPrimary: {
											backgroundColor: "rgb(0, 166, 244)",
											color: "white",
											borderRadius: "var(--radius-md)",
											fontSize: "1rem",
											fontWeight: "500",
											"&:hover": {
												opacity: "0.9",
											},
										},
										headerTitle: {
											color: isDark
												? "oklch(0.985 0 0)"
												: "oklch(0.141 0.005 285.823)",
											fontSize: "1.5rem",
											fontWeight: "600",
										},
										headerSubtitle: {
											color: isDark
												? "oklch(0.705 0.015 286.067)"
												: "oklch(0.552 0.016 285.938)",
											fontSize: "0.875rem",
										},
									},
									variables: {
										colorPrimary: "rgb(0, 166, 244)",
										colorText: isDark
											? "oklch(0.985 0 0)"
											: "oklch(0.141 0.005 285.823)",
										colorBackground: isDark
											? "oklch(0.21 0.006 285.885)"
											: "oklch(1 0 0)",
										borderRadius: "0.5rem",
										fontFamily: "var(--font-geist-sans)",
									},
								},
							}}
						/>

						{/* Back button underneath pricing table */}
						<div className="mt-8 flex justify-center lg:justify-start">
							<StyledButton
								onClick={() => router.push("/")}
								intent="outline"
								size="md"
								icon={<ArrowLeft className="w-4 h-4" />}
								showArrow={false}
							>
								Back to Home
							</StyledButton>
						</div>
					</div>
				</div>

				{/* Right side - Branding with OneTool logo */}
				<div className="hidden lg:flex items-center justify-center p-12 relative z-0">
					<div className="relative">
						{/* Glowing background effect */}
						<div
							className={`absolute inset-0 ${
								isDark ? "bg-primary/30" : "bg-primary/20"
							} rounded-full blur-3xl transform scale-150 animate-pulse`}
						/>

						{/* Logo with floating animation */}
						<div className="relative animate-float">
							<Image
								src="/OneTool.png"
								alt="OneTool"
								width={600}
								height={600}
								className="drop-shadow-2xl"
								priority
							/>
						</div>

						{/* Additional decorative elements */}
						<div className="absolute -top-10 -right-10 w-20 h-20 border-2 border-primary/30 rounded-full animate-ping" />
						<div className="absolute -bottom-10 -left-10 w-16 h-16 border-2 border-purple-500/30 rounded-full animate-ping animation-delay-2000" />
					</div>
				</div>
			</div>

			{/* Custom floating animation */}
			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					25% {
						transform: translateY(-20px) rotate(2deg);
					}
					50% {
						transform: translateY(-10px) rotate(-2deg);
					}
					75% {
						transform: translateY(-15px) rotate(1deg);
					}
				}

				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}
