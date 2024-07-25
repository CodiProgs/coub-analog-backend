import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { OrderBy, TimePeriod } from 'src/common/enums/enums'

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
	skipCoub?: number

	@Field(() => TimePeriod, { nullable: true })
	@IsOptional()
	@IsEnum(TimePeriod)
	timePeriod?: TimePeriod

	@Field(() => OrderBy, { nullable: true })
	@IsOptional()
	@IsEnum(OrderBy)
	orderBy?: OrderBy
}
