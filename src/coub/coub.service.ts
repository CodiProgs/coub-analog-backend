import { Injectable } from '@nestjs/common'
import { subDays } from 'date-fns'
import { TIME_PERIODS_IN_DAYS } from 'src/common/constants/constants'
import { OrderBy, TimePeriod } from 'src/common/enums/enums'
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

	async getAll({
		skipCommunities,
		skipCoubs,
		takeCoubs,
		orderBy,
		timePeriod
	}: CoubQueryParamsDto): Promise<CoubResponseType> {
		const { communities, queryParams } =
			await this.communityService.getPaginatedCommunities({
				skipCommunities,
				skipCoubs,
				takeCoubs
			})

		const coubs: CoubType[] = []
		let index = 0
		let totalAttempts = 0

		while (coubs.length < takeCoubs) {
			const coub = await this.prisma.coub.findFirst({
				where: {
					communityId: communities[index].id,
					createdAt: {
						gte:
							timePeriod === TimePeriod.ALL
								? undefined
								: subDays(new Date(), TIME_PERIODS_IN_DAYS[timePeriod])
					}
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
				// TODO: вынести в функцию?
				orderBy: {
					views: orderBy === OrderBy.VIEWS ? 'desc' : undefined,
					createdAt:
						orderBy === OrderBy.News
							? 'asc'
							: orderBy === OrderBy.Olds
								? 'desc'
								: undefined,
					likes: orderBy === OrderBy.LIKES ? { _count: 'desc' } : undefined
				}
			})

			if (coub) {
				coubs.push(coub)
				totalAttempts = 0
			} else totalAttempts++

			if (totalAttempts >= communities.length) break

			index++
			if (index === communities.length - skipCommunities) {
				queryParams.skipCoubs++
			}
			if (index === communities.length) {
				index = 0
			}
		}

		return {
			coubs,
			queryParams
		}
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
				url: videoUrl ? videoUrl : undefined //TODO: test this
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
