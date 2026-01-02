(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/ui/styled/styled-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StyledButton",
    ()=>StyledButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const StyledButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ label, onClick, intent = "outline", size = "md", icon, isLoading = false, disabled = false, type = "button", className = "", showArrow = true, children, ...props }, ref)=>{
    const getButtonStyling = (intent, size)=>{
        // Base classes with shadow, backdrop blur, and hover effects
        const baseClasses = "group inline-flex items-center gap-2 font-semibold transition-all duration-200 rounded-lg ring-1 shadow-sm hover:shadow-md backdrop-blur-sm";
        // Size variants
        const sizeClasses = {
            sm: "text-xs px-3 py-1.5",
            md: "text-sm px-4 py-2",
            lg: "text-base px-5 py-2.5"
        };
        // Intent variants with beautiful colors
        const intentClasses = {
            primary: "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 ring-primary/30 hover:ring-primary/40",
            success: "text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 ring-green-200 hover:ring-green-300 dark:text-green-400 dark:hover:text-green-300 dark:bg-green-950 dark:hover:bg-green-900 dark:ring-green-800 dark:hover:ring-green-700",
            destructive: "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 ring-red-200 hover:ring-red-300 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950 dark:hover:bg-red-900 dark:ring-red-800 dark:hover:ring-red-700",
            warning: "text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 ring-amber-200 hover:ring-amber-300 dark:text-amber-400 dark:hover:text-amber-300 dark:bg-amber-950 dark:hover:bg-amber-900 dark:ring-amber-800 dark:hover:ring-amber-700",
            secondary: "text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 dark:hover:ring-gray-600",
            outline: "text-gray-600 hover:text-gray-700 bg-white hover:bg-gray-50 ring-gray-200 hover:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600",
            plain: "text-gray-600 hover:text-gray-700 bg-transparent hover:bg-gray-50 ring-transparent hover:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:ring-gray-700"
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseClasses, sizeClasses[size], intentClasses[intent]);
    };
    const buttonClasses = getButtonStyling(intent, size);
    const isDisabled = disabled || isLoading;
    const displayText = isLoading ? "Loading..." : label || children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        onClick: onClick,
        disabled: isDisabled,
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonClasses, isDisabled && "opacity-50 cursor-not-allowed", className),
        ...props,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0",
                children: icon
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ui/styled/styled-button.tsx",
                lineNumber: 109,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            displayText,
            !isLoading && showArrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "group-hover:translate-x-1 transition-transform duration-200",
                children: "→"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ui/styled/styled-button.tsx",
                lineNumber: 112,
                columnNumber: 6
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ui/styled/styled-button.tsx",
        lineNumber: 97,
        columnNumber: 4
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = StyledButton;
StyledButton.displayName = "StyledButton";
var _c, _c1;
__turbopack_context__.k.register(_c, "StyledButton$forwardRef");
__turbopack_context__.k.register(_c1, "StyledButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/CardSwap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$gsap$40$3$2e$14$2e$2$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/gsap@3.14.2/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
;
;
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ customClass, ...rest }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        ...rest,
        className: `absolute top-1/2 left-1/2 rounded-xl border border-border bg-card transform-3d will-change-transform backface-hidden ${customClass ?? ""} ${rest.className ?? ""}`.trim()
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CardSwap.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const makeSlot = (i, distX, distY, total)=>({
        x: i * distX,
        y: -i * distY,
        z: -i * distX * 1.5,
        zIndex: total - i
    });
const placeNow = (el, slot, skew)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$gsap$40$3$2e$14$2e$2$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: "center center",
        zIndex: slot.zIndex,
        force3D: true
    });
const CardSwap = ({ width = 500, height = 400, cardDistance = 60, verticalDistance = 70, delay = 3000, pauseOnHover = true, onCardClick, skewAmount = 6, easing = "linear", children })=>{
    _s();
    const config = easing === "elastic" ? {
        ease: "elastic.out(0.6,0.9)",
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05
    } : {
        ease: "power1.inOut",
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2
    };
    const childArr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CardSwap.useMemo[childArr]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children)
    }["CardSwap.useMemo[childArr]"], [
        children
    ]);
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CardSwap.useMemo[refs]": ()=>childArr.map({
                "CardSwap.useMemo[refs]": ()=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createRef()
            }["CardSwap.useMemo[refs]"])
    }["CardSwap.useMemo[refs]"], [
        childArr
    ]);
    const order = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Array.from({
        length: childArr.length
    }, {
        "CardSwap.useRef[order]": (_, i)=>i
    }["CardSwap.useRef[order]"]));
    const tlRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const container = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CardSwap.useEffect": ()=>{
            const total = refs.length;
            refs.forEach({
                "CardSwap.useEffect": (r, i)=>{
                    if (r.current) {
                        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
                    }
                }
            }["CardSwap.useEffect"]);
            const swap = {
                "CardSwap.useEffect.swap": ()=>{
                    if (order.current.length < 2) return;
                    const [front, ...rest] = order.current;
                    const elFront = refs[front]?.current;
                    if (!elFront) return;
                    const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$gsap$40$3$2e$14$2e$2$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
                    tlRef.current = tl;
                    tl.to(elFront, {
                        y: "+=500",
                        duration: config.durDrop,
                        ease: config.ease
                    });
                    tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
                    rest.forEach({
                        "CardSwap.useEffect.swap": (idx, i)=>{
                            const el = refs[idx]?.current;
                            if (!el) return;
                            const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
                            tl.set(el, {
                                zIndex: slot.zIndex
                            }, "promote");
                            tl.to(el, {
                                x: slot.x,
                                y: slot.y,
                                z: slot.z,
                                duration: config.durMove,
                                ease: config.ease
                            }, `promote+=${i * 0.15}`);
                        }
                    }["CardSwap.useEffect.swap"]);
                    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
                    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
                    tl.call({
                        "CardSwap.useEffect.swap": ()=>{
                            if (elFront) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$gsap$40$3$2e$14$2e$2$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(elFront, {
                                    zIndex: backSlot.zIndex
                                });
                            }
                        }
                    }["CardSwap.useEffect.swap"], undefined, "return");
                    tl.to(elFront, {
                        x: backSlot.x,
                        y: backSlot.y,
                        z: backSlot.z,
                        duration: config.durReturn,
                        ease: config.ease
                    }, "return");
                    tl.call({
                        "CardSwap.useEffect.swap": ()=>{
                            if (elFront) {
                                order.current = [
                                    ...rest,
                                    front
                                ];
                            }
                        }
                    }["CardSwap.useEffect.swap"]);
                }
            }["CardSwap.useEffect.swap"];
            swap();
            intervalRef.current = window.setInterval(swap, delay);
            if (pauseOnHover) {
                const node = container.current;
                if (!node) return ({
                    "CardSwap.useEffect": ()=>clearInterval(intervalRef.current)
                })["CardSwap.useEffect"];
                const pause = {
                    "CardSwap.useEffect.pause": ()=>{
                        tlRef.current?.pause();
                        clearInterval(intervalRef.current);
                    }
                }["CardSwap.useEffect.pause"];
                const resume = {
                    "CardSwap.useEffect.resume": ()=>{
                        tlRef.current?.play();
                        intervalRef.current = window.setInterval(swap, delay);
                    }
                }["CardSwap.useEffect.resume"];
                node.addEventListener("mouseenter", pause);
                node.addEventListener("mouseleave", resume);
                return ({
                    "CardSwap.useEffect": ()=>{
                        node.removeEventListener("mouseenter", pause);
                        node.removeEventListener("mouseleave", resume);
                        clearInterval(intervalRef.current);
                    }
                })["CardSwap.useEffect"];
            }
            return ({
                "CardSwap.useEffect": ()=>clearInterval(intervalRef.current)
            })["CardSwap.useEffect"];
        }
    }["CardSwap.useEffect"], [
        cardDistance,
        verticalDistance,
        delay,
        pauseOnHover,
        skewAmount,
        easing
    ]);
    const rendered = childArr.map((child, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
            key: i,
            ref: refs[i],
            style: {
                width,
                height,
                ...child.props.style ?? {}
            },
            onClick: (e)=>{
                child.props.onClick?.(e);
                onCardClick?.(i);
            }
        }) : child);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: container,
        className: "absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[5%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[10%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[10%] max-[480px]:scale-[0.55]",
        style: {
            width,
            height
        },
        children: rendered
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CardSwap.tsx",
        lineNumber: 248,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CardSwap, "5z7bVraXmd7pedIrWiwynjzfnoo=");
