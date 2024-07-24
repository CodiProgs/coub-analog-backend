import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LikeService {
	constructor(private prisma: PrismaService) {}

	async toggle(coubId: string, userId: string) {
		const like = await this.prisma.like.findUnique({
			where: {
				userId_coubId: {
					coubId,
					userId
				}
			}
		})

		if (like) {
			await this.prisma.like.delete({
				where: {
					userId_coubId: {
						coubId,
						userId
					}
				}
			})
		} else {
			await this.prisma.like.create({
				data: {
					coubId,
					userId
				}
			})
		}

		return true
	}
}
