import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CoubService } from './coub.service'
import { CoubsType } from './type/coubs.type'
import { CoubType } from './type/coub.type'
import { Auth } from 'src/auth/decorators'
import { CoubDto } from './dto/coub.dto'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { FileService } from 'src/file/file.service'

@Resolver()
export class CoubResolver {
	constructor(
		private coubService: CoubService,
		private fileService: FileService
	) {}

	@Query(() => CoubsType)
	async coubs(
		@Args('skip', { nullable: true }) skip: number,
		@Args('take', { nullable: true }) take: number,
		@Args('queryNumber', { nullable: true }) queryNumber: number
	) {
		return this.coubService.getAll(skip, take, queryNumber)
	}

	@Query(() => CoubType, { nullable: true })
	async coub(@Args('id') id: string) {
		return this.coubService.getById(id)
	}

	@Auth('ADMIN')
	@Mutation(() => CoubType)
	async createCoub(
		@Args('input') dto: CoubDto,
		@Args('video', { type: () => GraphQLUpload }) video: FileUpload
	) {
		const videoUrl = await this.fileService.saveFile(video, 'coubs', 'video')

		return this.coubService.create(dto, videoUrl)
	}

	@Auth('ADMIN')
	@Mutation(() => CoubType)
	async updateCoub(
		@Args('id') id: string,
		@Args('input') dto: CoubDto,
		@Args('video', { type: () => GraphQLUpload, nullable: true })
		video: FileUpload
	) {
		let videoUrl: string | undefined
		if (video) {
			await this.fileService.deleteFile(
				(await this.coubService.getById(id)).url
			)
			videoUrl = await this.fileService.saveFile(video, 'coubs', 'video')
		}

		return this.coubService.update(id, dto, videoUrl)
	}

	@Auth('ADMIN')
	@Mutation(() => CoubType)
	async deleteCoub(@Args('id') id: string) {
		await this.fileService.deleteFile((await this.coubService.getById(id)).url)

		return this.coubService.delete(id)
	}
}