_c2 = CardSwap;
const __TURBOPACK__default__export__ = CardSwap;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Card$forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardSwap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$label$40$2$2e$1$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$0$2e$14_$5f40$types$2b$react$40$_97b351ea6ee0cc33b20e191704df15bd$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-label@2.1.8_@types+react-dom@19.2.3_@types+react@19.0.14__@types+react@_97b351ea6ee0cc33b20e191704df15bd/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$label$40$2$2e$1$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$0$2e$14_$5f40$types$2b$react$40$_97b351ea6ee0cc33b20e191704df15bd$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/hero-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/styled/styled-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CardSwap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/textarea.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function HeroSection() {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [isScheduleDemoOpen, setIsScheduleDemoOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: ""
    });
    const [formStatus, setFormStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: null,
        message: ""
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSection.useEffect": ()=>{
            setMounted(true);
        }
    }["HeroSection.useEffect"], []);
    const handleScheduleDemo = async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({
            type: null,
            message: ""
        });
        try {
            const response = await fetch("/api/schedule-demo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to send demo request");
            }
            setFormStatus({
                type: "success",
                message: "Thank you! We'll be in touch within 24 hours to schedule your demo."
            });
            // Reset form after successful submission
            setTimeout(()=>{
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    phone: "",
                    message: ""
                });
                setIsScheduleDemoOpen(false);
                setFormStatus({
                    type: null,
                    message: ""
                });
            }, 2000);
        } catch (error) {
            setFormStatus({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to send demo request. Please try again."
            });
        } finally{
            setIsSubmitting(false);
        }
    };
    // Prevent hydration mismatch by not rendering until theme is resolved
    if (!mounted || !resolvedTheme) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative bg-white dark:bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative isolate",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        "aria-hidden": "true",
                        className: "absolute inset-x-0 top-0 -z-10 h-256 w-full mask-[radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-200 dark:stroke-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                    x: "50%",
                                    y: -1,
                                    id: "1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84",
                                    width: 200,
                                    height: 200,
                                    patternUnits: "userSpaceOnUse",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M.5 200V.5H200",
                                        fill: "none"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                        lineNumber: 108,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                    lineNumber: 100,
                                    columnNumber: 8
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                lineNumber: 99,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                x: "50%",
                                y: -1,
                                className: "overflow-visible fill-gray-50 dark:fill-gray-800",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z",
                                    strokeWidth: 0
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                    lineNumber: 116,
                                    columnNumber: 8
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                lineNumber: 111,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                fill: "url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)",
                                width: "100%",
                                height: "100%",
                                strokeWidth: 0
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                lineNumber: 121,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                        lineNumber: 95,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: "absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                clipPath: "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)"
                            },
                            className: "aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                            lineNumber: 132,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                        lineNumber: 128,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-7xl px-6 pt-24 pb-32 sm:pt-32 lg:px-8 lg:pt-36",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white",
                                                children: "Simplify your growing business with OneTool."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                lineNumber: 144,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none dark:text-gray-400",
                                                children: "OneTool brings together quotes, projects, clients, and invoices — everything you need to keep work moving."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                lineNumber: 147,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-10 flex items-center gap-x-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                        intent: "primary",
                                                        size: "lg",
                                                        onClick: ()=>{
                                                        // Handle Start Free Trial action
                                                        },
                                                        children: "Start Free Trial"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                        intent: "outline",
                                                        size: "lg",
                                                        onClick: ()=>setIsScheduleDemoOpen(true),
                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            className: "h-5 w-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 18
                                                        }, void 0),
                                                        children: "Schedule a Demo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                lineNumber: 151,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                isOpen: isScheduleDemoOpen,
                                                onClose: ()=>setIsScheduleDemoOpen(false),
                                                title: "Schedule a Demo",
                                                size: "md",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                                            children: "Fill out the form below and we'll reach out within 24 hours to schedule your personalized demo."
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                            onSubmit: handleScheduleDemo,
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "name",
                                                                            children: [
                                                                                "Name ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 187,
                                                                                    columnNumber: 20
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 186,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "name",
                                                                            type: "text",
                                                                            required: true,
                                                                            placeholder: "John Doe",
                                                                            value: formData.name,
                                                                            onChange: (e)=>setFormData({
                                                                                    ...formData,
                                                                                    name: e.target.value
                                                                                }),
                                                                            disabled: isSubmitting
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 189,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 185,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "email",
                                                                            children: [
                                                                                "Email ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 204,
                                                                                    columnNumber: 21
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "email",
                                                                            type: "email",
                                                                            required: true,
                                                                            placeholder: "john@company.com",
                                                                            value: formData.email,
                                                                            onChange: (e)=>setFormData({
                                                                                    ...formData,
                                                                                    email: e.target.value
                                                                                }),
                                                                            disabled: isSubmitting
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 206,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 202,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "company",
                                                                            children: "Company"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 223,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "company",
                                                                            type: "text",
                                                                            placeholder: "Acme Inc.",
                                                                            value: formData.company,
                                                                            onChange: (e)=>setFormData({
                                                                                    ...formData,
                                                                                    company: e.target.value
                                                                                }),
                                                                            disabled: isSubmitting
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 224,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 222,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "phone",
                                                                            children: "Phone"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 240,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "phone",
                                                                            type: "tel",
                                                                            placeholder: "+1 (555) 123-4567",
                                                                            value: formData.phone,
                                                                            onChange: (e)=>setFormData({
                                                                                    ...formData,
                                                                                    phone: e.target.value
                                                                                }),
                                                                            disabled: isSubmitting
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 241,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 239,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "message",
                                                                            children: "Message"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 257,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                                            id: "message",
                                                                            placeholder: "Tell us about your business and what you'd like to see in the demo...",
                                                                            value: formData.message,
                                                                            onChange: (e)=>setFormData({
                                                                                    ...formData,
                                                                                    message: e.target.value
                                                                                }),
                                                                            disabled: isSubmitting,
                                                                            rows: 4
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 258,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 13
                                                                }, this),
                                                                formStatus.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `p-3 rounded-lg text-sm ${formStatus.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"}`,
                                                                    children: formStatus.message
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 274,
                                                                    columnNumber: 14
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-end gap-3 pt-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                                            type: "button",
                                                                            intent: "outline",
                                                                            onClick: ()=>setIsScheduleDemoOpen(false),
                                                                            disabled: isSubmitting,
                                                                            children: "Cancel"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 286,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                                            type: "submit",
                                                                            intent: "primary",
                                                                            isLoading: isSubmitting,
                                                                            disabled: isSubmitting || !formData.name.trim() || !formData.email.trim(),
                                                                            children: isSubmitting ? "Sending..." : "Request Demo"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 294,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 285,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                lineNumber: 172,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                        lineNumber: 143,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative mt-14 flex h-[450px] w-full items-center justify-center sm:-mt-44 lg:mt-0 lg:h-[600px] lg:justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            width: "100%",
                                            height: "100%",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 rounded-full bg-blue-500/10 p-3 ring-1 ring-blue-500/20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        width: "24",
                                                                        height: "24",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        className: "text-blue-500",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M3 3v18h18"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 331,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "m19 9-5 5-4-4-3 3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 332,
                                                                                columnNumber: 15
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 319,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 318,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-2 text-xl font-bold text-gray-900 dark:text-white",
                                                                    children: "Quotes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 335,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6",
                                                                    children: "Create professional quotes in seconds and win more work."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 338,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 317,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full space-y-3 py-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-600 dark:text-gray-400",
                                                                            children: "Consultation"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 347,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-gray-900 dark:text-white",
                                                                            children: "$150.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 350,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-600 dark:text-gray-400",
                                                                            children: "Materials"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 355,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-gray-900 dark:text-white",
                                                                            children: "$2,500.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 358,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-600 dark:text-gray-400",
                                                                            children: "Labor (20hrs)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 363,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-gray-900 dark:text-white",
                                                                            children: "$1,850.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 366,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 362,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-gray-600 dark:text-gray-300",
                                                                            children: "Kitchen Remodel"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 375,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-blue-600 dark:text-blue-400 font-semibold",
                                                                            children: "#Q-1024"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 378,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 374,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-px bg-gray-200 dark:bg-gray-800 w-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "Total"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 384,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-bold text-gray-900 dark:text-white",
                                                                            children: "$4,500.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 385,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 383,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 373,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 rounded-full bg-purple-500/10 p-3 ring-1 ring-purple-500/20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        width: "24",
                                                                        height: "24",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        className: "text-purple-500",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 408,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                cx: "9",
                                                                                cy: "7",
                                                                                r: "4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 409,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M22 21v-2a4 4 0 0 0-3-3.87"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 410,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M16 3.13a4 4 0 0 1 0 7.75"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 411,
                                                                                columnNumber: 15
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 396,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 395,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-2 text-xl font-bold text-gray-900 dark:text-white",
                                                                    children: "Clients"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 414,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6",
                                                                    children: "Manage all your client relationships in one place."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 417,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex w-full items-center gap-4 py-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                        className: "h-8 w-8 text-purple-600 dark:text-purple-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 426,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-1 flex-col justify-center space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                                    className: "h-3.5 w-3.5 shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 431,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    children: "+1 (555) 123-4567"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 432,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 430,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                                    className: "h-3.5 w-3.5 shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 435,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    children: "john.doe@example.com"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 434,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                    className: "h-3.5 w-3.5 shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 441,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    children: "Austin, TX"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 442,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 440,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400",
                                                                    children: "JD"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 449,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-left flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs font-semibold text-gray-900 dark:text-white",
                                                                            children: "John Doe"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 453,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "h-1.5 w-1.5 rounded-full bg-green-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 457,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                "Active Client"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 456,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 452,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 448,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 rounded-full bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        width: "24",
                                                                        height: "24",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        className: "text-indigo-500",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M2 12h20"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 480,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M7 12v6h10v-6"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 481,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M12 2v20"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 482,
                                                                                columnNumber: 15
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 468,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-2 text-xl font-bold text-gray-900 dark:text-white",
                                                                    children: "Projects"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6",
                                                                    children: "Keep your projects organized and on track."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 488,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 466,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full space-y-3 py-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex w-full items-center justify-between gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                        className: "h-3 w-3"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                        lineNumber: 498,
                                                                                        columnNumber: 16
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 497,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-gray-600 dark:text-gray-300 line-through",
                                                                                    children: "Initial Survey"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 500,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 496,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] text-gray-400",
                                                                            children: "Oct 24"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 504,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex w-full items-center justify-between gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                        className: "h-3 w-3"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                        lineNumber: 511,
                                                                                        columnNumber: 16
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 510,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-gray-600 dark:text-gray-300 line-through",
                                                                                    children: "Permit Approval"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 513,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 509,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] text-gray-400",
                                                                            children: "Nov 01"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 517,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex w-full items-center justify-between gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 523,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-900 dark:text-white",
                                                                                    children: "Material Delivery"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 524,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 522,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                                                                            children: "Today"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 528,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 494,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-gray-900 dark:text-white",
                                                                            children: "Site Renovation"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 537,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-indigo-600 dark:text-indigo-400 font-medium",
                                                                            children: "75%"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 540,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 536,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-full w-3/4 rounded-full bg-indigo-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 545,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 535,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CardSwap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 rounded-full bg-green-500/10 p-3 ring-1 ring-green-500/20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        width: "24",
                                                                        height: "24",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        className: "text-green-500",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                cx: "12",
                                                                                cy: "12",
                                                                                r: "10"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 566,
                                                                                columnNumber: 15
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M12 6v6l4 2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                lineNumber: 567,
                                                                                columnNumber: 15
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 14
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 553,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-2 text-xl font-bold text-gray-900 dark:text-white",
                                                                    children: "Invoices"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 570,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6",
                                                                    children: "Get paid faster with automated invoicing."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 573,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 552,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full space-y-3 py-2 text-left",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[10px] text-gray-500 uppercase",
                                                                            children: "Bill To"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 581,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-medium text-gray-900 dark:text-white",
                                                                            children: "Acme Corp"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 584,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[10px] text-gray-500",
                                                                            children: "Attn: Jane Smith"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 587,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-2 gap-4 pt-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[10px] text-gray-500 uppercase",
                                                                                    children: "Invoice Date"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 593,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-medium text-gray-900 dark:text-white",
                                                                                    children: "Dec 12, 2024"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 596,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 592,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[10px] text-gray-500 uppercase",
                                                                                    children: "Due Date"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 601,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-medium text-gray-900 dark:text-white",
                                                                                    children: "Dec 26, 2024"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                                    lineNumber: 604,
                                                                                    columnNumber: 15
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 600,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 591,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 579,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 flex justify-between items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] text-gray-500 uppercase tracking-wide",
                                                                            children: "Amount Due"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 614,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-bold text-gray-900 dark:text-white",
                                                                            children: "$2,800.00"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                            lineNumber: 617,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 613,
                                                                    columnNumber: 13
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400",
                                                                    children: "Paid"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                                    lineNumber: 621,
                                                                    columnNumber: 13
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                            lineNumber: 314,
                                            columnNumber: 10
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                        lineNumber: 313,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                                lineNumber: 142,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                            lineNumber: 141,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                        lineNumber: 140,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
                lineNumber: 94,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
            lineNumber: 93,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/hero-section.tsx",
        lineNumber: 91,
        columnNumber: 3
    }, this);
}
_s(HeroSection, "h6KvV3Qcv4T+TlaLGXa/CNre2Vg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = HeroSection;
var _c;
__turbopack_context__.k.register(_c, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/feature-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FeatureSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$motion$2d$value$2d$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/utils/use-motion-value-event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
// --- Widgets ---
function ClientWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-4 bg-blue-500 rounded-full opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 35,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 34,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 38,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 39,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 37,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-2 w-2 rounded-full ${i === 1 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 41,
                            columnNumber: 7
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 30,
                    columnNumber: 6
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 28,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, this);
}
_c = ClientWidget;
function ProjectWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full p-4 flex flex-col justify-center h-full gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] font-semibold text-gray-600 dark:text-gray-300",
                                children: "Smith Residence Reno"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 59,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[9px] font-medium text-gray-400",
                                children: "75%"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 62,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 58,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full w-3/4 bg-indigo-500 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 65,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 64,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 57,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] font-semibold text-gray-600 dark:text-gray-300",
                                children: "Office HVAC Install"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 72,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[9px] font-medium text-gray-400",
                                children: "30%"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 75,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 71,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full w-[30%] bg-purple-500 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 78,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 77,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 70,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] font-semibold text-gray-600 dark:text-gray-300",
                                children: "Downtown Lawn Service"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 85,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[9px] font-medium text-gray-400",
                                children: "90%"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 88,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 84,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full w-[90%] bg-green-500 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 91,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 90,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 83,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, this);
}
_c1 = ProjectWidget;
function InvoiceWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-32 bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-2 transform rotate-[-4deg]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-sm"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 103,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 104,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 102,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1 py-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 107,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 108,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 109,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 106,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 112,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-8 bg-green-500/20 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 113,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 111,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 101,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 100,
        columnNumber: 3
    }, this);
}
_c2 = InvoiceWidget;
function TaskWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full p-4 flex gap-3 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] font-semibold text-gray-500 uppercase tracking-wider",
                        children: "To Do"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 124,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1.5 w-12 bg-orange-200 dark:bg-orange-900/50 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 128,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 129,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 127,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-16 bg-orange-300 dark:bg-orange-800/50 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 132,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 131,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 123,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] font-semibold text-gray-500 uppercase tracking-wider",
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 136,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2 rounded bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-1 opacity-60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1.5 w-10 bg-green-200 dark:bg-green-900/50 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 140,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1 w-16 bg-gray-100 dark:bg-gray-800 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 141,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 139,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 135,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 122,
        columnNumber: 3
    }, this);
}
_c3 = TaskWidget;
function MobileWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex items-center justify-center p-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-24 h-40 border-4 border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-800 dark:bg-gray-700 rounded-b-lg"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 152,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-2 p-3 pt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "aspect-square bg-purple-100 dark:bg-purple-900/20 rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 154,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "aspect-square bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 155,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "aspect-square bg-green-100 dark:bg-green-900/20 rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 156,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "aspect-square bg-orange-100 dark:bg-orange-900/20 rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 157,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 153,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 151,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 150,
        columnNumber: 3
    }, this);
}
_c4 = MobileWidget;
function StripeWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col justify-center items-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[180px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 transform transition-transform group-hover:-translate-y-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-8 bg-gray-200 dark:bg-gray-700 rounded"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 169,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 w-3 bg-green-500 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 170,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 168,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 173,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-2/3 bg-gray-100 dark:bg-gray-800 rounded"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 174,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 172,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-bold text-gray-900 dark:text-white",
                            children: "$1.2k"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 177,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-5 w-12 bg-blue-600 rounded text-[8px] flex items-center justify-center text-white font-medium",
                            children: "Pay"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 180,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 176,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 167,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 166,
        columnNumber: 3
    }, this);
}
_c5 = StripeWidget;
function EmailWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col justify-center items-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[180px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-gray-100 dark:border-gray-800 p-2 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1.5 h-1.5 rounded-full bg-red-400"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 194,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1.5 h-1.5 rounded-full bg-yellow-400"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 195,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1.5 h-1.5 rounded-full bg-green-400"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 196,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 193,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-2 space-y-1.5",
                    children: [
                        1,
                        2
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-2 p-1.5 rounded ${i === 2 ? "bg-purple-50 dark:bg-purple-900/20" : ""}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 206,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-1 w-10 bg-gray-200 dark:bg-gray-700 rounded mb-1"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                            lineNumber: 208,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-1 w-full bg-gray-100 dark:bg-gray-800 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                            lineNumber: 209,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 207,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 200,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 198,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 192,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 191,
        columnNumber: 3
    }, this);
}
_c6 = EmailWidget;
function RBACWidget() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col justify-center items-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative group/admin",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-2 shadow-sm transform transition-transform hover:scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                    className: "w-3 h-3"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 226,
                                    columnNumber: 8
                                }, this),
                                " Admin"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 225,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 224,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 223,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative group/emp",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm transform transition-transform hover:scale-110 opacity-60",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                    className: "w-3 h-3"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 233,
                                    columnNumber: 8
                                }, this),
                                " Staff"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 232,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 231,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 230,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 222,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 221,
        columnNumber: 3
    }, this);
}
_c7 = RBACWidget;
// Color styles mapping
const colorStyles = {
    blue: {
        gradient: "from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent",
        iconBg: "bg-blue-500/10",
        iconText: "text-blue-600 dark:text-blue-400",
        cardBorder: "border-blue-100 dark:border-blue-900/50",
        cardBg: "bg-blue-50/50 dark:bg-blue-900/10",
        titleText: "text-blue-900 dark:text-blue-100"
    },
    indigo: {
        gradient: "from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent",
        iconBg: "bg-indigo-500/10",
        iconText: "text-indigo-600 dark:text-indigo-400",
        cardBorder: "border-indigo-100 dark:border-indigo-900/50",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-900/10",
        titleText: "text-indigo-900 dark:text-indigo-100"
    },
    green: {
        gradient: "from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent",
        iconBg: "bg-green-500/10",
        iconText: "text-green-600 dark:text-green-400",
        cardBorder: "border-green-100 dark:border-green-900/50",
        cardBg: "bg-green-50/50 dark:bg-green-900/10",
        titleText: "text-green-900 dark:text-green-100"
    },
    orange: {
        gradient: "from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent",
        iconBg: "bg-orange-500/10",
        iconText: "text-orange-600 dark:text-orange-400",
        cardBorder: "border-orange-100 dark:border-orange-900/50",
        cardBg: "bg-orange-50/50 dark:bg-orange-900/10",
        titleText: "text-orange-900 dark:text-orange-100"
    },
    purple: {
        gradient: "from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent",
        iconBg: "bg-purple-500/10",
        iconText: "text-purple-600 dark:text-purple-400",
        cardBorder: "border-purple-100 dark:border-purple-900/50",
        cardBg: "bg-purple-50/50 dark:bg-purple-900/10",
        titleText: "text-purple-900 dark:text-purple-100"
    },
    red: {
        gradient: "from-red-50/50 to-transparent dark:from-red-900/10 dark:to-transparent",
        iconBg: "bg-red-500/10",
        iconText: "text-red-600 dark:text-red-400",
        cardBorder: "border-red-100 dark:border-red-900/50",
        cardBg: "bg-red-50/50 dark:bg-red-900/10",
        titleText: "text-red-900 dark:text-red-100"
    },
    gray: {
        gradient: "from-gray-50/50 to-transparent dark:from-gray-900/10 dark:to-transparent",
        iconBg: "bg-gray-500/10",
        iconText: "text-gray-600 dark:text-gray-400",
        cardBorder: "border-gray-100 dark:border-gray-900/50",
        cardBg: "bg-gray-50/50 dark:bg-gray-900/10",
        titleText: "text-gray-900 dark:text-gray-100"
    }
};
const features = [
    {
        title: "Client Management",
        description: "Keep detailed client profiles & history.",
        details: "Store comprehensive client data including contact info, service history, and communication logs. Never miss a follow-up with automated reminders.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ClientWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 318,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "blue"
    },
    {
        title: "Project Tracking",
        description: "Track status, deadlines, and progress.",
        details: "Visual Kanban boards and list views help you manage projects from lead to completion. Track time, expenses, and milestones in real-time.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 327,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "indigo"
    },
    {
        title: "Quoting & Invoicing",
        description: "Create quotes and invoices instantly.",
        details: "Generate professional estimates and invoices in seconds. Accept credit cards and bank transfers directly through the secure client portal.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InvoiceWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 336,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "green"
    },
    {
        title: "Task Scheduling",
        description: "Smart scheduling and reminders.",
        details: "Use the calendar view to keep tasks top of mind. Assignment and recurring tasks are also available to help stay on top of recurring items that need to be addressed.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TaskWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 345,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "orange"
    },
    {
        title: "Mobile Access",
        description: "Work from anywhere, anytime.",
        details: "Developed with mobile first in mind so you can access the site directly from your phone to continue pushing projects further.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 354,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "purple"
    },
    {
        title: "Stripe Connect",
        description: "Collect payments automatically.",
        details: "Integrated payments mean faster cash flow. set up recurring billing, deposits, and instant payouts to your bank account via Stripe.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StripeWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 363,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "blue"
    },
    {
        title: "Email Hub",
        description: "Unified communication center.",
        details: "Draft and respond to email threads directly within OneTool so you don't need to jump between multiple platforms.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 372,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "purple"
    },
    {
        title: "Role-Based Access",
        description: "Secure permissions for your team.",
        details: "Distinct views between admins and employees ensure admins have a full view while employees can see only what they need.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        widget: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RBACWidget, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 381,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: "red"
    }
];
const CARD_WIDTH = 320; // w-80 = 20rem = 320px
const CARD_HEIGHT = 320; // h-80
const ORBIT_RADIUS_X = 500; // Wider orbit
const ORBIT_RADIUS_Z = 200; // Depth of orbit
function FeatureCard({ feature, index, rotation, total }) {
    _s();
    const styles = colorStyles[feature.color] || colorStyles.gray;
    const angleStep = 360 / total;
    const baseAngle = index * angleStep;
    const transform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(rotation, {
        "FeatureCard.useTransform[transform]": (r)=>{
            const currentAngle = (baseAngle + r) * (Math.PI / 180);
            // Calculate orbital position (0° = front, 180° = back)
            const x = Math.sin(currentAngle) * ORBIT_RADIUS_X;
            const z = Math.cos(currentAngle) * ORBIT_RADIUS_Z;
            const normalizedZ = Math.cos(currentAngle);
            // Scale cards based on depth (front = 1.0, back = 0.6)
            const scale = 0.6 + (normalizedZ + 1) / 2 * 0.4;
            return `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        }
    }["FeatureCard.useTransform[transform]"]);
    const zIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(rotation, {
        "FeatureCard.useTransform[zIndex]": (r)=>{
            const currentAngle = (baseAngle + r) * (Math.PI / 180);
            const normalizedZ = Math.cos(currentAngle);
            return Math.round((normalizedZ + 1) * 100);
        }
    }["FeatureCard.useTransform[zIndex]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        style: {
            transform,
            zIndex,
            position: "absolute",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            left: "50%",
            top: "50%",
            marginLeft: -CARD_WIDTH / 2,
            marginTop: -CARD_HEIGHT / 2
        },
        className: "overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 relative overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute inset-0 bg-linear-to-b ${styles.gradient} opacity-50`
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 443,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 h-full w-full",
                            children: feature.widget
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 446,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 442,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-20 p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-2 rounded-xl ${styles.iconBg} ${styles.iconText}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(feature.icon, {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                    lineNumber: 454,
                                    columnNumber: 8
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 451,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900 dark:text-white text-base",
                                children: feature.title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 456,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 450,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 449,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
            lineNumber: 441,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 427,
        columnNumber: 3
    }, this);
}
_s(FeatureCard, "O//Siu104kPNdcft2sIOAOzkGrw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c8 = FeatureCard;
function FeatureSection() {
    _s1();
    const [activeFeature, setActiveFeature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(features[0]);
    const rotation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    // Animate rotation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeatureSection.useEffect": ()=>{
            let lastTime = performance.now();
            let animationFrame;
            const loop = {
                "FeatureSection.useEffect.loop": (time)=>{
                    const delta = time - lastTime;
                    const speed = 0.005; // slower rotation speed
                    rotation.set(rotation.get() + delta * speed);
                    lastTime = time;
                    animationFrame = requestAnimationFrame(loop);
                }
            }["FeatureSection.useEffect.loop"];
            animationFrame = requestAnimationFrame(loop);
            return ({
                "FeatureSection.useEffect": ()=>cancelAnimationFrame(animationFrame)
            })["FeatureSection.useEffect"];
        }
    }["FeatureSection.useEffect"], [
        rotation
    ]);
    // Detect which feature is closest to the front (angle 0) and set as active
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$motion$2d$value$2d$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValueEvent"])(rotation, "change", {
        "FeatureSection.useMotionValueEvent": (latest)=>{
            const step = 360 / features.length;
            let closestIndex = 0;
            let minDist = 360;
            features.forEach({
                "FeatureSection.useMotionValueEvent": (_, i)=>{
                    const itemAngle = (i * step + latest) % 360;
                    const dist = Math.min(Math.abs(itemAngle), Math.abs(itemAngle - 360));
                    if (dist < minDist) {
                        minDist = dist;
                        closestIndex = i;
                    }
                }
            }["FeatureSection.useMotionValueEvent"]);
            if (features[closestIndex] !== activeFeature) {
                setActiveFeature(features[closestIndex]);
            }
        }
    }["FeatureSection.useMotionValueEvent"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white py-24 sm:py-32 dark:bg-gray-900 min-h-[900px] flex flex-col justify-center relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-7xl px-6 lg:px-8 mb-8 relative z-30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    whileInView: {
                        opacity: 1,
                        y: 0
                    },
                    viewport: {
                        once: true
                    },
                    transition: {
                        duration: 0.5
                    },
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base/7 font-semibold text-primary",
                            children: "Streamline operations"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 522,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white",
                            children: "Every Business, Every Stage, OneTool."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 525,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto",
                            children: "From client management to invoicing, OneTool provides a complete solution for small business professionals."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                            lineNumber: 528,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 515,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 514,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-[600px] flex items-center justify-center perspective-1000",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white dark:from-gray-900 z-10"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 538,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white dark:from-gray-900 z-10"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 539,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full h-full max-w-5xl mx-auto perspective-[1000px]",
                        children: features.map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureCard, {
                                feature: feature,
                                index: idx,
                                rotation: rotation,
                                total: features.length
                            }, idx, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 543,
                                columnNumber: 7
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 541,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 536,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-48 mx-auto max-w-3xl px-6 relative flex items-center justify-center z-30 -mt-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "wait",
                    children: activeFeature ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20,
                            scale: 0.95
                        },
                        animate: {
                            opacity: 1,
                            y: 0,
                            scale: 1
                        },
                        exit: {
                            opacity: 0,
                            y: -20,
                            scale: 0.95
                        },
                        transition: {
                            duration: 0.4
                        },
                        className: `rounded-2xl border ${colorStyles[activeFeature.color || "gray"].cardBorder} ${colorStyles[activeFeature.color || "gray"].cardBg} p-6 text-center shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-900/80`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: `text-2xl font-bold ${colorStyles[activeFeature.color || "gray"].titleText} mb-3`,
                                children: activeFeature.title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 570,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed",
                                children: activeFeature.details
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                                lineNumber: 577,
                                columnNumber: 8
                            }, this)
                        ]
                    }, activeFeature.title, true, {
                        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                        lineNumber: 558,
                        columnNumber: 7
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                    lineNumber: 556,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
                lineNumber: 555,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/feature-section.tsx",
        lineNumber: 513,
        columnNumber: 3
    }, this);
}
_s1(FeatureSection, "N37RtmF/J9LN4+7dB6u5/e/68xk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$motion$2d$value$2d$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValueEvent"]
    ];
});
_c9 = FeatureSection;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "ClientWidget");
__turbopack_context__.k.register(_c1, "ProjectWidget");
__turbopack_context__.k.register(_c2, "InvoiceWidget");
__turbopack_context__.k.register(_c3, "TaskWidget");
__turbopack_context__.k.register(_c4, "MobileWidget");
__turbopack_context__.k.register(_c5, "StripeWidget");
__turbopack_context__.k.register(_c6, "EmailWidget");
__turbopack_context__.k.register(_c7, "RBACWidget");
__turbopack_context__.k.register(_c8, "FeatureCard");
__turbopack_context__.k.register(_c9, "FeatureSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/faq-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FAQSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const faqs = [
    {
        question: "What is OneTool and who is it for?",
        answer: "OneTool is a comprehensive business management platform designed for small business owners, contractors, landscapers, HVAC technicians, electricians, and other service professionals. It streamlines client management, project tracking, quoting, invoicing, and task scheduling in one unified platform."
    },
    {
        question: "How does OneTool help me manage my clients?",
        answer: "OneTool provides a centralized database for all your client information, including contact details, service history, property information, and communication logs. You can easily search, filter, and organize clients, set up automated reminders, and track every interaction to deliver exceptional service."
    },
    {
        question: "Can I create and send professional quotes and invoices?",
        answer: "Yes! OneTool includes a powerful quoting and invoicing system. Create customized quotes with line items, taxes, and your company branding. Send them directly via email with e-signature capabilities for quick approvals. Convert approved quotes to invoices with one click and track payment status."
    },
    {
        question: "Can I receive payments directly to my bank account?",
        answer: "Paid users of OneTool have access to our Stripe Connect integration which allows you to connect a bank account and send invoice payment links to clients."
    },
    {
        question: "Can I email clients directly from OneTool?",
        answer: "Yes, we offer the ability to draft professional emails to clients from directly within OneTool. We also support email threads so you can keep track of responses and replies without having to leave OneTool."
    },
    {
        question: "Is OneTool accessible on mobile devices?",
        answer: "Absolutely. OneTool is built as a responsive web application that works seamlessly on smartphones, tablets, and desktop computers. Access your client data, update project statuses, create quotes, and manage tasks from anywhere with an internet connection."
    },
    {
        question: "How does task scheduling work?",
        answer: "OneTool's task scheduling system lets you create tasks, assign them to team members, set due dates and priorities, and track completion status. You can view tasks in list or calendar format, set reminders, and get notifications when tasks are completed or overdue."
    },
    {
        question: "Can multiple team members use OneTool?",
        answer: "Yes! OneTool supports team collaboration with organization-based access. Add team members to your organization, assign roles and permissions, and work together in real-time. Everyone stays synchronized with instant updates across all devices."
    },
    {
        question: "What kind of support do you offer?",
        answer: "We provide comprehensive support including detailed documentation, video tutorials, and email support. Premium plan subscribers also get priority support with faster response times and access to one-on-one onboarding assistance."
    },
    {
        question: "How secure is my data?",
        answer: "Security is our top priority. OneTool uses industry-standard encryption for data transmission and storage. Your data is hosted on secure servers with regular backups, and we comply with data protection regulations. You maintain full ownership of your data and can export it at any time."
    },
    {
        question: "Can I import my existing client data?",
        answer: "Yes! OneTool supports CSV imports, making it easy to migrate your existing client data. Simply export your data from your current system, map the fields, and import it into OneTool. We also provide guidance to help you with the migration process."
    },
    {
        question: "What happens if I need to cancel my subscription?",
        answer: "You can cancel your subscription at any time with no penalties. Your data remains accessible for 30 days after cancellation, giving you time to export everything you need. We also offer a full refund within the first 14 days if OneTool isn't the right fit for you."
    }
];
function FAQSection() {
    _s();
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggleFAQ = (index)=>{
        setOpenIndex(openIndex === index ? null : index);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white py-24 sm:py-32 dark:bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-4xl px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    whileInView: {
                        opacity: 1,
                        y: 0
                    },
                    viewport: {
                        once: true
                    },
                    transition: {
                        duration: 0.5
                    },
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base font-semibold leading-7 text-primary",
                            children: "FAQ"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 88,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white",
                            children: "Frequently Asked Questions"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 91,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400",
                            children: "Everything you need to know about OneTool and how it can transform your small business."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 94,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                    lineNumber: 81,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-16 space-y-4",
                    children: faqs.map((faq, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                duration: 0.3,
                                delay: index * 0.05
                            },
                            className: "overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleFAQ(index),
                                    className: "flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-semibold text-gray-900 dark:text-white",
                                            children: faq.question
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                            lineNumber: 115,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            animate: {
                                                rotate: openIndex === index ? 180 : 0
                                            },
                                            transition: {
                                                duration: 0.3
                                            },
                                            className: "ml-4 shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "h-5 w-5 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                                lineNumber: 123,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                            lineNumber: 118,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                    lineNumber: 111,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    children: openIndex === index && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            height: 0,
                                            opacity: 0
                                        },
                                        animate: {
                                            height: "auto",
                                            opacity: 1
                                        },
                                        exit: {
                                            height: 0,
                                            opacity: 0
                                        },
                                        transition: {
                                            duration: 0.3
                                        },
                                        className: "overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t border-gray-200 px-6 py-5 dark:border-gray-800",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-base leading-7 text-gray-600 dark:text-gray-400",
                                                children: faq.answer
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                                lineNumber: 137,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                            lineNumber: 136,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                        lineNumber: 129,
                                        columnNumber: 10
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                                    lineNumber: 127,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 103,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                    lineNumber: 101,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    whileInView: {
                        opacity: 1,
                        y: 0
                    },
                    viewport: {
                        once: true
                    },
                    transition: {
                        duration: 0.5,
                        delay: 0.5
                    },
                    className: "mt-16 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base leading-7 text-gray-600 dark:text-gray-400",
                            children: "Still have questions?"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 156,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "mailto:support@onetool.biz",
                            className: "mt-2 inline-flex items-center text-base font-semibold text-primary transition-colors hover:text-primary/80",
                            children: "Contact our support team →"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                            lineNumber: 159,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
                    lineNumber: 149,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
            lineNumber: 79,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/faq-section.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, this);
}
_s(FAQSection, "7z1SfW1ag/kVV/D8SOtFgmPOJ8o=");
_c = FAQSection;
var _c;
__turbopack_context__.k.register(_c, "FAQSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/shared/timeline-animation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimelineContent",
    ()=>TimelineContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/utils/use-in-view.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const TimelineContent = ({ children, animationNum, timelineRef, className, as, customVariants, once = false, ...props })=>{
    _s();
    const defaultSequenceVariants = {
        visible: (i)=>({
                filter: "blur(0px)",
                y: 0,
                opacity: 1,
                transition: {
                    delay: i * 0.5,
                    duration: 0.5
                }
            }),
        hidden: {
            filter: "blur(20px)",
            y: 0,
            opacity: 0
        }
    };
    // Use custom variants if provided, otherwise use default
    const sequenceVariants = customVariants || defaultSequenceVariants;
    const isInView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"])(timelineRef, {
        once
    });
    const MotionComponent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"][as || "div"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionComponent, {
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
        custom: animationNum,
        variants: sequenceVariants,
        className: className,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/timeline-animation.tsx",
        lineNumber: 52,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TimelineContent, "p7OYrP0ckzGpV75vVcm4NihLgqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"]
    ];
});
_c = TimelineContent;
var _c;
__turbopack_context__.k.register(_c, "TimelineContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/pricing-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PricingSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/check-check.js [app-client] (ecmascript) <export default as CheckCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.544.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/timeline-animation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/styled/styled-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$experimental$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+clerk-react@5.59.2_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@clerk/clerk-react/dist/experimental.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
// Utility function for conditional class names
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
const Card = ({ className, children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 30,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c = Card;
const CardHeader = ({ className, children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn("flex flex-col space-y-1.5 p-6", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 41,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c1 = CardHeader;
const CardContent = ({ className, children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn("p-6 pt-0", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 47,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c2 = CardContent;
const AnimatedNumber = ({ value, format, className })=>{
    _s();
    const [currentValue, setCurrentValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedNumber.useEffect": ()=>{
            const duration = 500; // milliseconds for the animation
            const animate = {
                "AnimatedNumber.useEffect.animate": (timestamp)=>{
                    if (!startTimeRef.current) {
                        startTimeRef.current = timestamp;
                    }
                    const progress = (timestamp - startTimeRef.current) / duration;
                    const easedProgress = Math.min(1, progress); // Ensure progress doesn't exceed 1
                    const newValue = easedProgress * value;
                    setCurrentValue(newValue);
                    if (progress < 1) {
                        animationFrameRef.current = requestAnimationFrame(animate);
                    } else {
                        setCurrentValue(value); // Ensure final value is exact
                        startTimeRef.current = null; // Reset for next animation
                    }
                }
            }["AnimatedNumber.useEffect.animate"];
            // Clear any existing animation frame before starting a new one
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            startTimeRef.current = null; // Reset start time for new animation
            animationFrameRef.current = requestAnimationFrame(animate);
            return ({
                "AnimatedNumber.useEffect": ()=>{
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                }
            })["AnimatedNumber.useEffect"];
        }
    }["AnimatedNumber.useEffect"], [
        value
    ]);
    const formatter = new Intl.NumberFormat("en-US", {
        style: format.style,
        currency: format.currency,
        maximumFractionDigits: format.maximumFractionDigits
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        children: formatter.format(currentValue)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 112,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AnimatedNumber, "PyjxUZjtwKM38QOUnvQo6GygXW8=");
_c3 = AnimatedNumber;
const plans = [
    {
        name: "Free",
        description: "Perfect for individuals and small teams getting started with project management",
        price: 0,
        yearlyPrice: 0,
        buttonText: "Get started",
        buttonVariant: "outline",
        features: [
            {
                text: "Limited Clients (10)",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 125,
                    columnNumber: 42
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                text: "Limited Active Projects per client (3)",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                text: "5 E-signature requests per month",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 130,
                    columnNumber: 54
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                text: "Custom Invoice & Quote PDF Generation",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }
        ],
        includes: []
    },
    {
        name: "Business",
        description: "Best value for growing businesses that need advanced features and unlimited access",
        price: 30,
        yearlyPrice: 300,
        buttonText: "Get started",
        buttonVariant: "default",
        popular: true,
        features: [
            {
                text: "Unlimited Clients",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 148,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                text: "Unlimited Active Projects per Client",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            },
            {
                text: "Unlimited E-signature requests per month",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 155,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }
        ],
        includes: [
            "Everything in Free, plus:",
            "Custom SKU Creation",
            "Unlimited Saved Organization Documents",
            "AI Import for Existing Clients/Projects",
            "Stripe Connect Integration - Send & Receive Payments",
            "Priority Support - 24 hour SLAs"
        ]
    }
];
const PricingSwitch = ({ onSwitch })=>{
    _s1();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("0");
    const handleSwitch = (value)=>{
        setSelected(value);
        onSwitch(value);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative z-50 mx-auto flex w-fit rounded-full bg-muted/30 border border-border p-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleSwitch("0"),
                    className: cn("relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors", selected === "0" ? "text-white" : "text-muted-foreground hover:text-foreground"),
                    children: [
                        selected === "0" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                            layoutId: "switch",
                            className: "absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-linear-to-t from-primary via-primary/80 to-primary",
                            transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                            lineNumber: 190,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative",
                            children: "Monthly"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                            lineNumber: 196,
                            columnNumber: 6
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 180,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleSwitch("1"),
                    className: cn("relative z-10 w-fit sm:h-12 h-10 shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors", selected === "1" ? "text-white" : "text-muted-foreground hover:text-foreground"),
                    children: [
                        selected === "1" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                            layoutId: "switch",
                            className: "absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-linear-to-t from-primary via-primary/80 to-primary",
                            transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                            lineNumber: 209,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative flex items-center gap-2",
                            children: [
                                "Yearly",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20",
                                    children: "Save 17%"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                    lineNumber: 217,
                                    columnNumber: 7
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                            lineNumber: 215,
                            columnNumber: 6
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 199,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
            lineNumber: 179,
            columnNumber: 4
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 178,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(PricingSwitch, "qN2Z1L/B76GCBCkIcIRd770KD60=");
_c4 = PricingSwitch;
function PricingSection() {
    _s2();
    const [isYearly, setIsYearly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pricingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Fetch plans from Clerk
    const { data: clerkPlans, isLoading: isLoadingPlans } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$experimental$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlans"])({
        for: "organization",
        enabled: true
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingSection.useEffect": ()=>{
            setMounted(true);
        }
    }["PricingSection.useEffect"], []);
    // Merge Clerk plan data with our custom features
    const getDisplayPlans = ()=>{
        // Always start with the hardcoded free plan
        const freePlan = plans.find((p)=>p.name === "Free");
        const displayPlans = freePlan ? [
            freePlan
        ] : [];
        // If Clerk plans are available, add them
        if (!isLoadingPlans && clerkPlans && clerkPlans.length > 0) {
            // Add paid plans from Clerk
            const clerkDisplayPlans = clerkPlans.filter((clerkPlan)=>clerkPlan.hasBaseFee) // Only paid plans
            .map((clerkPlan)=>{
                // Find matching hardcoded plan for custom features
                const hardcodedPlan = plans.find((p)=>p.name.toLowerCase() === clerkPlan.name.toLowerCase() || p.name === "Business");
                // Use Clerk pricing data
                const monthlyPrice = clerkPlan.fee?.amount ? clerkPlan.fee.amount / 100 : hardcodedPlan?.price ?? 0;
                const yearlyPrice = clerkPlan.annualFee?.amount ? clerkPlan.annualFee.amount / 100 : hardcodedPlan?.yearlyPrice ?? 0;
                return {
                    name: clerkPlan.name,
                    description: clerkPlan.description || hardcodedPlan?.description || "",
                    price: monthlyPrice,
                    yearlyPrice: yearlyPrice,
                    buttonText: hardcodedPlan?.buttonText || "Get started",
                    buttonVariant: hardcodedPlan?.buttonVariant || "default",
                    popular: hardcodedPlan?.popular,
                    features: hardcodedPlan?.features || [],
                    includes: hardcodedPlan?.includes || [],
                    clerkPlanId: clerkPlan.id
                };
            });
            displayPlans.push(...clerkDisplayPlans);
        } else {
            // Fallback: if Clerk plans aren't loaded, show all hardcoded plans
            const businessPlan = plans.find((p)=>p.name === "Business");
            if (businessPlan) {
                displayPlans.push(businessPlan);
            }
        }
        return displayPlans;
    };
    const displayPlans = getDisplayPlans();
    const handleGetStarted = ()=>{
        // Always redirect to sign-up page
        // Users can choose to sign in if they already have an account
        router.push("/sign-up");
    };
    // Render nothing until the component is mounted and theme is resolved to prevent hydration mismatches
    if (!mounted || !resolvedTheme) {
        return null;
    }
    const revealVariants = {
        visible: (i)=>({
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                    delay: i * 0.4,
                    duration: 0.5
                }
            }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0
        }
    };
    const togglePricingPeriod = (value)=>setIsYearly(Number.parseInt(value) === 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "not-prose relative flex w-full flex-col gap-12 bg-white px-4 py-16 text-center sm:px-8 mx-auto dark:bg-gray-900",
        ref: pricingRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 -z-10 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 340,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 341,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 342,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                lineNumber: 339,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-6 max-w-3xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                        as: "h2",
                        animationNum: 0,
                        timelineRef: pricingRef,
                        customVariants: revealVariants,
                        className: "md:text-6xl sm:text-4xl text-3xl font-medium text-foreground mb-4",
                        children: [
                            "Plans that work best for your",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                                as: "span",
                                animationNum: 1,
                                timelineRef: pricingRef,
                                customVariants: revealVariants,
                                className: "border border-dashed border-primary px-2 py-1 rounded-xl bg-primary/10 capitalize inline-block",
                                children: "business"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                lineNumber: 354,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 346,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                        as: "p",
                        animationNum: 2,
                        timelineRef: pricingRef,
                        customVariants: revealVariants,
                        className: "sm:text-base text-sm text-muted-foreground sm:w-[70%] w-[80%] mx-auto",
                        children: "We help teams all around the world. Explore which option is right for you."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 365,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                lineNumber: 345,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                as: "div",
                animationNum: 3,
                timelineRef: pricingRef,
                customVariants: revealVariants,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingSwitch, {
                    onSwitch: togglePricingPeriod
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 383,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                lineNumber: 377,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 max-w-5xl gap-6 py-6 mx-auto",
                children: displayPlans.map((plan, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                        as: "div",
                        animationNum: 4 + index,
                        timelineRef: pricingRef,
                        customVariants: revealVariants,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            className: cn("relative h-full transition-all duration-300", plan.popular ? "ring-2 ring-primary bg-primary/5 border-primary/20" : "ring-1 ring-gray-300 dark:ring-gray-700 bg-gray-50/50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-600"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                    className: "text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-semibold text-foreground mb-2",
                                                    children: plan.name
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 10
                                                }, this),
                                                plan.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-primary text-white px-3 py-1 rounded-full text-sm font-medium",
                                                        children: "Popular"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 12
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 404,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground mb-4",
                                            children: plan.description
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 416,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-baseline",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-4xl font-semibold text-foreground",
                                                    children: [
                                                        "$",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedNumber, {
                                                            value: isYearly ? plan.yearlyPrice : plan.price,
                                                            className: "text-4xl font-semibold",
                                                            format: {
                                                                style: "decimal",
                                                                maximumFractionDigits: 0
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                            lineNumber: 422,
                                                            columnNumber: 11
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 10
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground ml-1",
                                                    children: [
                                                        "/",
                                                        isYearly ? "year" : "month"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 419,
                                            columnNumber: 9
                                        }, this),
                                        plan.price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground mt-2",
                                            children: "Per organization • Unlimited users included"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 436,
                                            columnNumber: 10
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                    lineNumber: 403,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                    className: "pt-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 font-semibold py-5 mt-6",
                                            children: plan.features.map((feature, featureIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground grid place-content-center mt-0.5 mr-3",
                                                            children: feature.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                            lineNumber: 446,
                                                            columnNumber: 12
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: feature.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                            lineNumber: 449,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, featureIndex, true, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 11
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 443,
                                            columnNumber: 9
                                        }, this),
                                        plan.includes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 pt-4 border-t border-border",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-medium text-base text-foreground mb-3",
                                                    children: plan.includes[0]
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-2 font-semibold",
                                                    children: plan.includes.slice(1).map((feature, featureIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "h-6 w-6 bg-primary/10 border border-primary rounded-full grid place-content-center mt-0.5 mr-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$544$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__["CheckCheck"], {
                                                                        className: "h-4 w-4 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                                        lineNumber: 465,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 14
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: feature
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 14
                                                                }, this)
                                                            ]
                                                        }, featureIndex, true, {
                                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 13
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                            lineNumber: 457,
                                            columnNumber: 10
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                                    lineNumber: 442,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                            lineNumber: 395,
                            columnNumber: 7
                        }, this)
                    }, plan.name, false, {
                        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                        lineNumber: 388,
                        columnNumber: 6
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                lineNumber: 386,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$timeline$2d$animation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimelineContent"], {
                as: "div",
                animationNum: 6,
                timelineRef: pricingRef,
                customVariants: revealVariants,
                className: "flex justify-center mt-2 mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                    intent: "primary",
                    size: "lg",
                    className: "px-16",
                    onClick: handleGetStarted,
                    children: "Get Started"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                    lineNumber: 489,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
                lineNumber: 482,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/pricing-section.tsx",
        lineNumber: 334,
        columnNumber: 3
    }, this);
}
_s2(PricingSection, "ULk8PoLUvedZr93/te0aCxtZ5Lw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$experimental$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlans"]
    ];
});
_c5 = PricingSection;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardContent");
__turbopack_context__.k.register(_c3, "AnimatedNumber");
__turbopack_context__.k.register(_c4, "PricingSwitch");
__turbopack_context__.k.register(_c5, "PricingSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/glowline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// Color schemes configuration
const COLOR_SCHEMES = {
    purple: {
        core: "via-purple-400",
        glow: [
            "via-purple-400",
            "via-purple-500",
            "via-purple-400",
            "via-purple-300"
        ]
    },
    blue: {
        core: "via-blue-400",
        glow: [
            "via-blue-400",
            "via-blue-500",
            "via-blue-400",
            "via-blue-300"
        ]
    },
    green: {
        core: "via-green-400",
        glow: [
            "via-green-400",
            "via-green-500",
            "via-green-400",
            "via-green-300"
        ]
    },
    red: {
        core: "via-red-400",
        glow: [
            "via-red-400",
            "via-red-500",
            "via-red-400",
            "via-red-300"
        ]
    }
};
const GlowLine = ({ orientation, position, className = "", color })=>{
    const isVertical = orientation === "vertical";
    const containerClasses = isVertical ? "absolute w-px h-full" : "absolute w-full h-px";
    const positionStyle = isVertical ? {
        left: position
    } : {
        top: position
    };
    const gradientDirection = isVertical ? "bg-linear-to-b" : "bg-gradient-to-r";
    const selectedScheme = COLOR_SCHEMES[color];
    const glowLayers = [
        {
            size: isVertical ? "w-1 -ml-0.5" : "h-1 -mt-0.5",
            blur: "blur-sm",
            opacity: "opacity-100",
            color: selectedScheme.glow[0]
        },
        {
            size: isVertical ? "w-2 -ml-1" : "h-2 -mt-1",
            blur: "blur-md",
            opacity: "opacity-80",
            color: selectedScheme.glow[1]
        },
        {
            size: isVertical ? "w-4 -ml-2" : "h-4 -mt-2",
            blur: "blur-lg",
            opacity: "opacity-60",
            color: selectedScheme.glow[2]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${containerClasses} ${className}`,
        style: positionStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 ${gradientDirection} from-transparent ${selectedScheme.core} to-transparent`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/glowline.tsx",
                lineNumber: 91,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 ${isVertical ? "w-0.5 -ml-px" : "h-0.5 -mt-px"} ${gradientDirection} from-transparent via-white to-transparent opacity-60`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/glowline.tsx",
                lineNumber: 94,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0)),
            glowLayers.map((layer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute inset-0 ${layer.size} ${gradientDirection} from-transparent ${layer.color} to-transparent ${layer.blur} ${layer.opacity}`
                }, index, false, {
                    fileName: "[project]/apps/web/src/app/components/glowline.tsx",
                    lineNumber: 98,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/glowline.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = GlowLine;
const __TURBOPACK__default__export__ = GlowLine;
var _c;
__turbopack_context__.k.register(_c, "GlowLine");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/theme-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSwitcher",
    ()=>ThemeSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$intentui$2b$icons$40$1$2e$11$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$intentui$2f$icons$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@intentui+icons@1.11.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@intentui/icons/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeSwitcher({ ...props }) {
    _s();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const toggleTheme = ()=>{
        const nextTheme = resolvedTheme === "light" ? "dark" : "light";
        setTheme(nextTheme);
    };
    // Don't render until theme is resolved to prevent hydration mismatch
    if (!resolvedTheme) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        intent: "outline",
        size: "sq-lg",
        "aria-label": "Switch theme",
        onPress: toggleTheme,
        onClick: toggleTheme,
        ...props,
        children: resolvedTheme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$intentui$2b$icons$40$1$2e$11$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$intentui$2f$icons$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconSun"], {}, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/theme-switcher.tsx",
            lineNumber: 31,
            columnNumber: 33
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$intentui$2b$icons$40$1$2e$11$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$intentui$2f$icons$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconMoon"], {}, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/theme-switcher.tsx",
            lineNumber: 31,
            columnNumber: 47
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/theme-switcher.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
_s(ThemeSwitcher, "ejWDJnui7w93Zr0cEZ1cyBPw8dI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeSwitcher;
var _c;
__turbopack_context__.k.register(_c, "ThemeSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/components/app-navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-macros@3.1.0_reac_b41129a5d0dbb99ff13b71aa74cb05b9/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+clerk-react@5.59.2_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@clerk/clerk-react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_cc03b7a7ac7f93b030781dde6c591287$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.36.5_next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plu_cc03b7a7ac7f93b030781dde6c591287/node_modules/@clerk/nextjs/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$components$2f$glowline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/components/glowline.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/theme-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/styled/styled-button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
// Icon Components
const MenuIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "pointer-events-none",
        width: 16,
        height: 16,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 12L20 12",
                className: "origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                lineNumber: 48,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 12H20",
                className: "origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                lineNumber: 52,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 12H20",
                className: "origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                lineNumber: 56,
                columnNumber: 3
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 36,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c = MenuIcon;
// UI Components
const Logo = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center gap-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/OneTool.png",
            alt: "OneTool Logo",
            width: 180,
            height: 180,
            className: "rounded-md dark:brightness-0 dark:invert"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
            lineNumber: 66,
            columnNumber: 3
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 65,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Logo;
const NavigationMenu = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `relative z-10 ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 79,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
_c2 = NavigationMenu;
const NavigationMenuList = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: `flex items-center ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 84,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
_c3 = NavigationMenuList;
const NavigationMenuItem = ({ children, className = "", ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: `list-none ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 91,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c4 = NavigationMenuItem;
const NavigationMenuLink = ({ href, className = "", children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        scroll: true,
        className: `block px-3 py-2 transition-all duration-300 ${className}`,
        onClick: (e)=>{
            e.preventDefault();
            const targetId = href.replace("#", "");
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 101,
        columnNumber: 2
    }, ("TURBOPACK compile-time value", void 0));
_c5 = NavigationMenuLink;
// Main Glassmorphism Header Component
const navigationLinks = [
    {
        href: "#home",
        label: "Home"
    },
    {
        href: "#features",
        label: "Features"
    },
    {
        href: "#faq",
        label: "FAQ"
    },
    {
        href: "#pricing",
        label: "Pricing"
    }
];
function AppNavBar() {
    _s();
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Logo, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                        lineNumber: 143,
                                        columnNumber: 8
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                    lineNumber: 139,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                lineNumber: 138,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:block",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationMenu, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationMenuList, {
                                        className: "gap-8",
                                        children: navigationLinks.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationMenuItem, {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationMenuLink, {
                                                    href: link.href,
                                                    className: "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium relative group transition-all duration-300",
                                                    children: [
                                                        link.label,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 group-hover:w-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 12
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 11
                                                }, this)
                                            }, index, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 152,
                                                columnNumber: 10
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                        lineNumber: 150,
                                        columnNumber: 8
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                    lineNumber: 149,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                lineNumber: 148,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden sm:flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 170,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_cc03b7a7ac7f93b030781dde6c591287$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignedOut"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignInButton"], {
                                                            mode: "modal",
                                                            forceRedirectUrl: "/home",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                                intent: "outline",
                                                                size: "sm",
                                                                children: "Sign In"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                                lineNumber: 174,
                                                                columnNumber: 11
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 10
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignUpButton"], {
                                                            mode: "modal",
                                                            forceRedirectUrl: "/home",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                                intent: "primary",
                                                                size: "sm",
                                                                children: "Sign Up"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                                lineNumber: 179,
                                                                columnNumber: 11
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 10
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 171,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_cc03b7a7ac7f93b030781dde6c591287$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignedIn"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                    intent: "primary",
                                                    size: "sm",
                                                    onClick: ()=>router.push("/home"),
                                                    children: "Go To Dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 185,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                        lineNumber: 169,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "group text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                                            onClick: ()=>setIsMenuOpen(!isMenuOpen),
                                            "aria-expanded": isMenuOpen,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuIcon, {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 203,
                                                columnNumber: 9
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                            lineNumber: 198,
                                            columnNumber: 8
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                        lineNumber: 197,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                lineNumber: 167,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                        lineNumber: 136,
                        columnNumber: 5
                    }, this),
                    isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-600 mt-2",
                            children: [
                                navigationLinks.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        scroll: true,
                                        className: "block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300",
                                        onClick: (e)=>{
                                            e.preventDefault();
                                            const targetId = link.href.replace("#", "");
                                            const element = document.getElementById(targetId);
                                            if (element) {
                                                element.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start"
                                                });
                                            }
                                            setIsMenuOpen(false); // Close mobile menu after clicking
                                        },
                                        children: link.label
                                    }, index, false, {
                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                        lineNumber: 214,
                                        columnNumber: 9
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-3 py-2 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 237,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                            lineNumber: 236,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_cc03b7a7ac7f93b030781dde6c591287$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignedOut"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignInButton"], {
                                                        mode: "modal",
                                                        forceRedirectUrl: "/home",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                            intent: "outline",
                                                            size: "sm",
                                                            className: "w-full",
                                                            children: "Sign In"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 12
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$59$2e$2_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignUpButton"], {
                                                        mode: "modal",
                                                        forceRedirectUrl: "/home",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                            intent: "primary",
                                                            size: "sm",
                                                            className: "w-full",
                                                            children: "Sign Up"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 12
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 240,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                            lineNumber: 239,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_cc03b7a7ac7f93b030781dde6c591287$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignedIn"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$styled$2f$styled$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StyledButton"], {
                                                intent: "primary",
                                                size: "sm",
                                                className: "w-full",
                                                onClick: ()=>{
                                                    router.push("/home");
                                                    setIsMenuOpen(false);
                                                },
                                                children: "Go To Dashboard"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                                lineNumber: 262,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                            lineNumber: 261,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                                    lineNumber: 235,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                            lineNumber: 212,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                        lineNumber: 211,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                lineNumber: 135,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$components$2f$glowline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                orientation: "horizontal",
                position: "100%",
                color: "blue",
                className: "opacity-80"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
                lineNumber: 281,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/components/app-navbar.tsx",
        lineNumber: 134,
        columnNumber: 3
    }, this);
}
_s(AppNavBar, "6JSzpoM65GqqLejiIU1utyNBe8o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_reac_b41129a5d0dbb99ff13b71aa74cb05b9$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c6 = AppNavBar;
const __TURBOPACK__default__export__ = AppNavBar;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "MenuIcon");
__turbopack_context__.k.register(_c1, "Logo");
__turbopack_context__.k.register(_c2, "NavigationMenu");
__turbopack_context__.k.register(_c3, "NavigationMenuList");
__turbopack_context__.k.register(_c4, "NavigationMenuItem");
__turbopack_context__.k.register(_c5, "NavigationMenuLink");
__turbopack_context__.k.register(_c6, "AppNavBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_64a9cb8b._.js.map