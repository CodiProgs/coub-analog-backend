import { Args, Query, Resolver } from '@nestjs/graphql'
import { CoubService } from './coub.service'
import { CoubType } from './type/coub.type'

@Resolver()
export class CoubResolver {
	constructor(private coubService: CoubService) {}

	@Query(() => [CoubType], { nullable: 'itemsAndList' })
	async coubs(
		@Args('skip', { nullable: true }) skip: number,
		@Args('take', { nullable: true }) take: number
	) {
		return this.coubService.getAll(skip, take)
	}
}
