import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CoubDto {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	title: string

	@Field()
	@IsNotEmpty()
	@Field()
	@IsNotEmpty()
	@IsString()
	communityId: string
}
