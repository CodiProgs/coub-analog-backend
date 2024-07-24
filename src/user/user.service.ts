import { Injectable } from '@nestjs/common'
import { Provider } from '@prisma/client'
import { hash } from 'argon2'
import { AuthSocialDto } from 'src/auth/dto/auth-social.dto'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { v4 } from 'uuid'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getByEmailAndProvider(email: string, provider: Provider = 'LOCAL') {
		return this.prisma.user.findUnique({
			where: { email_provider: { email, provider } }
		})
	}

	async getByNickname(nickname: string) {
		return this.prisma.user.findUnique({
			where: { nickname }
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
	}

	// add search params -> orderBy (createdAt {news, olds}, likes, views, random)
	async getLikes(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				likes: {
					orderBy: {
						coub: {
							createdAt: 'desc'
						}
					},
					include: {
						coub: {
							include: {
								community: true,
								likes: {
									include: {
										user: true
									}
								}
							}
						}
					}
				}
			}
		})

		return user
	}

	async create(dto: AuthDto) {
		const { uuid, name } = this.generateUserData(dto.email)

		return await this.prisma.user.create({
			data: {
				...dto,
				id: uuid,
				nickname: uuid,
				name,
				password: await hash(dto.password)
			}
		})
	}

	async createSocial(dto: AuthSocialDto, provider: Provider) {
		const { uuid, name } = this.generateUserData(dto.email)

		return await this.prisma.user.create({
			data: {
				...dto,
				id: uuid,
				nickname: uuid,
				name,
				provider,
				password: null
			}
		})
	}

	async update(id: string, dto: UserDto) {
		return this.prisma.user.update({
			where: { id },
			data: dto
		})
	}

	async updateEmail(id: string, email: string) {
		return this.prisma.user.update({
			where: { id },
			data: { email }
		})
	}

	async updatePassword(id: string, password: string) {
		return this.prisma.user.update({
			where: { id },
			data: { password: await hash(password) }
		})
	}

	async updateAvatar(id: string, avatar: string) {
		return this.prisma.user.update({
			where: { id },
			data: { avatar }
		})
	}

	async delete(id: string) {
		return this.prisma.user.delete({
			where: { id }
		})
	}

	private generateUserData(email: string): { uuid: string; name: string } {
		const uuid = v4()
		const name = email.split('@')[0]

		return { uuid, name }
	}
}
