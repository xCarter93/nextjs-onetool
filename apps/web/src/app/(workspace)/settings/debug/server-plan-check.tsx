import { auth } from "@clerk/nextjs/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

/**
 * Server Component to test auth().has() method
 * This runs on the server and uses Clerk's auth() function
 */
export async function ServerPlanCheck() {
	const { has, getToken } = await auth();
	const template = "convex";
	const token = await getToken({ template });
	const response = Response.json({ token });
	console.log(response);

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
		<Card className="border-purple-500/50 bg-purple-500/5">
			<CardHeader>
				<CardTitle>
					Server-Side Plan Check (auth() from @clerk/nextjs/server)
				</CardTitle>
				<CardDescription>
					Tests using auth().has() in a Server Component
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
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

				<div className="p-4 bg-muted rounded-md">
					<p className="text-xs text-muted-foreground">
						This component runs on the server and uses auth() from
						@clerk/nextjs/server. If all tests return FALSE, the plan is not in
						the JWT token.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
