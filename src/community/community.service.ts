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
				avatar: avatarPath || undefined
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
