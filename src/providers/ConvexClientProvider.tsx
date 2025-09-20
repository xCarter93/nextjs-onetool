"use client";

import { ReactNode } from "react";
import {
	Authenticated,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { env } from "@/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL_DEV);

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<Authenticated>{children}</Authenticated>
			<Unauthenticated>{children}</Unauthenticated>
		</ConvexProviderWithClerk>
	);
}

export { convex };
