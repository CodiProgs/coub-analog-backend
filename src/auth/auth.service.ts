import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Provider } from '@prisma/client'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { AuthSocialDto } from './dto/auth-social.dto'
import { AuthDto } from './dto/auth.dto'
import { Payload } from './interface'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService
	) {}

	EXPIRE_DAY_REFRESH_TOKEN = 7
	REFRESH_TOKEN_NAME = 'refreshToken'

	async auth(dto: AuthDto) {
		let user = await this.userService.getByEmailAndProvider(dto.email)

		if (!user) user = await this.userService.create(dto)
		else {
			const isValidPassword = await verify(user.password, dto.password)
			if (!isValidPassword)
				throw new BadRequestException({ form: 'Invalid password' })
		}

		const tokens = this.issueTokens(user.id)

		return { ...tokens, user }
	}

	async authSocial(dto: AuthSocialDto, provider: Provider) {
		let user = await this.userService.getByEmailAndProvider(dto.email, provider)

		if (!user) user = await this.userService.createSocial(dto, provider)

		const tokens = this.issueTokens(user.id)

		return { ...tokens, user }
	}

	async getNewTokens(refreshToken: string) {
		let payload: Payload
		try {
			payload = this.jwtService.verify(refreshToken)
		} catch (error) {
			throw new BadRequestException({
				auth: 'Verification failed. Log in again'
			})
		}

		const user = await this.userService.getById(payload.id)
		if (!user)
			throw new BadRequestException({
				auth: 'It seems that something went wrong. Log in again'
			})

		const tokens = this.issueTokens(user.id)

		return tokens
	}

	addRefreshTokenToCookie(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			sameSite: 'none',
			secure: true
		})
	}

	removeRefreshTokenFromCookie(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME)
	}

	private issueTokens(userId: string) {
		const payload: Payload = { id: userId }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: `${this.EXPIRE_DAY_REFRESH_TOKEN}d`
		})

		return { accessToken, refreshToken }
	}
}
