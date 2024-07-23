import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommunityType } from './type/community.type'
import { CommunityDto } from './dto/community.dto'

@Injectable()
export class CommunityService {
	constructor(private prismaService: PrismaService) {}

	async getAll() {
		return this.prismaService.community.findMany()
	}

	async getById(id: string): Promise<CommunityType> {
		return this.prismaService.community.findUnique({
			where: {
				id
			}
		})
	}

	async create(dto: CommunityDto): Promise<CommunityType> {
		return this.prismaService.community.create({
			data: dto
		})
	}

	async update(id: string, dto: CommunityDto): Promise<CommunityType> {
		return this.prismaService.community.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: string): Promise<CommunityType> {
		return this.prismaService.community.delete({
			where: {
				id
			}
		})
	}
}
