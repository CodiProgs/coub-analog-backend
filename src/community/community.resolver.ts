import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CommunityService } from './community.service'
import { CommunityType } from './type/community.type'
import { Auth } from 'src/auth/decorators'
import { CommunityDto } from './dto/community.dto'

@Resolver()
export class CommunityResolver {
	constructor(private communityService: CommunityService) {}

	@Query(() => [CommunityType])
	async communities(): Promise<CommunityType[]> {
		return this.communityService.getAll()
	}

	@Query(() => CommunityType, { nullable: true })
	@Auth('ADMIN')
	async community(@Args('id') id: string) {
		return this.communityService.getById(id)
	}

	@Mutation(() => CommunityType)
	@Auth('ADMIN')
	async createCommunity(
		@Args('input') dto: CommunityDto
	): Promise<CommunityType> {
		return this.communityService.create(dto)
	}

	@Mutation(() => CommunityType)
	@Auth('ADMIN')
	async updateCommunity(
		@Args('id') id: string,
		@Args('input') dto: CommunityDto
	): Promise<CommunityType> {
		return this.communityService.update(id, dto)
	}

	@Mutation(() => CommunityType)
	@Auth('ADMIN')
	async deleteCommunity(@Args('id') id: string): Promise<CommunityType> {
		return this.communityService.delete(id)
	}
}
