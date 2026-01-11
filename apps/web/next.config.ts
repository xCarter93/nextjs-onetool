import type { NextConfig } from "next";

// Extract hostname from Convex URL for image optimization
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexHostname = convexUrl ? new URL(convexUrl).hostname : null;

const nextConfig: NextConfig = {
	experimental: {
		viewTransition: true,
		globalNotFound: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "tailwindcss.com",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
			// Convex storage for community page images
			...(convexHostname
				? [
						{
							protocol: "https" as const,
							hostname: convexHostname,
						},
					]
				: []),
		],
	},
	env: {
		NEXT_PUBLIC_MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
	},
};

export default nextConfig;
