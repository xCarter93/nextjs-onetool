import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/pricing(.*)",
	"/api/clerk-users-webhook(.*)",
	"/api/stripe-webhook(.*)",
	"/api/unsplash(.*)",
	"/",
	"/privacy-policy",
	"/terms-of-service",
]);

export default clerkMiddleware(async (auth, request) => {
	const { userId, redirectToSignIn, orgRole, sessionClaims } = await auth();

	// If not logged in and not a public route, redirect to sign in
	if (!isPublicRoute(request) && !userId) {
		return redirectToSignIn();
	}

	// Handle logged-in users
	if (userId) {
		const pathname = request.nextUrl.pathname;

		// Check if user is an admin (role contains "admin")
		const role = orgRole || sessionClaims?.org_role;
		const isAdmin = role ? String(role).toLowerCase().includes("admin") : false;

		// Redirect from root based on role
		if (pathname === "/") {
			const redirectUrl = request.nextUrl.clone();
			redirectUrl.pathname = isAdmin ? "/home" : "/projects";
			return NextResponse.redirect(redirectUrl);
		}

		// Prevent members from accessing /home
		if (!isAdmin && pathname === "/home") {
			const redirectUrl = request.nextUrl.clone();
			redirectUrl.pathname = "/projects";
			return NextResponse.redirect(redirectUrl);
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
