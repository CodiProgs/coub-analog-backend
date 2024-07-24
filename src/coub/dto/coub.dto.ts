import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class CoubDto {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	title: string

	@Field()
	@IsNotEmpty()
	@IsString()
	communityId: string

	@Field()
	@IsNotEmpty()
	@IsString()
	userId: string
}
