import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { LikeService } from './like.service'
import { Auth, CurrentUser } from 'src/auth/decorators'

@Resolver()
export class LikeResolver {
	constructor(private likeService: LikeService) {}

	@Auth()
	@Mutation(() => Boolean)
	async toggleLike(
		@Args('coubId') coubId: string,
		@CurrentUser('id') userId: string
	) {
		return this.likeService.toggle(coubId, userId)
	}
}
