"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { OrganizationProfile, useOrganization } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Users, Building2, Globe, AlertTriangle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SelectService from "@/components/choice-set";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../../../../../convex/_generated/api";

const TAB_VALUES = ["overview", "business", "preferences"] as const;
type TabValue = (typeof TAB_VALUES)[number];

const companySizeOptions = [
	{
		icon: Users,
		text: "1-10",
		value: "1-10",
	},
	{
		icon: Building2,
		text: "10-100",
		value: "10-100",
	},
	{
		icon: Globe,
		text: "100+",
		value: "100+",
	},
];

const primaryActionButtonClasses =
	"group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:text-primary disabled:hover:bg-primary/10 disabled:hover:ring-primary/30";

type BusinessFormState = {
	email: string;
	website: string;
	phone: string;
	addressStreet: string;
	addressCity: string;
	addressState: string;
	addressZip: string;
	companySize: string;
	logoInvertInDarkMode: boolean;
};

type PreferencesFormState = {
	defaultTaxRate: string;
	defaultReminderTiming: string;
	smsEnabled: boolean;
	monthlyRevenueTarget: string;
};

const initialBusinessForm: BusinessFormState = {
	email: "",
	website: "",
	phone: "",
	addressStreet: "",
	addressCity: "",
	addressState: "",
	addressZip: "",
	companySize: "",
	logoInvertInDarkMode: true,
};

const initialPreferencesForm: PreferencesFormState = {
	defaultTaxRate: "",
	defaultReminderTiming: "24",
	smsEnabled: false,
	monthlyRevenueTarget: "",
};

function parseAddress(address?: string) {
	if (!address) {
		return {
			street: "",
			city: "",
			state: "",
			zip: "",
		};
	}

	const parts = address.split(",").map((part) => part.trim());
	return {
		street: parts[0] ?? "",
		city: parts[1] ?? "",
		state: parts[2] ?? "",
		zip: parts[3] ?? "",
	};
}

const isTabValue = (value: string): value is TabValue =>
	TAB_VALUES.includes(value as TabValue);

