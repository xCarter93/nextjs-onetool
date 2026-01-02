(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/apps_web_src_middleware_ts_88d068d8._.js",
"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
(()=>{
    const e = new Error("Cannot find module '@clerk/nextjs/server'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/clerk-users-webhook(.*)",
    "/api/stripe-webhook(.*)",
    "/api/pay(.*)",
    "/pay(.*)",
    "/api/unsplash(.*)",
    "/api/schedule-demo(.*)",
    "/",
    "/privacy-policy",
    "/terms-of-service"
]);
const __TURBOPACK__default__export__ = clerkMiddleware(async (auth, request)=>{
    const { userId, redirectToSignIn, orgRole, sessionClaims, orgId } = await auth();
    // If not logged in and not a public route, redirect to sign in
    if (!isPublicRoute(request) && !userId) {
        return redirectToSignIn();
    }
    // Handle logged-in users
    if (userId) {
        const pathname = request.nextUrl.pathname;
        // Check if user has an organization
        const hasOrganization = !!orgId;
        // Check if user is an admin (role contains "admin")
        const role = orgRole || sessionClaims?.org_role;
        const isAdmin = role ? String(role).toLowerCase().includes("admin") : false;
        // If user has no organization and tries to access workspace routes, redirect to org creation
        if (!hasOrganization && !pathname.startsWith("/organization/") && !pathname.startsWith("/sign-") && !isPublicRoute(request)) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = "/organization/complete";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
        // Redirect from root based on organization status and role
        if (pathname === "/") {
            const redirectUrl = request.nextUrl.clone();
            if (!hasOrganization) {
                // No organization exists - send to organization creation
                redirectUrl.pathname = "/organization/complete";
            } else if (!isAdmin) {
                // Has organization but not an admin - send to projects
                redirectUrl.pathname = "/projects";
            } else {
                // Has organization and is an admin - send to home
                redirectUrl.pathname = "/home";
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
        // Prevent members from accessing /home
        if (!isAdmin && pathname === "/home") {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = "/projects";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
    }
});
const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)"
    ]
};
}),
]);

//# sourceMappingURL=apps_web_src_middleware_ts_88d068d8._.js.map