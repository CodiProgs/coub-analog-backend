import { Injectable } from '@nestjs/common'
import { CoubQueryParamsDto } from 'src/coub/dto/сoub-query-params.dto'
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

	async getPaginatedCommunities({
		skipCommunities: skip,
		skipCoubs,
		takeCoubs
	}: CoubQueryParamsDto) {
		const communities = (await this.getAll()).filter(
			comm => comm.coubs.length >= skipCoubs
		)

		const communitiesSorted = communities.slice(skip, takeCoubs + skip)

		if (skip !== 0) {
			communitiesSorted.push(
				...communities
					.filter(comm => !communitiesSorted.includes(comm))
					.slice(0, takeCoubs - communitiesSorted.length)
			)
		}

		let newSkip = ((takeCoubs % communities.length) + skip) % communities.length

		if (newSkip === communities.length) {
			skip = 0
			newSkip = 0
		}

		return {
			communities: communitiesSorted,
			queryParams: {
				skipCommunities: newSkip,
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
				avatar: avatarPath || undefined //TODO: check this so that the avatar is not replaced
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