export default function OrganizationProfilePage() {
	const params = useParams<{ rest?: string[] }>();
	const router = useRouter();
	const { organization: clerkOrganization } = useOrganization();
	const toast = useToast();

	const organization = useQuery(api.organizations.get, {});
	const currentUser = useQuery(api.users.current, {});
	const updateOrganization = useMutation(api.organizations.update);

	const [businessForm, setBusinessForm] =
		React.useState<BusinessFormState>(initialBusinessForm);
	const [preferencesForm, setPreferencesForm] =
		React.useState<PreferencesFormState>(initialPreferencesForm);
	const [businessDirty, setBusinessDirty] = React.useState(false);
	const [preferencesDirty, setPreferencesDirty] = React.useState(false);
	const [savingBusiness, setSavingBusiness] = React.useState(false);
	const [savingPreferences, setSavingPreferences] = React.useState(false);
	const lastOrganizationId = React.useRef<string | null>(null);

	const restSegments = Array.isArray(params?.rest) ? params.rest : [];
	const requestedTab = restSegments.length > 0 ? restSegments[0] : "overview";
	const activeTab: TabValue = isTabValue(requestedTab)
		? requestedTab
		: "overview";

	React.useEffect(() => {
		if (requestedTab && !isTabValue(requestedTab)) {
			router.replace("/organization/profile");
		}
	}, [requestedTab, router]);

	React.useEffect(() => {
		const currentOrgId = organization?._id ?? null;
		if (lastOrganizationId.current !== currentOrgId) {
			lastOrganizationId.current = currentOrgId;
			setBusinessDirty(false);
			setPreferencesDirty(false);
		}
	}, [organization?._id]);

	const handleTabChange = React.useCallback(
		(value: string) => {
			if (!isTabValue(value)) {
				return;
			}
			const basePath = "/organization/profile";
			if (value === "overview") {
				router.push(basePath);
			} else {
				router.push(`${basePath}/${value}`);
			}
		},
		[router]
	);

	React.useEffect(() => {
		if (organization === undefined) {
			return;
		}

		if (!businessDirty) {
			const { street, city, state, zip } = parseAddress(organization?.address);
			setBusinessForm({
				email: organization?.email ?? "",
				website: organization?.website?.replace(/^https?:\/\//i, "") ?? "",
				phone: organization?.phone ?? "",
				addressStreet: street,
				addressCity: city,
				addressState: state,
				addressZip: zip,
				companySize: organization?.companySize ?? "",
				logoInvertInDarkMode: organization?.logoInvertInDarkMode ?? true,
			});
		}

		if (!preferencesDirty) {
			setPreferencesForm({
				defaultTaxRate:
					organization?.defaultTaxRate !== undefined
						? organization.defaultTaxRate.toString()
						: "",
				defaultReminderTiming:
					organization?.defaultReminderTiming !== undefined
						? organization.defaultReminderTiming.toString()
						: "24",
				smsEnabled: organization?.smsEnabled ?? false,
				monthlyRevenueTarget:
					organization?.monthlyRevenueTarget !== undefined
						? organization.monthlyRevenueTarget.toString()
						: "",
			});
		}
	}, [organization, businessDirty, preferencesDirty]);

	const isLoading = organization === undefined || currentUser === undefined;
	const isOwner = Boolean(
		organization &&
			currentUser &&
			"ownerUserId" in organization &&
			organization.ownerUserId === currentUser._id
	);

	const combineAddress = React.useCallback(() => {
		const values = [
			businessForm.addressStreet.trim(),
			businessForm.addressCity.trim(),
			businessForm.addressState.trim(),
			businessForm.addressZip.trim(),
		].filter(Boolean);
		return values.length > 0 ? values.join(", ") : undefined;
	}, [
		businessForm.addressStreet,
		businessForm.addressCity,
		businessForm.addressState,
		businessForm.addressZip,
	]);

	const validateBusinessForm = React.useCallback(() => {
		const requiredFields = [
			businessForm.email.trim(),
			businessForm.phone.trim(),
			businessForm.addressStreet.trim(),
			businessForm.addressCity.trim(),
			businessForm.addressState.trim(),
			businessForm.addressZip.trim(),
		];
		if (!requiredFields.every(Boolean)) {
			toast.warning(
				"Missing required information",
				"Email, phone, and full mailing address are required."
			);
			return false;
		}

		if (!businessForm.companySize) {
			toast.warning(
				"Select company size",
				"Choose the option that best represents your team."
			);
			return false;
		}

		return true;
	}, [businessForm, toast]);

	const handleSaveBusiness = React.useCallback(async () => {
		if (!isOwner) {
			toast.error(
				"Permission required",
				"Only the organization owner can update business details."
			);
			return;
		}

		if (!validateBusinessForm()) {
			return;
		}

		const normalizedWebsite = businessForm.website.trim()
			? `https://${businessForm.website.trim().replace(/^https?:\/\//i, "")}`
			: undefined;

		setSavingBusiness(true);

		try {
			await updateOrganization({
				email: businessForm.email.trim(),
				phone: businessForm.phone.trim(),
				website: normalizedWebsite,
				address: combineAddress(),
				companySize: businessForm.companySize as "1-10" | "10-100" | "100+",
				logoUrl: clerkOrganization?.imageUrl ?? undefined,
				logoInvertInDarkMode: businessForm.logoInvertInDarkMode,
			});

			setBusinessDirty(false);
			toast.success(
				"Business info updated",
				"Organization details have been saved."
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to save business information.";
			toast.error("Update failed", message);
		} finally {
			setSavingBusiness(false);
		}
	}, [
		businessForm,
		clerkOrganization?.imageUrl,
		combineAddress,
		isOwner,
		toast,
		updateOrganization,
		validateBusinessForm,
	]);

	const handleSavePreferences = React.useCallback(async () => {
		if (!isOwner) {
			toast.error(
				"Permission required",
				"Only the organization owner can update preferences."
			);
			return;
		}

		const defaultTaxRate = preferencesForm.defaultTaxRate.trim();
		const defaultReminderTiming = preferencesForm.defaultReminderTiming.trim();
		const monthlyRevenueTarget = preferencesForm.monthlyRevenueTarget.trim();

		const parsedTaxRate = defaultTaxRate ? Number(defaultTaxRate) : undefined;
		const parsedReminder = defaultReminderTiming
			? Number(defaultReminderTiming)
			: undefined;
		const parsedMonthlyRevenue = monthlyRevenueTarget
			? Number(monthlyRevenueTarget)
			: undefined;

		if (
			parsedTaxRate !== undefined &&
			(parsedTaxRate < 0 || parsedTaxRate > 100)
		) {
			toast.warning("Invalid tax rate", "Enter a value between 0 and 100.");
			return;
		}

		if (parsedReminder !== undefined && parsedReminder < 0) {
			toast.warning(
				"Invalid reminder timing",
				"Reminder timing cannot be negative."
			);
			return;
		}

		if (parsedMonthlyRevenue !== undefined && parsedMonthlyRevenue < 0) {
			toast.warning(
				"Invalid target",
				"Monthly revenue target cannot be negative."
			);
			return;
		}

		setSavingPreferences(true);

		try {
			await updateOrganization({
				defaultTaxRate: parsedTaxRate,
				defaultReminderTiming: parsedReminder,
				smsEnabled: preferencesForm.smsEnabled,
				monthlyRevenueTarget: parsedMonthlyRevenue,
			});

			setPreferencesDirty(false);
			toast.success("Preferences updated", "Default settings have been saved.");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to save preferences.";
			toast.error("Update failed", message);
		} finally {
			setSavingPreferences(false);
		}
	}, [isOwner, preferencesForm, toast, updateOrganization]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Loading organization settings...
					</h2>
					<p className="text-muted-foreground">
						Please wait while we fetch your organization data.
					</p>
				</div>
			</div>
		);
	}

	if (!organization) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto" />
					<h2 className="text-2xl font-semibold text-foreground">
						No active organization
					</h2>
					<p className="text-muted-foreground">
						Switch to an organization from the sidebar to manage settings, or
						create a new one.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col py-8">
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
							Organization Settings
						</h1>
					</div>
					<p className="text-muted-foreground ml-5 leading-relaxed max-w-2xl">
						Manage the active organization&apos;s profile, team, and operational
						preferences from one cohesive workspace.
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="flex-1"
				>
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="business">Business Info</TabsTrigger>
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
					</TabsList>

					<div className="mt-8 space-y-8">
						<TabsContent value="overview">
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<OrganizationProfile
										appearance={{
											elements: {
												rootBox: "w-full text-foreground",
												card:
													"w-full rounded-2xl bg-card/95 dark:bg-card/70 border border-border/70 dark:border-border/50 shadow-xl p-0 backdrop-blur-md",
												headerTitle:
													"text-2xl font-bold text-foreground dark:text-foreground mb-2 tracking-tight",
												headerSubtitle:
													"text-sm text-muted-foreground dark:text-muted-foreground mb-6 leading-relaxed",
												navbar:
													"border-b border-border/60 dark:border-border/40 mb-8 pb-4 bg-transparent",
												navbarButton:
													"px-4 py-2 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-muted/40 dark:hover:bg-muted/20 rounded-lg transition-all duration-200 font-medium",
												navbarButtonActive:
													"bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm",
												pageScrollBox: "bg-transparent",
												page: "space-y-8 bg-transparent",
												form: "space-y-6",
												formFieldLabel:
													"text-sm font-semibold text-foreground tracking-wide",
												formFieldInput:
													"w-full bg-background/95 dark:bg-card/60 border border-border dark:border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2.5 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground transition-all duration-200 shadow-sm dark:shadow-none",
												formFieldInputShowPasswordButton:
													"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
												formButtonPrimary:
													"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0",
												formButtonSecondary:
													"bg-muted/80 hover:bg-muted/70 dark:bg-muted/40 dark:hover:bg-muted/30 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground font-medium py-2.5 px-6 rounded-lg border border-border/60 dark:border-border/40 transition-all duration-200",
												table: "w-full border-collapse",
												tableHead:
													"border-b border-border dark:border-border bg-muted/30 dark:bg-muted/20",
												tableHeadRow: "border-b border-border dark:border-border",
												tableHeadCell:
													"text-left p-4 font-semibold text-foreground dark:text-foreground text-sm",
												tableBody: "divide-y divide-border dark:divide-border/60",
												tableRow:
													"hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors",
												tableCell: "p-4 text-sm text-foreground dark:text-foreground",
												badge:
													"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
												badgeSecondary:
													"bg-muted dark:bg-muted/40 text-muted-foreground dark:text-muted-foreground",
												badgePrimary: "bg-primary text-primary-foreground",
												membersPageInviteButton:
													"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0",
												avatarBox:
													"w-10 h-10 rounded-lg bg-muted dark:bg-muted/40 flex items-center justify-center",
												avatarImage: "w-10 h-10 rounded-lg object-cover",
												footer: "mt-8 pt-6 border-t border-border dark:border-border/60",
												footerActionText:
													"text-xs text-muted-foreground dark:text-muted-foreground",
												footerActionLink:
													"text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium text-xs",
												spinner: "text-primary dark:text-primary",
												modalContent:
													"bg-card dark:bg-card/80 border border-border/60 dark:border-border/40 shadow-xl dark:shadow-xl rounded-xl",
												modalCloseButton:
													"text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
											},
											variables: {
												colorPrimary: "hsl(var(--primary))",
												colorText: "hsl(var(--foreground))",
												colorTextSecondary: "hsl(var(--muted-foreground))",
												colorNeutral: "hsl(var(--muted-foreground))",
												colorBackground: "hsl(var(--card))",
												colorInputBackground: "hsl(var(--background))",
												colorInputText: "hsl(var(--foreground))",
												fontFamily: "inherit",
												borderRadius: "0.75rem",
												spacingUnit: "1rem",
											},
										}}
									afterLeaveOrganizationUrl="/organization/new"
								/>
							</div>
						</TabsContent>

						<TabsContent value="business">
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 space-y-8">
								{!isOwner && (
									<div className="border border-border/60 dark:border-border/40 rounded-xl p-4 flex items-start gap-3 bg-muted/40 text-muted-foreground">
										<AlertTriangle className="w-5 h-5 mt-0.5" />
										<div>
											<p className="font-medium text-foreground">View only</p>
											<p className="text-sm">
												Only the organization owner can update business details.
											</p>
										</div>
									</div>
								)}

								<div>
									<div className="flex items-center gap-3 mb-3">
										<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
										<h2 className="text-2xl font-semibold text-foreground tracking-tight">
											Business Information
										</h2>
									</div>
									<p className="text-muted-foreground ml-5 leading-relaxed">
										Keep your public-facing business details up to date for
										clients and documents.
									</p>
								</div>

								<div className="space-y-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div className="md:col-span-2">
											<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
												Business Email
											</label>
											<Input
												value={businessForm.email}
												onChange={(event) => {
													setBusinessDirty(true);
													setBusinessForm((prev) => ({
														...prev,
														email: event.target.value,
													}));
												}}
												disabled={!isOwner || savingBusiness}
												className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
												placeholder="your.business@company.com"
												type="email"
											/>
										</div>

										<div>
											<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
												Company Website
											</label>
											<div className="mt-2 flex">
												<span className="flex shrink-0 items-center rounded-l-md border border-border bg-muted/40 px-3 text-sm font-medium text-muted-foreground">
													https://
												</span>
												<Input
													value={businessForm.website}
													onChange={(event) => {
														setBusinessDirty(true);
														const nextValue = event.target.value.replace(
															/^https?:\/\//i,
															""
														);
														setBusinessForm((prev) => ({
															...prev,
															website: nextValue,
														}));
													}}
													disabled={!isOwner || savingBusiness}
													className="w-full rounded-l-none border border-l-0 border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
													placeholder="www.yourcompany.com"
													type="text"
												/>
											</div>
										</div>

										<div>
											<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
												Phone Number
											</label>
											<Input
												value={businessForm.phone}
												onChange={(event) => {
													setBusinessDirty(true);
													setBusinessForm((prev) => ({
														...prev,
														phone: event.target.value,
													}));
												}}
												disabled={!isOwner || savingBusiness}
												className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
												placeholder="+1 (555) 123-4567"
												type="tel"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
											Business Address
										</label>
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="sm:col-span-2">
												<Input
													value={businessForm.addressStreet}
													onChange={(event) => {
														setBusinessDirty(true);
														setBusinessForm((prev) => ({
															...prev,
															addressStreet: event.target.value,
														}));
													}}
													disabled={!isOwner || savingBusiness}
													className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
													placeholder="123 Business St"
												/>
											</div>
											<div>
												<Input
													value={businessForm.addressCity}
													onChange={(event) => {
														setBusinessDirty(true);
														setBusinessForm((prev) => ({
															...prev,
															addressCity: event.target.value,
														}));
													}}
													disabled={!isOwner || savingBusiness}
													className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
													placeholder="City"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<Input
													value={businessForm.addressState}
													onChange={(event) => {
														setBusinessDirty(true);
														setBusinessForm((prev) => ({
															...prev,
															addressState: event.target.value,
														}));
													}}
													disabled={!isOwner || savingBusiness}
													className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
													placeholder="State"
												/>
												<Input
													value={businessForm.addressZip}
													onChange={(event) => {
														setBusinessDirty(true);
														setBusinessForm((prev) => ({
															...prev,
															addressZip: event.target.value,
														}));
													}}
													disabled={!isOwner || savingBusiness}
													className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
													placeholder="ZIP"
												/>
											</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-foreground mb-6 tracking-wide">
											How many people work at your company? *
										</label>
										<SelectService
											options={companySizeOptions}
											selected={businessForm.companySize}
											onChange={(value) => {
												if (!isOwner || savingBusiness) {
													return;
												}
												setBusinessDirty(true);
												setBusinessForm((prev) => ({
													...prev,
													companySize: value,
												}));
											}}
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
											Logo Display Preferences
										</label>
										<div className="space-y-4 border border-border dark:border-border/80 rounded-xl p-5">
											<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
												<div>
													<p className="text-sm font-medium text-foreground">
														Invert logo colors in dark mode
													</p>
													<p className="text-xs text-muted-foreground">
														Enable this if your logo is dark so it stays visible
														on dark backgrounds.
													</p>
												</div>
												<div className="flex items-center gap-3">
													<Checkbox
														checked={businessForm.logoInvertInDarkMode}
														onCheckedChange={(checked) => {
															if (!isOwner || savingBusiness) {
																return;
															}
															setBusinessDirty(true);
															setBusinessForm((prev) => ({
																...prev,
																logoInvertInDarkMode: Boolean(checked),
															}));
														}}
														className="size-5"
														disabled={!isOwner || savingBusiness}
													/>
													<span className="text-sm text-muted-foreground">
														{businessForm.logoInvertInDarkMode
															? "Enabled"
															: "Disabled"}
													</span>
												</div>
											</div>

											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<div className="border border-border/60 dark:border-border/40 rounded-lg p-4 flex flex-col items-center gap-3 bg-white">
													<span className="text-xs uppercase tracking-wide text-muted-foreground">
														Light Mode Preview
													</span>
													<div className="h-16 w-16 rounded-lg border border-border flex items-center justify-center bg-white">
														{clerkOrganization?.imageUrl ? (
															<Image
																src={clerkOrganization.imageUrl}
																alt="Logo preview light"
																width={64}
																height={64}
																className="max-h-12 max-w-full object-contain"
															/>
														) : (
															<span className="text-xs text-muted-foreground">
																No logo
															</span>
														)}
													</div>
												</div>
												<div className="border border-border/60 dark:border-border/40 rounded-lg p-4 flex flex-col items-center gap-3 bg-zinc-900">
													<span className="text-xs uppercase tracking-wide text-muted-foreground">
														Dark Mode Preview
													</span>
													<div className="h-16 w-16 rounded-lg border border-border/40 flex items-center justify-center bg-zinc-900">
														{clerkOrganization?.imageUrl ? (
															<Image
																src={clerkOrganization.imageUrl}
																alt="Logo preview dark"
																width={64}
																height={64}
																className={`max-h-12 max-w-full object-contain transition-all duration-200 ${businessForm.logoInvertInDarkMode ? "invert brightness-0" : ""}`}
															/>
														) : (
															<span className="text-xs text-muted-foreground">
																No logo
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

							<div className="flex justify-end pt-4">
								<button
									type="button"
									onClick={handleSaveBusiness}
									disabled={!isOwner || savingBusiness}
									className={primaryActionButtonClasses}
								>
									{savingBusiness ? "Saving..." : "Save Changes"}
								</button>
							</div>
							</div>
						</TabsContent>

						<TabsContent value="preferences">
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-8 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 space-y-8">
								{!isOwner && (
									<div className="border border-border/60 dark:border-border/40 rounded-xl p-4 flex items-start gap-3 bg-muted/40 text-muted-foreground">
										<AlertTriangle className="w-5 h-5 mt-0.5" />
										<div>
											<p className="font-medium text-foreground">View only</p>
											<p className="text-sm">
												Only the organization owner can update preferences.
											</p>
										</div>
									</div>
								)}

								<div>
									<div className="flex items-center gap-3 mb-3">
										<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
										<h2 className="text-2xl font-semibold text-foreground tracking-tight">
											Default Preferences
										</h2>
									</div>
									<p className="text-muted-foreground ml-5 leading-relaxed">
										Configure defaults for invoices, reminders, and performance
										goals.
									</p>
								</div>

								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
											Default Tax Rate (%)
										</label>
										<Input
											value={preferencesForm.defaultTaxRate}
											onChange={(event) => {
												setPreferencesDirty(true);
												setPreferencesForm((prev) => ({
													...prev,
													defaultTaxRate: event.target.value,
												}));
											}}
											disabled={!isOwner || savingPreferences}
											className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
											placeholder="8.5"
											type="number"
											step="0.1"
											min="0"
											max="100"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
											Invoice Reminder Timing (hours before due)
										</label>
										<Input
											value={preferencesForm.defaultReminderTiming}
											onChange={(event) => {
												setPreferencesDirty(true);
												setPreferencesForm((prev) => ({
													...prev,
													defaultReminderTiming: event.target.value,
												}));
											}}
											disabled={!isOwner || savingPreferences}
											className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
											placeholder="24"
											type="number"
											min="0"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
											Monthly Revenue Target ($)
										</label>
										<Input
											value={preferencesForm.monthlyRevenueTarget}
											onChange={(event) => {
												setPreferencesDirty(true);
												setPreferencesForm((prev) => ({
													...prev,
													monthlyRevenueTarget: event.target.value,
												}));
											}}
											disabled={!isOwner || savingPreferences}
											className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
											placeholder="10000"
											type="number"
											min="0"
										/>
									</div>

									<div className="border border-border/60 dark:border-border/40 rounded-xl p-5 flex items-start gap-4">
										<Checkbox
											checked={preferencesForm.smsEnabled}
											onCheckedChange={(checked) => {
												if (!isOwner || savingPreferences) {
													return;
												}
												setPreferencesDirty(true);
												setPreferencesForm((prev) => ({
													...prev,
													smsEnabled: Boolean(checked),
												}));
											}}
											disabled={!isOwner || savingPreferences}
											className="size-5 mt-1"
										/>
										<div>
											<p className="text-sm font-semibold text-foreground">
												Enable SMS Reminders
											</p>
											<p className="text-xs text-muted-foreground">
												Send clients automatic SMS reminders ahead of invoice
												due dates.
											</p>
										</div>
									</div>
								</div>

							<div className="flex justify-end pt-4">
								<button
									type="button"
									onClick={handleSavePreferences}
									disabled={!isOwner || savingPreferences}
									className={primaryActionButtonClasses}
								>
									{savingPreferences ? "Saving..." : "Save Preferences"}
								</button>
							</div>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
