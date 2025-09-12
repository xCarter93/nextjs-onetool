"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import GlowLine from "@/components/glowline";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Type definitions
interface ButtonProps {
	asChild?: boolean;
	className?: string;
	variant?: "default" | "ghost" | "glass";
	size?: "default" | "sm" | "icon";
	children?: React.ReactNode;
	onClick?: () => void;
}

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
			width={180}
			height={180}
			className="rounded-md dark:brightness-0 dark:invert"
		/>
	</div>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			asChild = false,
			className = "",
			variant = "default",
			size = "default",
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? "span" : "button";
		const baseClasses =
			"inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm";

		const variantClasses: Record<string, string> = {
			default:
				"bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-900 border border-gray-800 dark:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:border-gray-700 dark:hover:border-gray-400 shadow-lg hover:shadow-xl",
			ghost:
				"hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm",
			glass:
				"bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 shadow-2xl hover:shadow-3xl backdrop-blur-md",
		};

		const sizeClasses: Record<string, string> = {
			default: "h-10 px-4 py-2",
			sm: "h-9 rounded-lg px-3",
			icon: "h-10 w-10",
		};

		const elementProps = props as React.HTMLAttributes<HTMLElement>;
		return (
			<Comp
				className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
				ref={ref}
				{...elementProps}
			>
				{children}
			</Comp>
		);
	}
);
Button.displayName = "Button";

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
	{ href: "#pricing", label: "Pricing" },
];

function AppNavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
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
							<SignInButton mode="modal" forceRedirectUrl="/home">
								<Button variant="ghost" size="sm">
									Sign In
								</Button>
							</SignInButton>
							<SignUpButton mode="modal" forceRedirectUrl="/home">
								<Button variant="glass" size="sm">
									Sign Up
								</Button>
							</SignUpButton>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<Button
								variant="ghost"
								size="icon"
								className="group text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								aria-expanded={isMenuOpen}
							>
								<MenuIcon />
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-600 mt-2">
							{navigationLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									scroll={true}
									className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
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
							<div className="px-3 py-2 space-y-2">
								<div className="flex justify-center mb-2">
									<ThemeSwitcher />
								</div>
								<SignInButton mode="modal">
									<Button variant="ghost" size="sm" className="w-full">
										Sign In
									</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button variant="glass" size="sm" className="w-full">
										Sign Up
									</Button>
								</SignUpButton>
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
