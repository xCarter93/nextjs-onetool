"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@/env";

function PostHogPageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthogClient = usePostHog();

	useEffect(() => {
		if (pathname && posthogClient) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = url + `?${searchParams.toString()}`;
			}
			posthogClient.capture("$pageview", { $current_url: url });
		}
	}, [pathname, searchParams, posthogClient]);

	return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
			defaults: "2025-11-30",
			capture_pageview: false, // Manual for App Router
			capture_pageleave: true,
			capture_performance: true,
			autocapture: true,
			capture_exceptions: true,
			capture_heatmaps: true,
			enable_heatmaps: true,
			persistence: "localStorage+cookie",
			loaded: (ph) => {
				if (process.env.NODE_ENV === "development") ph.debug();
			},
		});
	}, []);

	return (
		<PHProvider client={posthog}>
			<Suspense fallback={null}>
				<PostHogPageView />
			</Suspense>
			{children}
		</PHProvider>
	);
}
