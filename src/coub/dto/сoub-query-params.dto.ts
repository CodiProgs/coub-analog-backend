import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { OrderBy, TimePeriod } from 'src/common/enums/enums'

@InputType()
export class CoubQueryParamsDto {
	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skipCommunities?: number = 0

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skipCoubs?: number = 0

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	takeCoubs: number = 10

	@Field(() => OrderBy, { nullable: true })
	@IsOptional()
	@IsEnum(OrderBy)
	orderBy?: OrderBy = OrderBy.VIEWS

	@Field(() => TimePeriod, { nullable: true })
	@IsOptional()
	@IsEnum(TimePeriod)
	timePeriod?: TimePeriod = TimePeriod.WEEK
}
