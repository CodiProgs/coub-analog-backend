import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommunityDto } from './dto/community.dto'

@Injectable()
export class CommunityService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.community.findMany({
			orderBy: {
				name: 'asc'
			},
			include: {
				coubs: true
			}
		})
	}

	async getById(id: string) {
		return this.prisma.community.findUnique({
			where: {
				id
			}
		})
	}

	// add dto CoubQueryParamsDto
	async getPaginatedCommunities(skip: number, take: number, skipCoubs: number) {
		const communities = await this.getAll()
		const communitiesSorted = communities
			.filter(comm => comm.coubs.length > skipCoubs)
			.slice(skip, skip + take)

		if (communitiesSorted.length < communities.length) {
			skip = communities.length - communitiesSorted.length
			take = communities.length - skip

			communitiesSorted.push(
				...communities
					.slice(0, 10 - communitiesSorted.length)
					.filter(comm => !communitiesSorted.includes(comm))
					.filter(comm => comm.coubs.length > 0)
			)
		} else {
			skip = take
			take = communities.length - take
		}

		return {
			communities: communitiesSorted,
			queryParams: {
				skipCommunities: skip,
				takeCommunities: take,
				skipCoubs
			}
		}
	}

	async create(dto: CommunityDto, avatarPath: string) {
		return this.prisma.community.create({
			data: {
				...dto,
				avatar: avatarPath
			}
		})
	}

	async update(
		id: string,
		dto: Omit<CommunityDto, 'avatar'>,
		avatarPath?: string
	) {
		return this.prisma.community.update({
			where: {
				id
			},
			data: {
				...dto,
				avatar: avatarPath || undefined // check this so that the avatar is not replaced
			}
		})
	}

	async delete(id: string) {
		return this.prisma.community.delete({
			where: {
				id
			}
		})
	}
}
