import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerPlanCheck } from "./server-plan-check";
import { ClientChecks } from "./client-checks";

export default function DebugTokenPage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Token & Feature Access Debug</h1>
				<p className="text-muted-foreground">
					This page helps debug authentication and plan detection
				</p>
			</div>

			{/* Server-Side Plan Check */}
			<ServerPlanCheck />

			{/* Client-Side Checks */}
			<ClientChecks />

			{/* Instructions */}
			<Card className="border-amber-500/50 bg-amber-500/5">
				<CardHeader>
					<CardTitle>🔍 What to Check</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-sm">
					<div>
						<h4 className="font-semibold mb-1">1. Frontend Check</h4>
						<p className="text-muted-foreground">
							Should show TRUE if you have the{" "}
							<code className="px-1 py-0.5 bg-muted rounded">
								onetool_business_plan
							</code>{" "}
							in Clerk OR
							<code className="px-1 py-0.5 bg-muted rounded ml-1">
								has_premium_feature_access
							</code>{" "}
							in public metadata.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-1">
							2. Backend Token - Public Metadata
						</h4>
						<p className="text-muted-foreground">
							Should contain{" "}
							<code className="px-1 py-0.5 bg-muted rounded">
								has_premium_feature_access: true
							</code>{" "}
							if set in Clerk Dashboard.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-1">3. If All Tests Are FALSE</h4>
						<ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
							<li>Sign out and sign back in to refresh the JWT token</li>
							<li>Check Clerk Dashboard → Users → Your User → Metadata tab</li>
							<li>
								Ensure public metadata has{" "}
								<code className="px-1 py-0.5 bg-muted rounded">
									has_premium_feature_access: true
								</code>
							</li>
							<li>
								Ensure your user in Clerk Dashboard has the plan assigned as{" "}
								<code className="px-1 py-0.5 bg-muted rounded">
									onetool_business_plan
								</code>
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
