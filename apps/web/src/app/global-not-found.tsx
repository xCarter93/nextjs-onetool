import "./globals.css";
import type { Metadata } from "next";
import NotFoundAnimated from "@/components/not-found-animated";

export const metadata: Metadata = {
	title: "404 - Page Not Found | OneTool",
	description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
	return (
		<html lang="en">
			<body>
				<NotFoundAnimated />
			</body>
		</html>
	);
}
