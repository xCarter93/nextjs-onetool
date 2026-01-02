"use client";

import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { useAuth } from "@clerk/nextjs";
import { usePlans } from "@clerk/nextjs/experimental";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function ClientChecks() {
	const tokenDebug = useQuery(api.lib.permissions.debugAuthToken);
	const featureAccess = useFeatureAccess();
	const { has, isLoaded } = useAuth();
	const { data } = usePlans({
		for: "user",
		pageSize: 10,
	});

	console.log(data);

	// Test different plan variations
	const tests = [
		{
			label: "has({ feature: 'premium_feature_access' })",
			result: has && has({ feature: "premium_feature_access" }),
		},
		{
			label: "has({ plan: 'onetool_business_plan_org' })",
			result: has && has({ plan: "onetool_business_plan_org" }),
		},
		{
			label: "has({ plan: 'free_user' })",
			result: has && has({ plan: "free_user" }),
		},
		{
			label: "has({ plan: 'free_org' })",
			result: has && has({ plan: "free_org" }),
		},
	];

	return (
		<>
			{/* Direct Frontend Plan Check */}
			<Card className="border-blue-500/50 bg-blue-500/5">
				<CardHeader>
					<CardTitle>Direct Frontend Plan Check (useAuth)</CardTitle>
					<CardDescription>
						Directly testing has({"{ plan: 'onetool_business_plan_org' }"})
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{isLoaded ? (
						<>
							<div className="space-y-2">
								<p className="text-sm font-semibold mb-2">Plan Tests:</p>
								{tests.map((test, index) => (
									<div key={index} className="flex items-center gap-2">
										{test.result ? (
											<CheckCircle2 className="h-4 w-4 text-green-500" />
										) : (
											<XCircle className="h-4 w-4 text-red-500" />
										)}
										<span className="text-sm font-mono">{test.label}:</span>
										<Badge variant={test.result ? "default" : "secondary"}>
											{test.result ? "TRUE" : "FALSE"}
										</Badge>
									</div>
								))}
							</div>
						</>
					) : (
						<p className="text-muted-foreground">Loading...</p>
					)}
				</CardContent>
			</Card>

			{/* Frontend Check */}
			<Card>
				<CardHeader>
					<CardTitle>Frontend Check (use-feature-access hook)</CardTitle>
					<CardDescription>
						Combined check using Clerk&apos;s has() method and publicMetadata
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-2">
						{featureAccess.hasPremiumAccess ? (
							<CheckCircle2 className="h-5 w-5 text-green-500" />
						) : (
							<XCircle className="h-5 w-5 text-red-500" />
						)}
						<span className="font-semibold">Premium Access:</span>
						<Badge
							variant={featureAccess.hasPremiumAccess ? "default" : "secondary"}
						>
							{featureAccess.hasPremiumAccess ? "TRUE" : "FALSE"}
						</Badge>
					</div>

					<div className="flex items-center gap-2">
						{featureAccess.hasOrganization ? (
							<CheckCircle2 className="h-5 w-5 text-green-500" />
						) : (
							<XCircle className="h-5 w-5 text-red-500" />
						)}
						<span className="font-semibold">Has Organization:</span>
						<Badge
							variant={featureAccess.hasOrganization ? "default" : "secondary"}
						>
							{featureAccess.hasOrganization ? "TRUE" : "FALSE"}
						</Badge>
					</div>

					<div className="mt-4 p-4 bg-muted rounded-md">
						<p className="text-sm font-mono">
							Loading: {featureAccess.isLoading ? "true" : "false"}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Backend Token Check */}
			<Card>
				<CardHeader>
					<CardTitle>Backend Token Check (Convex)</CardTitle>
					<CardDescription>
						Shows what&apos;s in the JWT token on the backend
					</CardDescription>
				</CardHeader>
				<CardContent>
					{tokenDebug ? (
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">User Info</h3>
								<div className="p-4 bg-muted rounded-md space-y-1 font-mono text-sm">
									<p>Subject: {tokenDebug.subject}</p>
									<p>Email: {tokenDebug.email || "Not set"}</p>
									<p>Issuer: {tokenDebug.issuer}</p>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Public Metadata</h3>
								<div className="p-4 bg-muted rounded-md">
									<pre className="text-xs overflow-auto">
										{JSON.stringify(tokenDebug.publicMetadata, null, 2)}
									</pre>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Premium Access Checks</h3>
								<div className="p-4 bg-muted rounded-md space-y-2">
									{tokenDebug.publicMetadataChecks ? (
										Object.entries(tokenDebug.publicMetadataChecks).map(
											([key, value]) => (
												<div key={key} className="flex items-center gap-2">
													{value ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<XCircle className="h-4 w-4 text-red-500" />
													)}
													<span className="text-sm font-mono">{key}:</span>
													<Badge variant={value ? "default" : "secondary"}>
														{value ? "TRUE" : "FALSE"}
													</Badge>
												</div>
											)
										)
									) : (
										<p className="text-sm text-muted-foreground">
											No metadata checks
										</p>
									)}
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Plan Checks</h3>
								<div className="p-4 bg-muted rounded-md space-y-2">
									{tokenDebug.planChecks ? (
										Object.entries(tokenDebug.planChecks).map(
											([key, value]) => (
												<div key={key} className="flex items-center gap-2">
													{value ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<XCircle className="h-4 w-4 text-red-500" />
													)}
													<span className="text-sm font-mono">{key}:</span>
													<Badge variant={value ? "default" : "secondary"}>
														{value ? String(value) : "NOT SET"}
													</Badge>
												</div>
											)
										)
									) : (
										<p className="text-sm text-muted-foreground">
											No plan data
										</p>
									)}
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Available Token Keys</h3>
								<div className="p-4 bg-muted rounded-md">
									<pre className="text-xs overflow-auto">
										{JSON.stringify(tokenDebug.availableKeys, null, 2)}
									</pre>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Full Token Data</h3>
								<div className="p-4 bg-muted rounded-md">
									<pre className="text-xs overflow-auto max-h-96">
										{JSON.stringify(tokenDebug.fullTokenData, null, 2)}
									</pre>
								</div>
							</div>
						</div>
					) : (
						<p className="text-muted-foreground">Loading token data...</p>
					)}
				</CardContent>
			</Card>
		</>
	);
}
