import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CommunityService } from './community.service'
import { FileService } from 'src/file/file.service'
import { CommunityType } from './type/community.type'
import { Auth } from 'src/auth/decorators'
import { CommunityDto } from './dto/community.dto'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@Resolver()
export class CommunityResolver {
	constructor(
		private communityService: CommunityService,
		private fileService: FileService
	) {}

	@Query(() => [CommunityType])
	async communities() {
		return this.communityService.getAll()
	}

	@Auth('ADMIN')
	@Query(() => CommunityType)
	async community(id: string) {
		return this.communityService.getById(id)
	}

	@Auth('ADMIN')
	@Mutation(() => CommunityType)
	async createCommunity(
		@Args('input') dto: CommunityDto,
		@Args('avatar', { type: () => GraphQLUpload }) avatar: FileUpload
	) {
		const avatarPath = await this.fileService.saveFile(
			avatar,
			'communities',
			'image'
		)
		return this.communityService.create(dto, avatarPath)
	}

	@Auth('ADMIN')
	@Mutation(() => CommunityType)
	async updateCommunity(
		@Args('id') id: string,
		@Args('input') dto: CommunityDto,
		@Args('avatar', { type: () => GraphQLUpload, nullable: true })
		avatar: FileUpload
	) {
		let avatarPath: string | undefined
		if (avatar) {
			await this.fileService.deleteFile(
				(await this.communityService.getById(id)).avatar
			)
			avatarPath = await this.fileService.saveFile(
				avatar,
				'communities',
				'image'
			)
		}

		return this.communityService.update(id, dto, avatarPath)
	}

	@Auth('ADMIN')
	@Mutation(() => CommunityType)
	async deleteCommunity(@Args('id') id: string) {
		await this.fileService.deleteFile(
			(await this.communityService.getById(id)).avatar
		)
		return this.communityService.delete(id)
	}
}
