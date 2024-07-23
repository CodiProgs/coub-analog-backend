import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { GoogleAuthGuard } from './guards'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private configService: ConfigService
	) {}

	@Get('google')
	@UseGuards(GoogleAuthGuard)
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(GoogleAuthGuard)
	async googleAuthRedirect(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const { user, accessToken, refreshToken } =
			await this.authService.authSocial(req.user, 'GOOGLE')

		this.authService.addRefreshTokenToCookie(res, refreshToken)

		return res.redirect(
			`${this.configService.get('FRONTEND_URL')}/auth/google/success?accessToken=${accessToken}&userId=${user.id}`
		)
	}
}
