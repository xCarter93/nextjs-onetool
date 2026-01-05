"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import GlowLine from "@/app/components/glowline";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { StyledButton } from "@/components/ui/styled/styled-button";

// Type definitions for Navigation components
interface NavigationMenuProps {
	children: React.ReactNode;
	className?: string;
}

interface NavigationMenuListProps {
	children: React.ReactNode;
	className?: string;
}

interface NavigationMenuItemProps {
	children: React.ReactNode;
	className?: string;
	key?: number;
}

interface NavigationMenuLinkProps {
	href: string;
	className?: string;
	children: React.ReactNode;
}

// Icon Components
const MenuIcon: React.FC = () => (
	<svg
		className="pointer-events-none"
		width={16}
		height={16}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 12L20 12"
			className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
		/>
		<path
			d="M4 12H20"
			className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
		/>
		<path
			d="M4 12H20"
			className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
		/>
	</svg>
);

// UI Components
const Logo: React.FC = () => (
	<div className="flex items-center justify-center gap-3">
		<Image
			src="/OneTool.png"
			alt="OneTool Logo"
			width={140}
			height={140}
			className="rounded-md dark:brightness-0 dark:invert sm:w-[180px]"
		/>
	</div>
);

const NavigationMenu: React.FC<NavigationMenuProps> = ({
	children,
	className = "",
}) => <nav className={`relative z-10 ${className}`}>{children}</nav>;

const NavigationMenuList: React.FC<NavigationMenuListProps> = ({
	children,
	className = "",
}) => <ul className={`flex items-center ${className}`}>{children}</ul>;

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
	children,
	className = "",
	...props
}) => (
	<li className={`list-none ${className}`} {...props}>
		{children}
	</li>
);

const NavigationMenuLink: React.FC<NavigationMenuLinkProps> = ({
	href,
	className = "",
	children,
}) => (
	<Link
		href={href}
		scroll={true}
		className={`block px-3 py-2 transition-all duration-300 ${className}`}
		onClick={(e) => {
			e.preventDefault();
			const targetId = href.replace("#", "");
			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}}
	>
		{children}
	</Link>
);

// Main Glassmorphism Header Component
const navigationLinks = [
	{ href: "#home", label: "Home" },
	{ href: "#features", label: "Features" },
	{ href: "#faq", label: "FAQ" },
	{ href: "#pricing", label: "Pricing" },
];

function AppNavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

	return (
		<header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="shrink-0">
						<a
							href="#"
							className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
						>
							<Logo />
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<NavigationMenu>
							<NavigationMenuList className="gap-8">
								{navigationLinks.map((link, index) => (
									<NavigationMenuItem key={index}>
										<NavigationMenuLink
											href={link.href}
											className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium relative group transition-all duration-300"
										>
											{link.label}
											<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Right side - Authentication */}
					<div className="flex items-center gap-4">
						{/* Clerk Authentication Buttons */}
						<div className="hidden sm:flex items-center gap-3">
							<ThemeSwitcher />
							<SignedOut>
								<div className="flex items-center gap-3">
									<SignInButton mode="modal" forceRedirectUrl="/home">
										<StyledButton intent="outline" size="sm">
											Sign In
										</StyledButton>
									</SignInButton>
									<SignUpButton mode="modal" forceRedirectUrl="/home">
										<StyledButton intent="primary" size="sm">
											Sign Up
										</StyledButton>
									</SignUpButton>
								</div>
							</SignedOut>
							<SignedIn>
								<StyledButton
									intent="primary"
									size="sm"
									onClick={() => router.push("/home")}
								>
									Go To Dashboard
								</StyledButton>
							</SignedIn>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								className="group text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								aria-expanded={isMenuOpen}
							>
								<MenuIcon />
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden absolute left-0 right-0 top-full">
						<div className="mx-4 mt-2 px-3 pt-3 pb-4 space-y-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg">
							{navigationLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									scroll={true}
									className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 active:bg-gray-200 dark:active:bg-gray-600"
									onClick={(e) => {
										e.preventDefault();
										const targetId = link.href.replace("#", "");
										const element = document.getElementById(targetId);
										if (element) {
											element.scrollIntoView({
												behavior: "smooth",
												block: "start",
											});
										}
										setIsMenuOpen(false); // Close mobile menu after clicking
									}}
								>
									{link.label}
								</Link>
							))}
							<div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
								<SignedOut>
									<div className="flex items-center justify-center gap-2">
										<ThemeSwitcher />
										<SignInButton mode="modal" forceRedirectUrl="/home">
											<StyledButton
												intent="outline"
												size="sm"
											>
												Sign In
											</StyledButton>
										</SignInButton>
										<SignUpButton mode="modal" forceRedirectUrl="/home">
											<StyledButton
												intent="primary"
												size="sm"
											>
												Sign Up
											</StyledButton>
										</SignUpButton>
									</div>
								</SignedOut>
								<SignedIn>
									<div className="flex items-center justify-center gap-2">
										<ThemeSwitcher />
										<StyledButton
											intent="primary"
											size="sm"
											onClick={() => {
												router.push("/home");
												setIsMenuOpen(false);
											}}
										>
											Go To Dashboard
										</StyledButton>
									</div>
								</SignedIn>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Blue glowline at bottom - spans full width */}
			<GlowLine
				orientation="horizontal"
				position="100%"
				color="blue"
				className="opacity-80"
			/>
		</header>
	);
}

export default AppNavBar;
