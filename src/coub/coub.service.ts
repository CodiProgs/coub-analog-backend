import { Injectable } from '@nestjs/common'
import { CommunityService } from 'src/community/community.service'
import { PrismaService } from 'src/prisma.service'
import { CoubDto } from './dto/coub.dto'
import { CoubQueryParamsDto } from './dto/сoub-query-params.dto'
import { CoubResponseType } from './type/coub-response.type'
import { CoubType } from './type/coub.type'

@Injectable()
export class CoubService {
	constructor(
		private prisma: PrismaService,
		private communityService: CommunityService
	) {}

	// add orderBy and timePeriod
	// mb remove takeCommunities?
	async getAll({
		skipCommunities = 0,
		takeCommunities = 10,
		skipCoubs = 0
	}: CoubQueryParamsDto): Promise<CoubResponseType> {
		const { communities, queryParams } =
			await this.communityService.getPaginatedCommunities(
				skipCommunities,
				takeCommunities,
				skipCoubs
			)

		const coubs: CoubType[] = []
		let index = 0
		let totalAttempts = 0

		while (coubs.length < 10) {
			const coub = await this.prisma.coub.findFirst({
				where: {
					communityId: communities[index].id
				},
				include: {
					community: true,
					user: true,
					likes: {
						include: {
							user: true
						}
					}
				},
				skip: queryParams.skipCoubs,
				orderBy: {
					views: 'desc'
				}
			})

			if (coub) {
				coubs.push(coub)
				totalAttempts = 0
			} else totalAttempts++
			queryParams.skipCommunities += 1
			if (totalAttempts >= communities.length) break

			index++
			if (index === takeCommunities - 1) {
				queryParams.skipCoubs++
				// queryParams.skipCommunities = 0
			}
			if (index === communities.length) {
				index = 0
				if (takeCommunities === 10) queryParams.skipCoubs++
				queryParams.skipCommunities = 0
			}
		}

		queryParams.skipCommunities =
			communities.length - queryParams.takeCommunities > 0
				? 0
				: queryParams.skipCommunities
		queryParams.takeCommunities =
			communities.length - queryParams.skipCommunities

		return {
			coubs,
			queryParams
		}

		// const response: CoubResponseType = {
		// 	skip: skip + take,
		// 	queryNumber,
		// 	take: Math.min(communities.length - skip, take)
		// }

		// const communitiesSort = communities.slice(skip, skip + take)

		// while (communitiesSort.length < 10) {
		// 	response.skip = 10 - communitiesSort.length
		// 	response.take =
		// 		communities.length - (10 - communitiesSort.length) > 10
		// 			? 10
		// 			: communities.length - (10 - communitiesSort.length)

		// 	communitiesSort.push(...communities.slice(0, 10 - communitiesSort.length))
		// }

		//----

		// if (communitiesSort.length < 10) {
		// 	const remaining = 10 - communitiesSort.length
		// 	response.skip += remaining
		// 	response.take = Math.min(communities.length - response.skip, 10)
		// 	communitiesSort.push(...communities.slice(0, remaining))
		// }

		// можно делать promise не по массиву communitiesSort, а по -> while (coubs.length < 10)
		// const coubs = await Promise.all(
		// 	communitiesSort.map(async (community, index) => {
		// 		if ((response.queryNumber + 1) * communities.length < index + 1)
		// 			response.queryNumber += 1

		// 		return this.prisma.coub.findFirst({
		// 			where: {
		// 				communityId: community.id,
		// 				createdAt: {
		// 					gte:
		// 						timePeriod === TimePeriod.ALL
		// 							? undefined
		// 							: subDays(new Date(), timePeriods[timePeriod])
		// 				}
		// 			},
		// 			include: {
		// 				community: true,
		// 				user: true,
		// 				likes: {
		// 					include: {
		// 						user: true
		// 					}
		// 				}
		// 			},
		// 			skip: response.queryNumber,
		// 			take: 1,
		// 			orderBy: {
		// 				views: orderBy === OrderBy.VIEWS ? 'desc' : undefined,
		// 				createdAt: orderBy === OrderBy.CREATED_AT ? 'desc' : undefined,
		// 				likes: orderBy === OrderBy.LIKES ? { _count: 'desc' } : undefined
		// 			}
		// 		})
		// 	})
		// )

		// coubs.filter((coub) => coub !== null)
		// response.coubs = coubs

		// return response
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
