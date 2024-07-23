import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthSocialDto } from '../dto/auth-social.dto'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(configService: ConfigService) {
		super({
			clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
			callbackURL: `${configService.get<string>('SERVER_URL')}/auth/google/callback`,
			scope: ['email', 'profile']
		})
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile
	): Promise<AuthSocialDto> {
		const { emails, photos } = profile

		return {
			email: emails[0].value,
			avatar: photos[0].value
		}
	}
}
