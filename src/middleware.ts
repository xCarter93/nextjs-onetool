import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/api/clerk-users-webhook(.*)",
	"/api/stripe-webhook(.*)",
	"/",
	"/privacy-policy",
	"/terms-of-service",
]);

export default clerkMiddleware(async (auth, request) => {
	const { userId, redirectToSignIn } = await auth();
	if (!isPublicRoute(request) && !userId) {
		return redirectToSignIn();
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
