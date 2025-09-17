"use client";

import React from "react";
import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
	return (
		<div className="relative p-8 min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col py-8">
				{/* Enhanced Header */}
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
							Organization Settings
						</h1>
					</div>
					<p className="text-muted-foreground ml-5 leading-relaxed">
						Manage your organization settings, members, and permissions.
					</p>
				</div>

				{/* Clerk Organization Profile Component */}
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 flex-shrink-0">
					<OrganizationProfile
						appearance={{
							elements: {
								rootBox: "w-full",
								card: "bg-transparent border-0 shadow-none w-full p-0",

								// Header styling
								headerTitle:
									"text-2xl font-bold text-foreground mb-2 tracking-tight",
								headerSubtitle:
									"text-sm text-muted-foreground mb-6 leading-relaxed",

								// Navigation styling
								navbar: "border-b border-border mb-8 pb-4",
								navbarButton:
									"px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 font-medium",
								navbarButtonActive:
									"bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm",

								// Page content styling
								pageScrollBox: "bg-transparent",
								page: "space-y-8",

								// Form styling
								form: "space-y-6",
								formFieldRow: "space-y-3",
								formFieldLabel:
									"text-sm font-semibold text-foreground tracking-wide",
								formFieldInput:
									"w-full bg-background dark:bg-card border-border dark:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2.5 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground transition-all duration-200 shadow-sm dark:shadow-none",
								formFieldInputShowPasswordButton:
									"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",

								// Button styling
								formButtonPrimary:
									"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-200 border-0",
								formButtonSecondary:
									"bg-muted hover:bg-muted/80 dark:bg-muted dark:hover:bg-muted/80 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground font-medium py-2.5 px-6 rounded-lg border border-border dark:border-border transition-all duration-200",

								// Table styling
								table: "w-full border-collapse",
								tableHead:
									"border-b border-border dark:border-border bg-muted/30 dark:bg-muted/30",
								tableHeadRow: "border-b border-border dark:border-border",
								tableHeadCell:
									"text-left p-4 font-semibold text-foreground dark:text-foreground text-sm",
								tableBody: "divide-y divide-border dark:divide-border",
								tableRow:
									"hover:bg-muted/30 dark:hover:bg-muted/30 transition-colors",
								tableCell: "p-4 text-sm text-foreground dark:text-foreground",

								// Badge/status styling
								badge:
									"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
								badgeSecondary:
									"bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground",
								badgePrimary: "bg-primary text-primary-foreground",

								// Member list styling
								membersPageInviteButton:
									"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-200 border-0",

								// Avatar styling
								avatarBox:
									"w-10 h-10 rounded-lg bg-muted dark:bg-muted flex items-center justify-center",
								avatarImage: "w-10 h-10 rounded-lg object-cover",

								// Footer styling
								footer: "mt-8 pt-6 border-t border-border dark:border-border",
								footerActionText:
									"text-xs text-muted-foreground dark:text-muted-foreground",
								footerActionLink:
									"text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium text-xs",

								// Error and success styling
								formFieldSuccessText:
									"text-green-600 dark:text-green-400 text-sm",
								formFieldErrorText: "text-red-600 dark:text-red-400 text-sm",
								formFieldWarningText:
									"text-yellow-600 dark:text-yellow-400 text-sm",

								// Loading states
								spinner: "text-primary dark:text-primary",

								// Modal styling
								modalContent:
									"bg-card dark:bg-card border-border dark:border-border shadow-xl dark:shadow-xl rounded-xl",
								modalCloseButton:
									"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
							},
							variables: {
								// Color system that works in both light and dark mode
								colorPrimary: "hsl(var(--primary))",
								colorDanger: "hsl(var(--destructive))",
								colorSuccess: "hsl(var(--green-600))",
								colorWarning: "hsl(var(--yellow-600))",
								colorNeutral: "hsl(var(--muted-foreground))",

								// Background colors
								colorBackground: "hsl(var(--background))",
								colorInputBackground: "hsl(var(--background))",

								// Text colors
								colorText: "hsl(var(--foreground))",
								colorTextSecondary: "hsl(var(--muted-foreground))",
								colorInputText: "hsl(var(--foreground))",
								colorTextOnPrimaryBackground: "hsl(var(--primary-foreground))",

								// Typography
								fontFamily: "inherit",
								fontFamilyButtons: "inherit",
								fontSize: "0.875rem",
								fontWeight: {
									normal: "400",
									medium: "500",
									semibold: "600",
									bold: "700",
								},

								// Spacing and shapes
								borderRadius: "0.5rem",
								spacingUnit: "1rem",
							},
						}}
						afterLeaveOrganizationUrl="/organization/new"
					/>
				</div>
			</div>
		</div>
	);
}
