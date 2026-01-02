// Typed hooks for Next.js app router navigation helpers.
declare module "next/navigation" {
	import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

	export function useRouter(): AppRouterInstance;
	export function useSearchParams(): URLSearchParams;
	export function useParams<T = Record<string, string | string[]>>(): T;
	export function usePathname(): string;
}
