"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import {
	Globe,
	ImageIcon,
	Send,
	Loader2,
	Clock,
	CheckCircle2,
	ExternalLink,
	Edit,
	Copy,
	Check,
	Eye,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { StyledInput } from "@/components/ui/styled/styled-input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@onetool/backend/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";

const COPY_FEEDBACK_DURATION_MS = 2000;

export default function CommunityPage() {
	const router = useRouter();
	const toast = useToast();
	const { organization: clerkOrganization } = useOrganization();

	// Queries
	const communityPage = useQuery(api.communityPages.get);
	const organization = useQuery(api.organizations.get);

	// Mutations
	const upsert = useMutation(api.communityPages.upsert);

	// Form state for creation
	const [pageTitle, setPageTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [slugError, setSlugError] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [copied, setCopied] = useState(false);

	// Initialize form from organization data
	useEffect(() => {
		if (communityPage === null && organization) {
			const defaultSlug = organization.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")
				.substring(0, 50);
			setSlug(defaultSlug);
			setPageTitle(organization.name);
		}
	}, [communityPage, organization]);

	// Slug validation
	const validateSlug = useCallback((value: string) => {
		if (!/^[a-z0-9-]*$/.test(value)) {
			setSlugError("Only lowercase letters, numbers, and hyphens allowed");
			return false;
		}
		if (value.length < 3) {
			setSlugError("Slug must be at least 3 characters");
			return false;
		}
		if (value.length > 50) {
			setSlugError("Slug must be 50 characters or less");
			return false;
		}
		setSlugError(null);
		return true;
	}, []);

	// Handle slug change
	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
		setSlug(value);
		validateSlug(value);
	};

	// Create initial community page
	const handleCreatePage = async () => {
		if (!validateSlug(slug)) return;

		setIsCreating(true);
		try {
			await upsert({
				slug,
				isPublic: false,
				pageTitle: pageTitle || undefined,
			});
			toast.success(
				"Community page created",
				"Now customize your page"
			);
			router.push("/community/edit");
		} catch (error) {
			toast.error(
				"Creation failed",
				error instanceof Error ? error.message : "Please try again"
			);
		} finally {
			setIsCreating(false);
		}
	};

	// Copy URL
	const handleCopyUrl = useCallback(() => {
		if (!communityPage?.slug) return;
		const url = `${window.location.origin}/communities/${communityPage.slug}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
		toast.success("URL copied", "Share this link with your audience");
	}, [communityPage?.slug, toast]);

	// Format date helper
	const formatDate = (timestamp?: number) => {
		if (!timestamp) return null;
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const pageUrl = communityPage?.slug
		? `${typeof window !== "undefined" ? window.location.origin : ""}/communities/${communityPage.slug}`
		: "";

	// Loading state
	if (communityPage === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="size-8 animate-spin text-muted-fg" />
			</div>
		);
	}

	// No community page exists - show creation prompt
	if (communityPage === null) {
		return (
			<div className="relative p-4 sm:p-6 lg:p-8">
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
							<Globe className="size-10 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-foreground">
								Create Your Community Page
							</h1>
							<p className="text-muted-foreground mt-2 max-w-md mx-auto">
								Build a public page to showcase your business, share your services,
								and let potential customers express their interest.
							</p>
						</div>
					</div>

					{/* Benefits */}
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="p-4 rounded-xl bg-muted/30 border border-border/50">
							<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
								<Globe className="size-5 text-primary" />
							</div>
							<h3 className="font-semibold text-foreground mb-1">Online Presence</h3>
							<p className="text-sm text-muted-foreground">
								Create a professional landing page for your business
							</p>
						</div>
						<div className="p-4 rounded-xl bg-muted/30 border border-border/50">
							<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
								<ImageIcon className="size-5 text-primary" />
							</div>
							<h3 className="font-semibold text-foreground mb-1">Rich Content</h3>
							<p className="text-sm text-muted-foreground">
								Add banners, images, and formatted content
							</p>
						</div>
						<div className="p-4 rounded-xl bg-muted/30 border border-border/50">
							<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
								<Send className="size-5 text-primary" />
							</div>
							<h3 className="font-semibold text-foreground mb-1">Collect Leads</h3>
							<p className="text-sm text-muted-foreground">
								Let visitors submit interest forms directly
							</p>
						</div>
					</div>

					{/* Setup Form */}
					<div className="space-y-4 pt-4 border-t border-border/50">
						<div className="space-y-2">
							<Label htmlFor="pageTitle">Page Title</Label>
							<StyledInput
								id="pageTitle"
								value={pageTitle}
								onChange={(e) => setPageTitle(e.target.value)}
								placeholder={organization?.name || "Your Business Name"}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="slug">URL Slug</Label>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground whitespace-nowrap">
									/communities/
								</span>
								<StyledInput
									id="slug"
									value={slug}
									onChange={handleSlugChange}
									placeholder="your-business-name"
									className={cn(slugError && "border-danger")}
								/>
							</div>
							{slugError && (
								<p className="text-sm text-danger">{slugError}</p>
							)}
						</div>
					</div>

					{/* Create Button */}
					<div className="flex justify-center pt-4">
						<StyledButton
							intent="primary"
							size="lg"
							onClick={handleCreatePage}
							disabled={isCreating || !slug || !!slugError}
						>
							{isCreating ? (
								<Loader2 className="size-5 mr-2 animate-spin" />
							) : (
								<Globe className="size-5 mr-2" />
							)}
							Create Community Page
						</StyledButton>
					</div>
				</div>
			</div>
		);
	}

	// Page exists but not public (draft)
	if (!communityPage.isPublic) {
		return (
			<div className="relative p-4 sm:p-6 lg:p-8">
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 space-y-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
								<h1 className="text-2xl font-semibold text-foreground tracking-tight">
									Community Page
								</h1>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
									<Clock className="size-3" />
									Draft
								</span>
							</div>
							<p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
								Your community page is set up but not yet visible to the public.
							</p>
						</div>
					</div>

					{/* Page Details Card */}
					<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-4">
						<div className="flex items-start gap-4">
							<div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
								<Globe className="size-6 text-amber-700 dark:text-amber-400" />
							</div>
							<div className="flex-1 min-w-0 space-y-1">
								<h3 className="font-semibold text-foreground">
									{communityPage.pageTitle || clerkOrganization?.name || "Your Community Page"}
								</h3>
								<p className="text-sm text-muted-foreground font-mono truncate">
									/communities/{communityPage.slug}
								</p>
								{communityPage.updatedAt && (
									<p className="text-xs text-muted-foreground">
										Last updated: {formatDate(communityPage.updatedAt)}
									</p>
								)}
							</div>
						</div>

						<div className="flex flex-wrap gap-2 pt-2">
							<StyledButton
								intent="primary"
								size="sm"
								onClick={() => router.push("/community/edit")}
							>
								<Edit className="size-4 mr-2" />
								Edit Page
							</StyledButton>
							<StyledButton
								intent="secondary"
								size="sm"
								onClick={() => router.push("/community/edit")}
							>
								<Eye className="size-4 mr-2" />
								Make Public
							</StyledButton>
						</div>
					</div>

					<p className="text-sm text-muted-foreground">
						Once you make your page public, anyone with the link can view it and submit interest forms.
					</p>
				</div>
			</div>
		);
	}

	// Page exists and is public
	return (
		<div className="relative p-4 sm:p-6 lg:p-8">
			<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 space-y-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<div className="w-1.5 h-6 bg-linear-to-b from-primary to-primary/60 rounded-full" />
							<h1 className="text-2xl font-semibold text-foreground tracking-tight">
								Community Page
							</h1>
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
								<CheckCircle2 className="size-3" />
								Live
							</span>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
							Your community page is live and accessible to anyone with the link.
						</p>
					</div>
				</div>

				{/* Live Page Card */}
				<div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-4">
					<div className="flex items-start gap-4">
						<div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
							<CheckCircle2 className="size-6 text-emerald-700 dark:text-emerald-400" />
						</div>
						<div className="flex-1 min-w-0 space-y-1">
							<h3 className="font-semibold text-foreground">
								{communityPage.pageTitle || clerkOrganization?.name || "Your Community Page"}
							</h3>
							<p className="text-sm text-muted-foreground font-mono truncate">
								{pageUrl}
							</p>
							{communityPage.publishedAt && (
								<p className="text-xs text-muted-foreground">
									Published: {formatDate(communityPage.publishedAt)}
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-wrap gap-2 pt-2">
						<a
							href={pageUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex"
						>
							<StyledButton intent="primary" size="sm">
								<ExternalLink className="size-4 mr-2" />
								View Live Page
							</StyledButton>
						</a>
						<StyledButton
							intent="secondary"
							size="sm"
							onClick={() => router.push("/community/edit")}
						>
							<Edit className="size-4 mr-2" />
							Edit Page
						</StyledButton>
						<StyledButton
							intent="plain"
							size="sm"
							onClick={handleCopyUrl}
						>
							{copied ? (
								<>
									<Check className="size-4 mr-2 text-emerald-600" />
									Copied!
								</>
							) : (
								<>
									<Copy className="size-4 mr-2" />
									Copy Link
								</>
							)}
						</StyledButton>
					</div>
				</div>

				<div className="rounded-lg border border-border/60 bg-muted/30 p-4">
					<p className="text-sm text-muted-foreground">
						<strong className="text-foreground">Tip:</strong> Share your community page link on social media,
						business cards, or email signatures to attract potential customers and generate leads.
					</p>
				</div>
			</div>
		</div>
	);
}
