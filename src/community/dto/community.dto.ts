import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CommunityDto {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	name: string
}
