import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/hooks/use-toast";
import { ConfirmDialogProvider } from "@/hooks/use-confirm-dialog";
import { DynamicTitle } from "@/components/shared/dynamic-title";
import "./globals.css";
import { env } from "@/env";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "OneTool",
	description: "All-in-one business management platform for modern teams",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={`${outfit.className} antialiased`}>
				<ClerkProvider
					publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
					afterSignOutUrl="/"
					appearance={{
						cssLayerName: "clerk",
					}}
				>
					<PostHogProvider>
						<ConvexClientProvider>
							<ThemeProvider>
								<DynamicTitle />
								<ToastProvider position="top-right" maxToasts={5}>
									<ConfirmDialogProvider>{children}</ConfirmDialogProvider>
								</ToastProvider>
							</ThemeProvider>
						</ConvexClientProvider>
					</PostHogProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
