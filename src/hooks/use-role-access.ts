"use client";

import { useAuth } from "@clerk/nextjs";

export interface RoleAccess {
	isAdmin: boolean;
	isMember: boolean;
	role: string | null;
	isLoading: boolean;
}

/**
 * Hook to check user's role in their organization
 *
 * Admin is defined as any role containing "admin" (case-insensitive)
 * Member is defined as any role not containing "admin" or no role set
 */
export function useRoleAccess(): RoleAccess {
	const { orgRole, isLoaded } = useAuth();

	// Check if user is an admin
	// orgRole comes from Clerk and will be something like "org:admin" or "org:member"
	const isAdmin = orgRole ? orgRole.toLowerCase().includes("admin") : false;

	// Check if user is a member (non-admin)
	// If no role is set, treat as member for safety
	const isMember = !isAdmin;

	return {
		isAdmin,
		isMember,
		role: orgRole ?? null,
		isLoading: !isLoaded,
	};
}

/**
 * Hook to check if user is an admin
 */
export function useIsAdmin(): boolean {
	const { isAdmin } = useRoleAccess();
	return isAdmin;
}

/**
 * Hook to check if user is a member
 */
export function useIsMember(): boolean {
	const { isMember } = useRoleAccess();
	return isMember;
}

