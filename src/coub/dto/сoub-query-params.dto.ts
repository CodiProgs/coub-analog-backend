import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional } from 'class-validator'

@InputType()
export class CoubQueryParamsDto {
	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skipCommunities?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	takeCommunities?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skipCoubs?: number
}
