"use client";

import { ProjectOnboardingForm } from "@/components/project-onboarding-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

function ProjectNewContent() {
	const searchParams = useSearchParams();
	const clientId = searchParams.get("clientId") as Id<"clients"> | null;

	return <ProjectOnboardingForm preselectedClientId={clientId} />;
}

export default function NewProjectPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProjectNewContent />
		</Suspense>
	);
}
