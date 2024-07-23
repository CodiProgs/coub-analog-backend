import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class UserDto {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	name: string

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	nickname: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	description?: string
}
