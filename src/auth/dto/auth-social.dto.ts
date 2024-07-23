import { Field, OmitType } from '@nestjs/graphql'
import { AuthDto } from './auth.dto'
import { IsOptional, IsString } from 'class-validator'

export class AuthSocialDto extends OmitType(AuthDto, ['password'] as const) {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	avatar?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	description?: string
}
