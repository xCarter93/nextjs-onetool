(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@t3-oss/env-nextjs/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEnv"])({
    server: {
        CLERK_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLERK_USER_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLERK_BILLING_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        BOLDSIGN_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        BOLDSIGN_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        OPENAI_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        UNSPLASH_ACCESS_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        UNSPLASH_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        UNSPLASH_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLERK_ISSUER_DOMAIN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        RESEND_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        RESEND_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        STRIPE_APPLICATION_FEE_CENTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default("100")
    },
    client: {
        NEXT_PUBLIC_CONVEX_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        NEXT_PUBLIC_CLERK_FRONTEND_API_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ("TURBOPACK compile-time value", "pk_test_Z3JhdGVmdWwtbW9sZS03NC5jbGVyay5hY2NvdW50cy5kZXYk"),
        NEXT_PUBLIC_CONVEX_URL: ("TURBOPACK compile-time value", "https://qualified-nightingale-857.convex.cloud"),
        NEXT_PUBLIC_CLERK_FRONTEND_API_URL: ("TURBOPACK compile-time value", "https://grateful-mole-74.clerk.accounts.dev"),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ("TURBOPACK compile-time value", "pk_test_51SbubR2dAZWhmODOFHx8PxoYF8JbxbXVoxVidXf37ebmD8cA3fzHSZ52eWG1yQjrvOWE03Yk5gNNFPLOAc2VGdJw00X97XlYIH")
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/providers/ConvexClientProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convex",
    ()=>convex,
    "default",
    ()=>ConvexClientProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/auth_helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2d$clerk$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react-clerk/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2d$clerk$2f$ConvexProviderWithClerk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react-clerk/ConvexProviderWithClerk.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/client-boundary/PromisifiedAuthProvider.js [app-client] (ecmascript) <export usePromisifiedAuth as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/env.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const convex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConvexReactClient"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CONVEX_URL);
function ConvexClientProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2d$clerk$2f$ConvexProviderWithClerk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConvexProviderWithClerk"], {
        client: convex,
        useAuth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__["useAuth"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Authenticated"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/web/src/providers/ConvexClientProvider.tsx",
                lineNumber: 22,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$auth_helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Unauthenticated"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/web/src/providers/ConvexClientProvider.tsx",
                lineNumber: 23,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/providers/ConvexClientProvider.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, this);
}
_c = ConvexClientProvider;
;
var _c;
__turbopack_context__.k.register(_c, "ConvexClientProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/providers/ThemeProvider.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
const ThemeProvider = ({ children, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        enableSystem: true,
        storageKey: "intentui-theme",
        attribute: "class",
        defaultTheme: "system",
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/providers/ThemeProvider.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ThemeProvider;
;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/providers/ThemeProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ThemeProvider"],
    "useTheme",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/providers/ThemeProvider.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
}),
"[project]/apps/web/src/components/ui/toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Information Icon SVG
const InfoIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 19,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 12,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c = InfoIcon;
// Success Icon SVG
const SuccessIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 37,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 30,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c1 = SuccessIcon;
// Warning Icon SVG
const WarningIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 55,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 48,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c2 = WarningIcon;
// Error Icon SVG
const ErrorIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 73,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 66,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c3 = ErrorIcon;
// Close Icon SVG
const CloseIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M6 18L18 6M6 6l12 12"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 91,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 84,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c4 = CloseIcon;
// Loading Spinner SVG
const LoadingSpinner = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `animate-spin ${className}`,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                lineNumber: 108,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                lineNumber: 116,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 102,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c5 = LoadingSpinner;
// A map to store styles and icons for each notification type
const notificationConfig = {
    info: {
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800/50",
        iconColor: "text-blue-500 dark:text-blue-400",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoIcon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 157,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
        gradient: "from-blue-100/60 to-transparent dark:from-blue-900/20 dark:to-transparent"
    },
    success: {
        bgColor: "bg-green-100 dark:bg-green-900/40",
        borderColor: "border-green-400 dark:border-green-600",
        iconColor: "text-green-700 dark:text-green-300",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SuccessIcon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 165,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
        gradient: "from-green-200/80 to-green-100/40 dark:from-green-800/60 dark:to-green-900/30"
    },
    warning: {
        bgColor: "bg-yellow-100 dark:bg-yellow-900/40",
        borderColor: "border-yellow-400 dark:border-yellow-600",
        iconColor: "text-yellow-700 dark:text-yellow-300",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WarningIcon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 173,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
        gradient: "from-yellow-200/80 to-yellow-100/40 dark:from-yellow-800/60 dark:to-yellow-900/30"
    },
    error: {
        bgColor: "bg-red-100 dark:bg-red-900/40",
        borderColor: "border-red-400 dark:border-red-600",
        iconColor: "text-red-700 dark:text-red-300",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorIcon, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 181,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
        gradient: "from-red-200/80 to-red-100/40 dark:from-red-800/60 dark:to-red-900/30"
    },
    loading: {
        // New loading configuration
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
        borderColor: "border-gray-200 dark:border-gray-800/50",
        iconColor: "text-gray-500 dark:text-gray-400",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingSpinner, {
            className: "h-6 w-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
            lineNumber: 190,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
        gradient: "from-gray-100/60 to-transparent dark:from-gray-900/20 dark:to-transparent"
    }
};
const Notification = ({ type, title, message, showIcon = true, duration, onClose })=>{
    _s();
    const config = notificationConfig[type];
    // Auto-dismiss after duration if provided
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Notification.useEffect": ()=>{
            if (duration) {
                const timer = setTimeout({
                    "Notification.useEffect.timer": ()=>{
                        onClose();
                    }
                }["Notification.useEffect.timer"], duration);
                return ({
                    "Notification.useEffect": ()=>clearTimeout(timer)
                })["Notification.useEffect"];
            }
        }
    }["Notification.useEffect"], [
        duration,
        onClose
    ]);
    return(// Wrap with motion.div for animations and apply colorful styles with dark mode support
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: 100
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: 100
        },
        transition: {
            duration: 0.3
        },
        className: `relative w-full max-w-sm rounded-xl p-4 backdrop-blur-xl ${config.bgColor} border-2 ${config.borderColor} overflow-hidden drop-shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-0 left-0 h-full w-full bg-linear-to-br ${config.gradient}`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                lineNumber: 225,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex items-center space-x-4",
                children: [
                    showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `shrink-0 ${config.iconColor}`,
                        children: config.icon
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                        lineNumber: 230,
                        columnNumber: 6
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-gray-900 dark:text-gray-100 text-lg",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                                lineNumber: 233,
                                columnNumber: 6
                            }, ("TURBOPACK compile-time value", void 0)),
                            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-800 dark:text-gray-200 mt-1",
                                children: message
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                                lineNumber: 237,
                                columnNumber: 7
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                        lineNumber: 232,
                        columnNumber: 5
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CloseIcon, {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                            lineNumber: 246,
                            columnNumber: 6
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                        lineNumber: 242,
                        columnNumber: 5
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/ui/toast.tsx",
                lineNumber: 228,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ui/toast.tsx",
        lineNumber: 218,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
};
_s(Notification, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c6 = Notification;
const __TURBOPACK__default__export__ = Notification;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "InfoIcon");
__turbopack_context__.k.register(_c1, "SuccessIcon");
__turbopack_context__.k.register(_c2, "WarningIcon");
__turbopack_context__.k.register(_c3, "ErrorIcon");
__turbopack_context__.k.register(_c4, "CloseIcon");
__turbopack_context__.k.register(_c5, "LoadingSpinner");
__turbopack_context__.k.register(_c6, "Notification");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast,
    "useToastOperations",
    ()=>useToastOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ToastProvider = ({ children, position = "top-right", maxToasts = 5 })=>{
    _s();
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Clear certain types of toasts when navigating to a different page
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastProvider.useEffect": ()=>{
            // Clear success and info toasts on navigation, but keep error and warning toasts
            // Also keep loading toasts as they might be in progress
            setToasts({
                "ToastProvider.useEffect": (prevToasts)=>prevToasts.filter({
                        "ToastProvider.useEffect": (toast)=>toast.type === "error" || toast.type === "warning" || toast.type === "loading"
                    }["ToastProvider.useEffect"])
            }["ToastProvider.useEffect"]);
        }
    }["ToastProvider.useEffect"], [
        pathname
    ]); // This will run whenever the route changes
    const generateId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[generateId]": ()=>{
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
    }["ToastProvider.useCallback[generateId]"], []);
    const removeToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[removeToast]": (id)=>{
            setToasts({
                "ToastProvider.useCallback[removeToast]": (prevToasts)=>prevToasts.filter({
                        "ToastProvider.useCallback[removeToast]": (toast)=>toast.id !== id
                    }["ToastProvider.useCallback[removeToast]"])
            }["ToastProvider.useCallback[removeToast]"]);
        }
    }["ToastProvider.useCallback[removeToast]"], []);
    const addToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[addToast]": (toast)=>{
            const id = generateId();
            const newToast = {
                ...toast,
                id
            };
            setToasts({
                "ToastProvider.useCallback[addToast]": (prevToasts)=>{
                    const updatedToasts = [
                        newToast,
                        ...prevToasts
                    ];
                    // Limit the number of toasts
                    return updatedToasts.slice(0, maxToasts);
                }
            }["ToastProvider.useCallback[addToast]"]);
            // Auto-remove toast if duration is specified
            if (toast.duration) {
                setTimeout({
                    "ToastProvider.useCallback[addToast]": ()=>{
                        removeToast(id);
                    }
                }["ToastProvider.useCallback[addToast]"], toast.duration);
            }
            return id;
        }
    }["ToastProvider.useCallback[addToast]"], [
        generateId,
        maxToasts,
        removeToast
    ]);
    const updateToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[updateToast]": (id, updates)=>{
            setToasts({
                "ToastProvider.useCallback[updateToast]": (prevToasts)=>prevToasts.map({
                        "ToastProvider.useCallback[updateToast]": (toast)=>toast.id === id ? {
                                ...toast,
                                ...updates
                            } : toast
                    }["ToastProvider.useCallback[updateToast]"])
            }["ToastProvider.useCallback[updateToast]"]);
        }
    }["ToastProvider.useCallback[updateToast]"], []);
    // Convenience methods for different toast types
    const success = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[success]": (title, message, options)=>{
            return addToast({
                type: "success",
                title,
                message,
                duration: 4000,
                ...options
            });
        }
    }["ToastProvider.useCallback[success]"], [
        addToast
    ]);
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[error]": (title, message, options)=>{
            return addToast({
                type: "error",
                title,
                message,
                duration: 6000,
                ...options
            });
        }
    }["ToastProvider.useCallback[error]"], [
        addToast
    ]);
    const warning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[warning]": (title, message, options)=>{
            return addToast({
                type: "warning",
                title,
                message,
                duration: 5000,
                ...options
            });
        }
    }["ToastProvider.useCallback[warning]"], [
        addToast
    ]);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[info]": (title, message, options)=>{
            return addToast({
                type: "info",
                title,
                message,
                duration: 4000,
                ...options
            });
        }
    }["ToastProvider.useCallback[info]"], [
        addToast
    ]);
    const loading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[loading]": (title, message, options)=>{
            return addToast({
                type: "loading",
                title,
                message,
                // Loading toasts don't auto-dismiss by default
                ...options
            });
        }
    }["ToastProvider.useCallback[loading]"], [
        addToast
    ]);
    // Position classes for the toast container
    const positionClasses = {
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-left": "bottom-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
    };
    const contextValue = {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        loading,
        updateToast
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: contextValue,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed z-50 flex flex-col gap-2 w-full max-w-sm ${positionClasses[position]}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "popLayout",
                    children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            type: toast.type,
                            title: toast.title,
                            message: toast.message,
                            showIcon: toast.showIcon,
                            duration: toast.duration,
                            onClose: ()=>removeToast(toast.id)
                        }, toast.id, false, {
                            fileName: "[project]/apps/web/src/hooks/use-toast.tsx",
                            lineNumber: 217,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/hooks/use-toast.tsx",
                    lineNumber: 215,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/hooks/use-toast.tsx",
                lineNumber: 212,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/hooks/use-toast.tsx",
        lineNumber: 209,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ToastProvider, "THvV2Txhm9FkLMwFt8K9WElBLcc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ToastProvider;
const useToast = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
_s1(useToast, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const useToastOperations = ()=>{
    _s2();
    const toast = useToast();
    const showLoadingWithSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useToastOperations.useCallback[showLoadingWithSuccess]": async (loadingMessage, successMessage, operation)=>{
            const loadingId = toast.loading("Loading", loadingMessage);
            try {
                const result = await operation();
                toast.removeToast(loadingId);
                toast.success("Success", successMessage);
                return result;
            } catch (error) {
                toast.removeToast(loadingId);
                toast.error("Error", error instanceof Error ? error.message : "An error occurred");
                throw error;
            }
        }
    }["useToastOperations.useCallback[showLoadingWithSuccess]"], [
        toast
    ]);
    const confirmAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useToastOperations.useCallback[confirmAction]": (action, messages)=>{
            return showLoadingWithSuccess(messages.loading, messages.success, action);
        }
    }["useToastOperations.useCallback[confirmAction]"], [
        showLoadingWithSuccess
    ]);
    return {
        ...toast,
        showLoadingWithSuccess,
        confirmAction
    };
};
_s2(useToastOperations, "Vac+E+9wPGCgzhW+jDPr0mClSkM=", false, function() {
    return [
        useToast
    ];
});
var _c;
__turbopack_context__.k.register(_c, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Modal = ({ isOpen, onClose, children, title, size = "md", animation = "scale" })=>{
    _s();
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const previousActiveElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Animation variants based on animation type
    const getModalVariants = (animationType)=>{
        switch(animationType){
            case "scale":
                return {
                    hidden: {
                        opacity: 0,
                        scale: 0.75,
                        y: 20
                    },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.75,
                        y: 20,
                        transition: {
                            duration: 0.2
                        }
                    }
                };
            case "slide":
                return {
                    hidden: {
                        opacity: 0,
                        y: -50,
                        scale: 0.95
                    },
                    visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                        }
                    },
                    exit: {
                        opacity: 0,
                        y: -30,
                        scale: 0.95,
                        transition: {
                            duration: 0.2
                        }
                    }
                };
            case "fade":
                return {
                    hidden: {
                        opacity: 0
                    },
                    visible: {
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut"
                        }
                    },
                    exit: {
                        opacity: 0,
                        transition: {
                            duration: 0.2
                        }
                    }
                };
            case "bounce":
                return {
                    hidden: {
                        opacity: 0,
                        scale: 0.3,
                        rotate: -10
                    },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: {
                            type: "spring",
                            damping: 15,
                            stiffness: 400,
                            bounce: 0.6
                        }
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.3,
                        rotate: 10,
                        transition: {
                            duration: 0.2
                        }
                    }
                };
            default:
                return {
                    hidden: {
                        opacity: 0,
                        scale: 0.75,
                        y: 20
                    },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.75,
                        y: 20,
                        transition: {
                            duration: 0.2
                        }
                    }
                };
        }
    };
    const backdropVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    };
    const modalVariants = getModalVariants(animation);
    // Handle focus trap and accessibility
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                // Store the currently focused element
                previousActiveElement.current = document.activeElement;
                // Focus the modal after a short delay to ensure it's rendered
                const focusTimeout = setTimeout({
                    "Modal.useEffect.focusTimeout": ()=>{
                        const modalElement = modalRef.current;
                        if (modalElement) {
                            // Try to focus the first focusable element or the modal itself
                            const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                            if (focusableElements.length > 0) {
                                focusableElements[0].focus();
                            } else {
                                modalElement.focus();
                            }
                        }
                    }
                }["Modal.useEffect.focusTimeout"], 100);
                return ({
                    "Modal.useEffect": ()=>{
                        clearTimeout(focusTimeout);
                        // Restore focus to the previously focused element
                        if (previousActiveElement.current) {
                            previousActiveElement.current.focus();
                        }
                    }
                })["Modal.useEffect"];
            }
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    // Handle body scroll and pointer events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                // Store original values
                const originalOverflow = document.body.style.overflow;
                const originalPointerEvents = document.body.style.pointerEvents;
                // Apply modal styles
                document.body.style.overflow = "hidden";
                document.body.style.pointerEvents = "none";
                // Cleanup on modal close or unmount
                return ({
                    "Modal.useEffect": ()=>{
                        document.body.style.overflow = originalOverflow || "";
                        document.body.style.pointerEvents = originalPointerEvents || "";
                    }
                })["Modal.useEffect"];
            }
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    // Handle escape key and focus trap
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen) return; // Early return if modal is closed
            const handleEscape = {
                "Modal.useEffect.handleEscape": (event)=>{
                    if (event.key === "Escape") {
                        onClose();
                    }
                }
            }["Modal.useEffect.handleEscape"];
            const handleTab = {
                "Modal.useEffect.handleTab": (event)=>{
                    if (event.key !== "Tab") return;
                    const modalElement = modalRef.current;
                    if (!modalElement) return;
                    const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusableElements.length === 0) return;
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    // Trap focus within modal
                    if (event.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }["Modal.useEffect.handleTab"];
            // Add listeners only when modal is open
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("keydown", handleTab);
            // Cleanup when modal closes or component unmounts
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener("keydown", handleEscape);
                    document.removeEventListener("keydown", handleTab);
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-[70vw]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto",
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants: backdropVariants,
            transition: {
                duration: 0.2
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 backdrop-blur-sm", "bg-black/50 dark:bg-black/70"),
                    onClick: onClose,
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                    lineNumber: 262,
                    columnNumber: 6
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    ref: modalRef,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-auto", "bg-white dark:bg-gray-900", "border-0 dark:border dark:border-gray-700", sizeClasses[size]),
                    variants: modalVariants,
                    initial: "hidden",
                    animate: "visible",
                    exit: "exit",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": title ? "modal-title" : undefined,
                    tabIndex: -1,
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between p-4 border-b", "border-gray-200 dark:border-gray-700"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    id: "modal-title",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", "text-gray-900 dark:text-white"),
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                                    lineNumber: 298,
                                    columnNumber: 9
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    "aria-label": "Close dialog",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1 rounded-md transition-colors", "text-gray-400 hover:text-gray-600", "dark:text-gray-400 dark:hover:text-gray-200", "hover:bg-gray-100 dark:hover:bg-gray-800"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                                            lineNumber: 323,
                                            columnNumber: 11
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                                        lineNumber: 317,
                                        columnNumber: 10
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                                    lineNumber: 307,
                                    columnNumber: 9
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                            lineNumber: 292,
                            columnNumber: 8
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                            lineNumber: 334,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/ui/modal.tsx",
                    lineNumber: 274,
                    columnNumber: 6
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/ui/modal.tsx",
            lineNumber: 253,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/modal.tsx",
        lineNumber: 251,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
_s(Modal, "Ly0kZz6emEjy+KsxmgWGk1lR2jI=");
_c = Modal;
const __TURBOPACK__default__export__ = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonStyles",
    ()=>buttonStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/Button.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$variants$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/tailwind-variants/dist/index.js [app-client] (ecmascript) <locals>");
"use client";
;
;
;
const buttonStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$variants$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tv"])({
    base: [
        "[--btn-icon-active:var(--btn-fg)] [--btn-outline:var(--btn-bg)] [--btn-ring:var(--btn-bg)]/20",
        "bg-(--btn-bg) pressed:bg-(--btn-overlay) text-(--btn-fg) outline-(--btn-outline) ring-(--btn-ring) hover:bg-(--btn-overlay)",
        "relative inset-ring inset-ring-fg/15 isolate inline-flex items-center justify-center font-medium",
        "focus:outline-0 focus-visible:outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:ring-offset-bg",
        "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) pressed:*:data-[slot=icon]:text-(--btn-icon-active) focus-visible:*:data-[slot=icon]:text-(--btn-icon-active)/80 hover:*:data-[slot=icon]:text-(--btn-icon-active)/90 sm:*:data-[slot=icon]:my-0 forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
        "*:data-[slot=loader]:-mx-0.5 *:data-[slot=loader]:my-0 *:data-[slot=loader]:shrink-0 *:data-[slot=loader]:self-center *:data-[slot=loader]:text-(--btn-icon) sm:*:data-[slot=loader]:my-0"
    ],
    variants: {
        intent: {
            primary: "[--btn-bg:var(--color-primary)] [--btn-fg:var(--color-primary-fg)] [--btn-icon:color-mix(in_oklab,var(--primary-fg)_60%,var(--primary))] [--btn-overlay:var(--color-primary)]/85",
            secondary: "[--btn-bg:var(--color-secondary)] [--btn-fg:var(--color-secondary-fg)] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-secondary-fg)] [--btn-overlay:var(--color-secondary)]/85 [--btn-ring:var(--color-muted-fg)]/20",
            warning: "[--btn-bg:var(--color-warning)] [--btn-fg:var(--color-warning-fg)] [--btn-icon:color-mix(in_oklab,var(--warning-fg)_60%,var(--warning))] [--btn-overlay:var(--color-warning)]/85",
            destructive: "[--btn-bg:var(--color-danger)] [--btn-fg:var(--color-danger-fg)] [--btn-icon:color-mix(in_oklab,var(--danger-fg)_60%,var(--danger))] [--btn-overlay:var(--color-danger)]/85",
            outline: "inset-ring-border [--btn-bg:transparent] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-muted)] [--btn-ring:var(--color-ring)]/20",
            plain: "inset-ring-transparent [--btn-bg:transparent] [--btn-icon:var(--color-muted-fg)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-muted)] [--btn-ring:var(--color-ring)]/20"
        },
        size: {
            xs: [
                "min-h-7.5 gap-x-1 px-2.5 py-1.5 text-sm sm:min-h-7 sm:px-2 sm:py-[--spacing(1.4)] sm:text-xs/4",
                "*:data-[slot=icon]:size-3.5 sm:*:data-[slot=icon]:size-3",
                "*:data-[slot=loader]:size-3.5 sm:*:data-[slot=loader]:size-3"
            ],
            sm: [
                "min-h-8.5 gap-x-1.5 px-3 py-1.5 text-sm/5 sm:min-h-8 sm:px-2.5 sm:py-1.5",
                "*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4",
                "*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4"
            ],
            md: [
                "min-h-9.5 gap-x-2 px-3.5 py-2 sm:min-h-9 sm:px-3 sm:py-1.5 sm:text-sm/6",
                "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4",
                "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4"
            ],
            lg: [
                "min-h-10.5 gap-x-2 px-4 py-2.5 sm:min-h-10 sm:px-3.5 sm:py-2 sm:text-sm/6",
                "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4.5",
                "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4.5"
            ],
            "sq-xs": "touch-target size-7.5 *:data-[slot=icon]:size-3.5 *:data-[slot=loader]:size-3.5 sm:size-7 sm:*:data-[slot=icon]:size-3 sm:*:data-[slot=loader]:size-3",
            "sq-sm": "touch-target size-8.5 *:data-[slot=icon]:size-4.5 *:data-[slot=loader]:size-4.5 sm:size-8 sm:*:data-[slot=icon]:size-4 sm:*:data-[slot=loader]:size-4",
            "sq-md": "touch-target size-9.5 *:data-[slot=icon]:size-4.5 *:data-[slot=loader]:size-4.5 sm:size-9 sm:*:data-[slot=icon]:size-4 sm:*:data-[slot=loader]:size-4",
            "sq-lg": "touch-target size-10.5 *:data-[slot=icon]:size-5 *:data-[slot=loader]:size-5 sm:size-10 sm:*:data-[slot=icon]:size-4.5 sm:*:data-[slot=loader]:size-4.5"
        },
        isCircle: {
            true: "rounded-full",
            false: "rounded-lg"
        },
        isDisabled: {
            true: "inset-ring-0 opacity-50 forced-colors:text-[GrayText]"
        },
        isPending: {
            true: "opacity-50"
        }
    },
    defaultVariants: {
        intent: "primary",
        size: "md",
        isCircle: false
    }
});
const Button = ({ className, intent, size, isCircle, ref, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        ref: ref,
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeRenderProps"])(className, (className, renderProps)=>buttonStyles({
                ...renderProps,
                intent,
                size,
                isCircle,
                className
            })),
        children: (values)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: typeof props.children === "function" ? props.children(values) : props.children
            }, void 0, false)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/button.tsx",
        lineNumber: 98,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-confirm-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmDialogProvider",
    ()=>ConfirmDialogProvider,
    "useConfirmDialog",
    ()=>useConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const ConfirmDialogContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ConfirmDialogProvider = ({ children })=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resolver, setResolver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const confirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConfirmDialogProvider.useCallback[confirm]": (opts)=>{
            return new Promise({
                "ConfirmDialogProvider.useCallback[confirm]": (resolve)=>{
                    setOptions(opts);
                    setIsOpen(true);
                    setResolver({
                        "ConfirmDialogProvider.useCallback[confirm]": ()=>resolve
                    }["ConfirmDialogProvider.useCallback[confirm]"]);
                }
            }["ConfirmDialogProvider.useCallback[confirm]"]);
        }
    }["ConfirmDialogProvider.useCallback[confirm]"], []);
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConfirmDialogProvider.useCallback[handleConfirm]": ()=>{
            if (resolver) {
                resolver(true);
                setResolver(null);
            }
            setIsOpen(false);
            setOptions(null);
        }
    }["ConfirmDialogProvider.useCallback[handleConfirm]"], [
        resolver
    ]);
    const handleCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConfirmDialogProvider.useCallback[handleCancel]": ()=>{
            if (resolver) {
                resolver(false);
                setResolver(null);
            }
            setIsOpen(false);
            setOptions(null);
        }
    }["ConfirmDialogProvider.useCallback[handleCancel]"], [
        resolver
    ]);
    const getVariantStyles = (variant)=>{
        switch(variant){
            case "destructive":
                return {
                    iconColor: "text-red-500",
                    bgColor: "bg-red-50 dark:bg-red-900/20",
                    borderColor: "border-red-200 dark:border-red-800",
                    textColor: "text-red-700 dark:text-red-300",
                    buttonIntent: "destructive"
                };
            case "warning":
                return {
                    iconColor: "text-yellow-500",
                    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                    borderColor: "border-yellow-200 dark:border-yellow-800",
                    textColor: "text-yellow-700 dark:text-yellow-300",
                    buttonIntent: "warning"
                };
            case "info":
            default:
                return {
                    iconColor: "text-blue-500",
                    bgColor: "bg-blue-50 dark:bg-blue-900/20",
                    borderColor: "border-blue-200 dark:border-blue-800",
                    textColor: "text-blue-700 dark:text-blue-300",
                    buttonIntent: "primary"
                };
        }
    };
    const variant = options?.variant || "destructive";
    const styles = getVariantStyles(variant);
    const contextValue = {
        confirm
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmDialogContext.Provider, {
        value: contextValue,
        children: [
            children,
            options && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isOpen,
                onClose: handleCancel,
                title: options.title,
                size: "sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: `h-10 w-10 ${styles.iconColor}`,
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: "1.5",
                                        stroke: "currentColor",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                            lineNumber: 131,
                                            columnNumber: 10
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                        lineNumber: 123,
                                        columnNumber: 9
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                    lineNumber: 122,
                                    columnNumber: 8
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-medium text-gray-900 dark:text-gray-100",
                                            children: "Are you sure?"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                            lineNumber: 139,
                                            columnNumber: 9
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                            children: [
                                                options.message,
                                                options.itemName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                '"',
                                                                options.itemName,
                                                                '"'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 12
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                            lineNumber: 142,
                                            columnNumber: 9
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                    lineNumber: 138,
                                    columnNumber: 8
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                            lineNumber: 121,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        variant === "destructive" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${styles.bgColor} border ${styles.borderColor} rounded-md p-3`,
                            role: "alert",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-5 w-5 text-red-400",
                                            viewBox: "0 0 20 20",
                                            fill: "currentColor",
                                            "aria-hidden": "true",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fillRule: "evenodd",
                                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
                                                clipRule: "evenodd"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                                lineNumber: 167,
                                                columnNumber: 12
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                            lineNumber: 161,
                                            columnNumber: 11
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                        lineNumber: 160,
                                        columnNumber: 10
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm ${styles.textColor}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Warning:"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 12
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This is a destructive action that cannot be reversed."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                            lineNumber: 175,
                                            columnNumber: 11
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                        lineNumber: 174,
                                        columnNumber: 10
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                lineNumber: 159,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                            lineNumber: 155,
                            columnNumber: 8
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onPress: handleCancel,
                                    intent: "secondary",
                                    autoFocus: variant !== "destructive",
                                    children: options.cancelLabel || "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                    lineNumber: 185,
                                    columnNumber: 8
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onPress: handleConfirm,
                                    intent: styles.buttonIntent,
                                    autoFocus: variant === "destructive",
                                    children: options.confirmLabel || "Confirm"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                                    lineNumber: 192,
                                    columnNumber: 8
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                            lineNumber: 184,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                    lineNumber: 120,
                    columnNumber: 6
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
                lineNumber: 114,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/hooks/use-confirm-dialog.tsx",
        lineNumber: 110,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ConfirmDialogProvider, "m4UXIa7Ycoe2RQDdni1BJkixAXc=");
_c = ConfirmDialogProvider;
const useConfirmDialog = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ConfirmDialogContext);
    if (!context) {
        throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
    }
    return context;
};
_s1(useConfirmDialog, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ConfirmDialogProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable */ /**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */ __turbopack_context__.s([
    "api",
    ()=>api,
    "components",
    ()=>components,
    "internal",
    ()=>internal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/components/index.js [app-client] (ecmascript) <locals>");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const internal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["componentsGeneric"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/shared/dynamic-title.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicTitle",
    ()=>DynamicTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/backend/convex/_generated/api.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function DynamicTitle() {
    _s();
    const organization = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$backend$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].organizations.get);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicTitle.useEffect": ()=>{
            if (organization?.name) {
                document.title = `OneTool - ${organization.name}`;
            } else {
                // Fallback when not logged in or no organization
                document.title = "OneTool";
            }
        }
    }["DynamicTitle.useEffect"], [
        organization?.name
    ]);
    // This component doesn't render anything
    return null;
}
_s(DynamicTitle, "x3yx/qEvdLjFYeSSEOHzvnfpHso=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = DynamicTitle;
var _c;
__turbopack_context__.k.register(_c, "DynamicTitle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_839725f8._.js.map