import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { User, UserRole } from '@prisma/client'

@Injectable()
export class AdminRoleGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest<{ user: User }>()
		const user = req.user

		if (user.role !== UserRole.ADMIN)
			throw new ForbiddenException('You don`t have enough rights')

		return true
	}
}
