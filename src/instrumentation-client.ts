import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
	api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	defaults: "2025-11-30",
	capture_performance: true,
	autocapture: true,
	capture_exceptions: true,
	capture_pageview: true,
	capture_pageleave: true,
	capture_heatmaps: true,
	enable_heatmaps: true,
});
