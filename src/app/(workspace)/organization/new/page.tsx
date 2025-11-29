"use client";

import React from "react";
import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
	return (
		<div className="relative p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col items-center justify-center">
			<div className="w-full max-w-lg mx-auto">
				{/* Enhanced Header */}
				<div className="mb-10 text-center">
					<div className="flex items-center justify-center gap-3 mb-3">
						<div className="w-2 h-8 bg-linear-to-b from-primary to-primary/60 rounded-full" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
							Create Your Organization
						</h1>
						<div className="w-2 h-8 bg-linear-to-b from-primary to-primary/60 rounded-full" />
					</div>
					<p className="text-muted-foreground leading-relaxed">
						Set up your organization to get started with OneTool.
					</p>
				</div>

				{/* Clerk Create Organization Component */}
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
					<CreateOrganization
						appearance={{
							elements: {
								rootBox: "mx-auto w-full",
								card: "bg-transparent border-0 shadow-none p-0 w-full",
								headerTitle:
									"text-2xl font-bold text-foreground mb-2 tracking-tight",
								headerSubtitle:
									"text-sm text-muted-foreground mb-8 leading-relaxed",

								// Form styling
								form: "space-y-6",
								formFieldRow: "space-y-3",
								formFieldLabel:
									"text-sm font-semibold text-foreground tracking-wide",
								formFieldInput:
									"w-full bg-background dark:bg-card border-border dark:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2.5 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground transition-all duration-200 shadow-sm dark:shadow-none",
								formFieldInputShowPasswordButton:
									"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",

								// File upload styling
								fileDropAreaBox:
									"border-2 border-dashed border-border dark:border-border hover:border-primary/50 dark:hover:border-primary/50 rounded-lg p-6 text-center transition-colors bg-muted/20 dark:bg-muted/10",
								fileDropAreaButtonPrimary:
									"text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium",
								fileDropAreaIcon:
									"text-muted-foreground dark:text-muted-foreground mb-2",
								fileDropAreaText: "text-foreground dark:text-foreground",

								// Button styling
								formButtonPrimary:
									"w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-200 border-0",

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
								formFieldInputPlaceholder:
									"text-muted-foreground dark:text-muted-foreground",
								spinner: "text-primary dark:text-primary",

								// Modal/popover styling (if any)
								modalContent:
									"bg-card dark:bg-card border-border dark:border-border shadow-xl dark:shadow-xl",
								modalCloseButton:
									"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",

								// Additional dark mode elements
								identityPreview:
									"bg-background dark:bg-card border-border dark:border-border",
								identityPreviewText: "text-foreground dark:text-foreground",
								identityPreviewEditButton:
									"text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80",
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
						routing="path"
						path="/organization/new"
						skipInvitationScreen={true}
						hideSlug={true}
						afterCreateOrganizationUrl="/organization/complete"
					/>
				</div>

				{/* Help Text */}
				<div className="mt-6 text-center">
					<p className="text-xs text-muted-foreground">
						After creating your organization, you&apos;ll be able to add team
						members and customize settings.
					</p>
				</div>
			</div>
		</div>
	);
}
