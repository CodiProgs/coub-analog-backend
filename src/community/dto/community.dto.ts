import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class CommunityDto {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	name: string

	@Field()
	@IsOptional()
	@IsString()
	avatar: string
}
