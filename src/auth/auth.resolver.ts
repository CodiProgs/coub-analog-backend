import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { AuthType } from './type/auth.type'
import { AuthDto } from './dto/auth.dto'
import { Request, Response } from 'express'
import { BadRequestException } from '@nestjs/common'

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => AuthType)
	async auth(
		@Args('input') dto: AuthDto,
		@Context() context: { res: Response }
	): Promise<AuthType> {
		const { refreshToken, ...res } = await this.authService.auth(dto)
		this.authService.addRefreshTokenToCookie(context.res, refreshToken)

		return res
	}

	@Mutation(() => Boolean)
	async logout(@Context() context: { res: Response }) {
		this.authService.removeRefreshTokenFromCookie(context.res)
		return true
	}

	@Mutation(() => String)
	async getNewToken(@Context() context: { res: Response; req: Request }) {
		const refreshToken =
			context.req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshToken)
			throw new BadRequestException({
				auth: 'You are not authenticated'
			})
		this.authService.removeRefreshTokenFromCookie(context.res)

		const { accessToken, refreshToken: newRefreshToken } =
			await this.authService.getNewTokens(refreshToken)

		this.authService.addRefreshTokenToCookie(context.res, newRefreshToken)

		return accessToken
	}
}
