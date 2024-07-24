import { Injectable } from '@nestjs/common'
import { CommunityService } from 'src/community/community.service'
import { PrismaService } from 'src/prisma.service'
import { CoubType } from './type/coub.type'

@Injectable()
export class CoubService {
	constructor(
		private prisma: PrismaService,
		private communityService: CommunityService
	) {}

	async getAll(skip: number = 0, take: number = 10) {
		// : Promise<CoubType[]>
		const array = [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'11',
			'12'
		]

		let returned = {
			skip: take + skip,
			take: array.length - take
		}

		const sortedArray = array.slice(skip, skip + take)

		if (sortedArray.length < 10) {
			returned.skip = 10 - sortedArray.length
			returned.take =
				array.length - (10 - sortedArray.length) > 10
					? 10
					: array.length - (10 - sortedArray.length)

			sortedArray.push(...array.slice(0, 10 - sortedArray.length))
		}

		// const communities = (await this.communityService.getAll()).slice(

		// )

		// const coubs = await Promise.all(
		// 	communities.map(async community => {
		// 		const coub = await this.prisma.coub.findFirst({
		// 			where: { communityId: community.id },
		// 			orderBy: {
		// 				views: 'desc'
		// 			},
		// 			include: {
		// 				community: true,
		// 				user: true,
		// 				likes: {
		// 					include: {
		// 						user: true
		// 					}
		// 				}
		// 			}
		// 		})
		// 		return coub
		// 	})
		// )

		// return coubs

		// -------

		// orderBy: 'createdAt' | 'likes' | 'views' = 'createdAt'
		// получить все категории кубов
		// const categories = await this.prisma.category.findMany()
		// const mostViewedVideos = await Promise.all(
		// 	categories.map(async category => {
		// 		const videos = await this.prisma.video.findMany({
		// 			where: { categoryId: category.id },
		// 			orderBy: { views: 'desc' },
		// 			take: 1
		// 		})
		// 		return videos[0]
		// 	})
		// )
		// return mostViewedVideos
		// ---
		//  const mostViewedVideos = await Promise.all(
		// 		categories.map(async category => {
		// 			const videos = await this.prisma.video.findMany({
		// 				where: { categoryId: category.id },
		// 				orderBy: { views: 'desc' },
		// 				skip: page - 1,
		// 				take: 1
		// 			})
		// 			return videos[0]
		// 		})
		// 	)
	}

	async getById(id: string) {
		return this.prisma.coub.findUnique({
			where: {
				id
			}
		})
	}
}
