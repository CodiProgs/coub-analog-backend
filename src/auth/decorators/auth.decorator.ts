import { UseGuards } from '@nestjs/common'
import { AdminRoleGuard, JwtAuthGuard } from '../guards'
import { UserRole } from '@prisma/client'

/**
 * A decorator that applies authentication and authorization guards based on the user's role.
 * It leverages NestJS's `UseGuards` to attach the appropriate guards.
 *
 * By default, it applies the `JwtAuthGuard` for basic authentication. If the role is 'ADMIN',
 * it additionally applies the `AdminRoleGuard` to enforce administrative access control.
 *
 * @param {UserRole} role - The role of the user, defaults to 'USER'. Based on the role, different guards are applied.
 *
 * @returns {Function} A decorator function that uses `UseGuards` to apply the specified guards.
 */
export const Auth = (role: UserRole = 'USER') => {
	switch (role) {
		case 'ADMIN':
			return UseGuards(JwtAuthGuard, AdminRoleGuard)
		default:
			return UseGuards(JwtAuthGuard)
	}
}
