"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import {
	Upload,
	Trash2,
	Globe,
	GlobeLock,
	Copy,
	Check,
	ExternalLink,
	Save,
	Send,
	Loader2,
	ImageIcon,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import type { JSONContent } from "@tiptap/react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { StyledInput } from "@/components/ui/styled/styled-input";
import {
	StyledCard,
	StyledCardContent,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardDescription,
} from "@/components/ui/styled/styled-card";
import { CommunityEditor } from "@/components/tiptap/community-editor";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@onetool/backend/convex/_generated/api";
import type { Id } from "@onetool/backend/convex/_generated/dataModel";

// Maximum file sizes
const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

export default function CommunityEditPage() {
	const router = useRouter();
	const toast = useToast();

	// Queries
	const communityPage = useQuery(api.communityPages.get);
	const organization = useQuery(api.organizations.get);

	// Mutations
	const upsert = useMutation(api.communityPages.upsert);
	const publish = useMutation(api.communityPages.publish);
	const generateUploadUrl = useMutation(api.communityPages.generateUploadUrl);
	const deleteBanner = useMutation(api.communityPages.deleteBannerImage);
	const deleteAvatar = useMutation(api.communityPages.deleteAvatarImage);

	// Form state
	const [pageTitle, setPageTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [metaDescription, setMetaDescription] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [draftContent, setDraftContent] = useState<JSONContent | undefined>();

	// Image states
	const [bannerUrl, setBannerUrl] = useState<string | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [bannerStorageId, setBannerStorageId] = useState<Id<"_storage"> | null>(null);
	const [avatarStorageId, setAvatarStorageId] = useState<Id<"_storage"> | null>(null);

	// UI states
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUploadingBanner, setIsUploadingBanner] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [slugError, setSlugError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [debouncedSlug, setDebouncedSlug] = useState("");

	// Check slug availability (debounced)
	useEffect(() => {
		if (slug.length < 3) {
			setDebouncedSlug("");
			return;
		}
		const timer = setTimeout(() => setDebouncedSlug(slug), 300);
		return () => clearTimeout(timer);
	}, [slug]);

	const isSlugAvailable = useQuery(
		api.communityPages.checkSlugAvailable,
		debouncedSlug.length >= 3 ? { slug: debouncedSlug } : "skip"
	);

	// Refs
	const bannerInputRef = useRef<HTMLInputElement>(null);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	// Redirect to /community if no page exists (create flow is there)
	useEffect(() => {
		if (communityPage === null) {
			router.replace("/community");
		}
	}, [communityPage, router]);

	// Initialize form from existing data
	useEffect(() => {
		if (communityPage) {
			setPageTitle(communityPage.pageTitle || "");
			setSlug(communityPage.slug);
			setMetaDescription(communityPage.metaDescription || "");
			setIsPublic(communityPage.isPublic);
			setDraftContent(communityPage.draftContent as JSONContent | undefined);
			setBannerStorageId(communityPage.bannerStorageId || null);
			setAvatarStorageId(communityPage.avatarStorageId || null);
		}
	}, [communityPage]);

	// Fetch image URLs when storage IDs change
	const bannerUrlQuery = useQuery(
		api.communityPages.getImageUrl,
		bannerStorageId ? { storageId: bannerStorageId } : "skip"
	);
	const avatarUrlQuery = useQuery(
		api.communityPages.getImageUrl,
		avatarStorageId ? { storageId: avatarStorageId } : "skip"
	);

	useEffect(() => {
		if (bannerUrlQuery) setBannerUrl(bannerUrlQuery);
	}, [bannerUrlQuery]);

	useEffect(() => {
		if (avatarUrlQuery) setAvatarUrl(avatarUrlQuery);
		else if (!avatarStorageId && organization?.logoUrl) {
			setAvatarUrl(organization.logoUrl);
		}
	}, [avatarUrlQuery, avatarStorageId, organization?.logoUrl]);

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
		setHasUnsavedChanges(true);
	};

	// Image upload handler
	const handleImageUpload = async (
		file: File,
		type: "banner" | "avatar"
	) => {
		const maxSize = type === "banner" ? MAX_BANNER_SIZE : MAX_AVATAR_SIZE;
		const setUploading = type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

		if (file.size > maxSize) {
			toast.error(
				"File too large",
				`Maximum size is ${maxSize / 1024 / 1024}MB`
			);
			return;
		}

		if (!file.type.startsWith("image/")) {
			toast.error(
				"Invalid file type",
				"Please upload an image file"
			);
			return;
		}

		setUploading(true);

		try {
			const uploadUrl = await generateUploadUrl();
			const response = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			});

			if (!response.ok) throw new Error("Upload failed");

			const { storageId } = await response.json();

			if (type === "banner") {
				setBannerStorageId(storageId);
			} else {
				setAvatarStorageId(storageId);
			}

			setHasUnsavedChanges(true);
			toast.success(
				"Image uploaded",
				"Don't forget to save your changes"
			);
		} catch {
			toast.error(
				"Upload failed",
				"Please try again"
			);
		} finally {
			setUploading(false);
		}
	};

	// Save draft
	const handleSaveDraft = async () => {
		if (!validateSlug(slug)) return;

		setIsSaving(true);
		try {
			await upsert({
				slug,
				isPublic,
				pageTitle: pageTitle || undefined,
				metaDescription: metaDescription || undefined,
				draftContent,
				bannerStorageId: bannerStorageId || undefined,
				avatarStorageId: avatarStorageId || undefined,
			});

			setHasUnsavedChanges(false);
			toast.success(
				"Draft saved",
				"Your changes have been saved"
			);
		} catch (error) {
			toast.error(
				"Save failed",
				error instanceof Error ? error.message : "Please try again"
			);
		} finally {
			setIsSaving(false);
		}
	};

	// Publish
	const handlePublish = async () => {
		if (!validateSlug(slug)) return;

		setIsPublishing(true);
		try {
			// First save
			await upsert({
				slug,
				isPublic,
				pageTitle: pageTitle || undefined,
				metaDescription: metaDescription || undefined,
				draftContent,
				bannerStorageId: bannerStorageId || undefined,
				avatarStorageId: avatarStorageId || undefined,
			});

			// Then publish
			await publish();

			setHasUnsavedChanges(false);
			toast.success(
				"Published!",
				isPublic
					? "Your community page is now live"
					: "Your page has been published (but is not yet public)"
			);
		} catch (error) {
			toast.error(
				"Publish failed",
				error instanceof Error ? error.message : "Please try again"
			);
		} finally {
			setIsPublishing(false);
		}
	};

	// Toggle public
	const handleTogglePublic = async () => {
		const newIsPublic = !isPublic;
		setIsPublic(newIsPublic);
		setHasUnsavedChanges(true);

		// Auto-save the toggle
		try {
			await upsert({ isPublic: newIsPublic });
			toast.success(
				newIsPublic ? "Page is now public" : "Page is now private",
				newIsPublic
					? "Anyone with the link can view your page"
					: "Only you can see your page"
			);
		} catch {
			setIsPublic(!newIsPublic); // Revert on error
		}
	};

	// Copy URL
	const handleCopyUrl = () => {
		const url = `${window.location.origin}/communities/${slug}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.success(
			"URL copied",
			"Share this link with your audience"
		);
	};

	// Delete banner
	const handleDeleteBanner = async () => {
		try {
			await deleteBanner();
			setBannerStorageId(null);
			setBannerUrl(null);
			toast.success("Banner removed");
		} catch {
			toast.error("Failed to remove banner");
		}
	};

	// Delete avatar
	const handleDeleteAvatar = async () => {
		try {
			await deleteAvatar();
			setAvatarStorageId(null);
			setAvatarUrl(organization?.logoUrl || null);
			toast.success("Avatar removed", "Using organization logo");
		} catch {
			toast.error("Failed to remove avatar");
		}
	};

	const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/communities/${slug}`;
	const hasPublishedContent = communityPage?.publishedContent !== undefined;

	// Loading state
	if (communityPage === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="size-8 animate-spin text-muted-fg" />
			</div>
		);
	}

	// Redirecting to /community (no page exists)
	if (communityPage === null) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="size-8 animate-spin text-muted-fg" />
			</div>
		);
	}

	return (
		<div className="relative p-4 sm:p-6 lg:p-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button
						intent="outline"
						size="sq-sm"
						onPress={() => router.push("/community")}
						aria-label="Back to Community"
					>
						<ArrowLeft className="size-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-fg">Edit Community Page</h1>
						<p className="text-muted-fg mt-1">
							Customize your public business page
						</p>
					</div>
				</div>

				{/* Public URL Display */}
				{isPublic && (
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
						<Globe className="size-4 text-success" />
						<span className="text-sm text-success font-medium">Live</span>
						<button
							onClick={handleCopyUrl}
							className="ml-2 text-sm text-success hover:text-success/80 underline flex items-center gap-1"
						>
							{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
							{copied ? "Copied!" : "Copy URL"}
						</button>
						<a
							href={publicUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-success hover:text-success/80"
						>
							<ExternalLink className="size-4" />
						</a>
					</div>
				)}
			</div>

			{/* Unsaved Changes Warning */}
			{hasUnsavedChanges && (
				<div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning/10 border border-warning/20">
					<AlertCircle className="size-4 text-warning" />
					<span className="text-sm text-warning">You have unsaved changes</span>
				</div>
			)}

			{/* Banner Image */}
			<StyledCard>
				<StyledCardHeader>
					<StyledCardTitle>Banner Image</StyledCardTitle>
					<StyledCardDescription>
						A hero image displayed at the top of your page (recommended: 1920x400px)
					</StyledCardDescription>
				</StyledCardHeader>
				<StyledCardContent>
					<div
						className={cn(
							"relative w-full aspect-[4.8/1] rounded-xl overflow-hidden border-2 border-dashed border-border",
							"hover:border-primary/50 transition-colors cursor-pointer",
							isUploadingBanner && "opacity-50 pointer-events-none"
						)}
						onClick={() => bannerInputRef.current?.click()}
					>
						{bannerUrl ? (
							<>
								<Image
									src={bannerUrl}
									alt="Banner"
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
									<Button
										intent="secondary"
										size="sm"
										onPress={() => bannerInputRef.current?.click()}
									>
										<Upload className="size-4 mr-2" />
										Replace
									</Button>
									<Button
										intent="destructive"
										size="sm"
										onPress={() => {
											handleDeleteBanner();
										}}
									>
										<Trash2 className="size-4 mr-2" />
										Remove
									</Button>
								</div>
							</>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-fg">
								{isUploadingBanner ? (
									<Loader2 className="size-8 animate-spin" />
								) : (
									<>
										<ImageIcon className="size-12" />
										<span className="text-sm">Click to upload banner image</span>
										<span className="text-xs">Max 5MB, recommended 1920x400px</span>
									</>
								)}
							</div>
						)}
					</div>
					<input
						ref={bannerInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleImageUpload(file, "banner");
							e.target.value = "";
						}}
					/>
				</StyledCardContent>
			</StyledCard>

			{/* Avatar Image */}
			<StyledCard>
				<StyledCardHeader>
					<StyledCardTitle>Avatar / Logo</StyledCardTitle>
					<StyledCardDescription>
						A square image for your profile (falls back to organization logo if not set)
					</StyledCardDescription>
				</StyledCardHeader>
				<StyledCardContent>
					<div className="flex items-center gap-6">
						<div
							className={cn(
								"relative size-24 rounded-xl overflow-hidden border-2 border-dashed border-border",
								"hover:border-primary/50 transition-colors cursor-pointer",
								isUploadingAvatar && "opacity-50 pointer-events-none"
							)}
							onClick={() => avatarInputRef.current?.click()}
						>
							{avatarUrl ? (
								<Image
									src={avatarUrl}
									alt="Avatar"
									fill
									className="object-cover"
								/>
							) : (
								<div className="absolute inset-0 flex items-center justify-center text-muted-fg">
									{isUploadingAvatar ? (
										<Loader2 className="size-6 animate-spin" />
									) : (
										<ImageIcon className="size-8" />
									)}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Button
								intent="outline"
								size="sm"
								onPress={() => avatarInputRef.current?.click()}
								isDisabled={isUploadingAvatar}
							>
								<Upload className="size-4 mr-2" />
								Upload Avatar
							</Button>
							{avatarStorageId && (
								<Button
									intent="plain"
									size="sm"
									onPress={handleDeleteAvatar}
								>
									<Trash2 className="size-4 mr-2" />
									Use Organization Logo
								</Button>
							)}
						</div>
					</div>
					<input
						ref={avatarInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleImageUpload(file, "avatar");
							e.target.value = "";
						}}
					/>
				</StyledCardContent>
			</StyledCard>

			{/* Page Settings */}
			<StyledCard>
				<StyledCardHeader className="pb-6">
					<StyledCardTitle>Page Settings</StyledCardTitle>
					<StyledCardDescription className="mt-2">
						Configure your page title, URL, and SEO settings
					</StyledCardDescription>
				</StyledCardHeader>
				<StyledCardContent className="space-y-8">
					{/* Page Title and URL in a grid on larger screens */}
					<div className="grid gap-8 lg:grid-cols-2">
						<div className="space-y-3">
							<Label htmlFor="pageTitle">Page Title</Label>
							<StyledInput
								id="pageTitle"
								value={pageTitle}
								onChange={(e) => {
									setPageTitle(e.target.value);
									setHasUnsavedChanges(true);
								}}
								placeholder={organization?.name || "Your Business Name"}
							/>
							<p className="text-xs text-muted-fg">
								This will be displayed as the main heading on your page
							</p>
						</div>

						<div className="space-y-3">
							<Label htmlFor="slug">Page URL</Label>
							<div className="flex items-center gap-3">
								<div className="flex">
									<div className="flex shrink-0 items-center rounded-l-md bg-muted px-3 py-2 text-sm text-muted-fg border border-r-0 border-border">
										onetool.biz/communities/
									</div>
									<input
										id="slug"
										type="text"
										value={slug}
										onChange={handleSlugChange}
										placeholder="your-business-name"
										className={cn(
											"block w-48 rounded-r-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
											slugError && "border-danger focus:ring-danger",
											!slugError && isSlugAvailable === false && "border-danger focus:ring-danger"
										)}
									/>
								</div>
								{slugError ? (
									<span className="text-sm text-danger">{slugError}</span>
								) : slug.length >= 3 && debouncedSlug === slug && isSlugAvailable !== undefined ? (
									<div className="flex items-center gap-1.5">
										<span
											className={cn(
												"size-2 rounded-full",
												isSlugAvailable ? "bg-green-500" : "bg-red-500"
											)}
										/>
										<span
											className={cn(
												"text-sm font-medium",
												isSlugAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
											)}
										>
											{isSlugAvailable ? "Available" : "Taken"}
										</span>
									</div>
								) : null}
							</div>
							<p className="text-xs text-muted-fg">
								Only lowercase letters, numbers, and hyphens allowed
							</p>
						</div>
					</div>

					{/* SEO Description - full width */}
					<div className="space-y-3">
						<Label htmlFor="metaDescription">SEO Description</Label>
						<StyledInput
							id="metaDescription"
							value={metaDescription}
							onChange={(e) => {
								setMetaDescription(e.target.value);
								setHasUnsavedChanges(true);
							}}
							placeholder="A brief description for search engines (optional)"
						/>
						<p className="text-xs text-muted-fg">
							{metaDescription.length}/160 characters recommended for search engines
						</p>
					</div>

					{/* Public Toggle */}
					<div className="flex items-center justify-between p-5 rounded-xl bg-muted/50 border border-border">
						<div className="flex items-center gap-4">
							{isPublic ? (
								<div className="flex items-center justify-center size-10 rounded-full bg-success/10">
									<Globe className="size-5 text-success" />
								</div>
							) : (
								<div className="flex items-center justify-center size-10 rounded-full bg-muted">
									<GlobeLock className="size-5 text-muted-fg" />
								</div>
							)}
							<div>
								<p className="font-semibold text-fg">
									{isPublic ? "Public" : "Private"}
								</p>
								<p className="text-sm text-muted-fg">
									{isPublic
										? "Anyone with the link can view this page"
										: "Only you can see this page"}
								</p>
							</div>
						</div>
						<StyledButton
							intent={isPublic ? "secondary" : "primary"}
							size="sm"
							onClick={handleTogglePublic}
						>
							{isPublic ? "Make Private" : "Make Public"}
						</StyledButton>
					</div>
				</StyledCardContent>
			</StyledCard>

			{/* Content Editor */}
			<StyledCard>
				<StyledCardHeader>
					<StyledCardTitle>Page Content</StyledCardTitle>
					<StyledCardDescription>
						Use the editor to create your community page content
					</StyledCardDescription>
				</StyledCardHeader>
				<StyledCardContent>
					<CommunityEditor
						content={draftContent}
						onChange={(content) => {
							setDraftContent(content);
							setHasUnsavedChanges(true);
						}}
						placeholder="Start writing about your business, services, and what makes you unique..."
					/>
				</StyledCardContent>
			</StyledCard>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-muted/30 border border-border">
				<div className="text-sm text-muted-fg">
					{hasPublishedContent ? (
						<>Last published: {new Date(communityPage.publishedAt!).toLocaleDateString()}</>
					) : (
						"Not yet published"
					)}
				</div>

				<div className="flex items-center gap-3">
					<StyledButton
						intent="secondary"
						onClick={handleSaveDraft}
						disabled={isSaving || isPublishing || !!slugError || isSlugAvailable === false}
					>
						{isSaving ? (
							<Loader2 className="size-4 mr-2 animate-spin" />
						) : (
							<Save className="size-4 mr-2" />
						)}
						Save Draft
					</StyledButton>

					<StyledButton
						intent="primary"
						onClick={handlePublish}
						disabled={isSaving || isPublishing || !draftContent || !!slugError || isSlugAvailable === false}
					>
						{isPublishing ? (
							<Loader2 className="size-4 mr-2 animate-spin" />
						) : (
							<Send className="size-4 mr-2" />
						)}
						Publish
					</StyledButton>
				</div>
			</div>
		</div>
	);
}
