import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class AuthDto {
	@Field()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Invalid email' })
	email: string

	@Field()
	@IsNotEmpty()
	@IsString()
	password: string
}
