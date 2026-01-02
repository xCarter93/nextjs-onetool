(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_6fe5317d._.js",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript)");
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
        // Prevent members from accessing /home
        if (!isAdmin && pathname === "/home") {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = "/projects";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
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
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
(()=>{
    const e = new Error("Cannot find module '../server/web/exports/index'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
 //# sourceMappingURL=server.js.map
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
(()=>{
    const e = new Error("Cannot find module '../server/web/exports/index'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTTPAccessErrorStatus",
    ()=>HTTPAccessErrorStatus,
    "HTTP_ERROR_FALLBACK_ERROR_CODE",
    ()=>HTTP_ERROR_FALLBACK_ERROR_CODE,
    "getAccessFallbackErrorTypeByStatus",
    ()=>getAccessFallbackErrorTypeByStatus,
    "getAccessFallbackHTTPStatus",
    ()=>getAccessFallbackHTTPStatus,
    "isHTTPAccessFallbackError",
    ()=>isHTTPAccessFallbackError
]);
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
    }
} //# sourceMappingURL=http-access-fallback.js.map
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/redirect-status-code.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RedirectStatusCode",
    ()=>RedirectStatusCode
]);
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({}); //# sourceMappingURL=redirect-status-code.js.map
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/redirect-error.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REDIRECT_ERROR_CODE",
    ()=>REDIRECT_ERROR_CODE,
    "RedirectType",
    ()=>RedirectType,
    "isRedirectError",
    ()=>isRedirectError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/redirect-status-code.js [middleware-edge] (ecmascript)");
;
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
var RedirectType = /*#__PURE__*/ function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
    return RedirectType;
}({});
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$status$2d$code$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["RedirectStatusCode"];
} //# sourceMappingURL=redirect-error.js.map
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/is-next-router-error.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNextRouterError",
    ()=>isNextRouterError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/http-access-fallback/http-access-fallback.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/redirect-error.js [middleware-edge] (ecmascript)");
;
;
function isNextRouterError(error) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$redirect$2d$error$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isRedirectError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$http$2d$access$2d$fallback$2f$http$2d$access$2d$fallback$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isHTTPAccessFallbackError"])(error);
} //# sourceMappingURL=is-next-router-error.js.map
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/build/templates/middleware.js { INNER_MIDDLEWARE_MODULE => \"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)\" } [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>nHandler
]);
(()=>{
    const e = new Error("Cannot find module 'next/dist/esm/server/web/globals'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'next/dist/esm/server/web/adapter'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/client/components/is-next-router-error.js [middleware-edge] (ecmascript)");
;
;
;
;
;
const mod = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__
};
const page = "/middleware";
const isProxy = page === '/proxy' || page === '/src/proxy';
const handler = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : mod.middleware) || mod.default;
class ProxyMissingExportError extends Error {
    constructor(message){
        super(message);
        // Stack isn't useful here, remove it considering it spams logs during development.
        this.stack = '';
    }
}
// TODO: This spams logs during development. Find a better way to handle this.
// Removing this will spam "fn is not a function" logs which is worse.
if (typeof handler !== 'function') {
    throw new ProxyMissingExportError(`The ${("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'Middleware'} file "${page}" must export a function named \`${("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'middleware'}\` or a default function.`);
}
// Proxy will only sent out the FetchEvent to next server,
// so load instrumentation module here and track the error inside proxy module.
function errorHandledHandler(fn) {
    return async (...args)=>{
        try {
            return await fn(...args);
        } catch (err) {
            // In development, error the navigation API usage in runtime,
            // since it's not allowed to be used in proxy as it's outside of react component tree.
            if ("TURBOPACK compile-time truthy", 1) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isNextRouterError"])(err)) {
                    err.message = `Next.js navigation API is not allowed to be used in ${("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'Middleware'}.`;
                    throw err;
                }
            }
            const req = args[0];
            const url = new URL(req.url);
            const resource = url.pathname + url.search;
            await edgeInstrumentationOnRequestError(err, {
                path: resource,
                method: req.method,
                headers: Object.fromEntries(req.headers.entries())
            }, {
                routerKind: 'Pages Router',
                routePath: '/proxy',
                routeType: 'proxy',
                revalidateReason: undefined
            });
            throw err;
        }
    };
}
function nHandler(opts) {
    return adapter({
        ...opts,
        page,
        handler: errorHandledHandler(handler)
    });
} //# sourceMappingURL=middleware.js.map
}),
"[project]/apps/web/edge-wrapper.js { MODULE => \"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/build/templates/middleware.js { INNER_MIDDLEWARE_MODULE => \\\"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)\\\" } [middleware-edge] (ecmascript)\" } [middleware-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i('[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/esm/build/templates/middleware.js { INNER_MIDDLEWARE_MODULE => "[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)" } [middleware-edge] (ecmascript)'));
modProm.catch(()=>{});
self._ENTRIES["middleware_middleware"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=_6fe5317d._.js.map