import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { Auth } from 'src/auth/decorators'
import { FileService } from 'src/file/file.service'
import { CoubService } from './coub.service'
import { CoubDto } from './dto/coub.dto'
import { CoubQueryParamsDto } from './dto/сoub-query-params.dto'
import { CoubResponseType } from './type/coub-response.type'
import { CoubType } from './type/coub.type'

@Resolver()
export class CoubResolver {
	constructor(
		private coubService: CoubService,
		private fileService: FileService
	) {}

	@Query(() => CoubResponseType)
	async coubs(@Args('queryParams') dto: CoubQueryParamsDto) {
		return this.coubService.getAll(dto)
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
