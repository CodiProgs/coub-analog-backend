import { Injectable } from '@nestjs/common'
import { CommunityService } from 'src/community/community.service'
import { PrismaService } from 'src/prisma.service'
import { CoubsType } from './type/coubs.type'
import { CoubDto } from './dto/coub.dto'

@Injectable()
export class CoubService {
	constructor(
		private prisma: PrismaService,
		private communityService: CommunityService
	) {}

	async getAll(
		skip: number = 0,
		take: number = 10,
		queryNumber: number = 0
		// timePeriod: 'day' | 'week' | 'month' | 'year' | 'all' = 'week',
		// orderBy: 'createdAt' | 'likes' | 'views' = 'views'
	): Promise<CoubsType> {
		// вынести в отдельную функцию типа -> search
		const communities = await this.communityService.getAll()

		const response: CoubsType = {
			skip: take + skip,
			queryNumber: queryNumber,
			take: communities.length - take
		}

		const communitiesSort = communities.slice(skip, skip + take)

		while (communitiesSort.length < 10) {
			response.skip = 10 - communitiesSort.length
			response.take =
				communities.length - (10 - communitiesSort.length) > 10
					? 10
					: communities.length - (10 - communitiesSort.length)

			communitiesSort.push(...communities.slice(0, 10 - communitiesSort.length))
		}

		const coubs = await Promise.all(
			communitiesSort.map(async (community, index) => {
				if ((queryNumber + 1) * communities.length < index + 1) {
					queryNumber += 1
					response.queryNumber += 1
				}
				const coub = await this.prisma.coub.findFirst({
					where: { communityId: community.id },
					orderBy: {
						views: 'desc'
					},
					skip: queryNumber,
					take: 1,
					include: {
						community: true,
						user: true,
						likes: {
							include: {
								user: true
							}
						}
					}
				})
				return coub
			})
		)

		response.coubs = coubs

		return response

		// const array = [
		// 	'1',
		// 	'2',
		// 	'3',
		// 	'4',
		// 	'5',
		// 	'6',
		// 	'7',
		// 	'8',
		// 	'9',
		// 	'10',
		// 	'11',
		// 	'12'
		// ]

		// let returned = {
		// 	skip: take + skip,
		// 	take: array.length - take
		// }

		// const sortedArray = array.slice(skip, skip + take)

		// if (sortedArray.length < 10) {
		// 	returned.skip = 10 - sortedArray.length
		// 	returned.take =
		// 		array.length - (10 - sortedArray.length) > 10
		// 			? 10
		// 			: array.length - (10 - sortedArray.length)

		// 	sortedArray.push(...array.slice(0, 10 - sortedArray.length))
		// }

		//----------------------------------------

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

	async create(dto: CoubDto, videoUrl: string) {
		return this.prisma.coub.create({
			data: {
				...dto,
				url: videoUrl
			}
		})
	}

	async update(id: string, dto: CoubDto, videoUrl?: string) {
		return this.prisma.coub.update({
			where: {
				id
			},
			data: {
				...dto,
				url: videoUrl ? videoUrl : undefined //test this
			}
		})
	}

	async delete(id: string) {
		return this.prisma.coub.delete({
			where: {
				id
			}
		})
	}
}
