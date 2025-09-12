"use client";

import { IconMoon, IconSun } from "@intentui/icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher({
	...props
}: React.ComponentProps<typeof Button>) {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		const nextTheme = resolvedTheme === "light" ? "dark" : "light";
		setTheme(nextTheme);
	};

	// Don't render until theme is resolved to prevent hydration mismatch
	if (!resolvedTheme) {
		return null;
	}

	return (
		<Button
			intent="outline"
			size="sq-sm"
			aria-label="Switch theme"
			onPress={toggleTheme}
			onClick={toggleTheme}
			{...props}
		>
			{resolvedTheme === "light" ? <IconSun /> : <IconMoon />}
		</Button>
	);
}
