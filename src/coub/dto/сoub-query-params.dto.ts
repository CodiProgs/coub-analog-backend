import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { OrderBy, TimePeriod } from 'src/common/enums/enums'

@InputType()
export class CoubQueryParamsDto {
	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skip?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	take?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	queryNumber?: number

	@Field(() => TimePeriod, { nullable: true })
	@IsOptional()
	@IsEnum(TimePeriod)
	timePeriod?: TimePeriod

	@Field(() => OrderBy, { nullable: true })
	@IsOptional()
	@IsEnum(OrderBy)
	orderBy?: OrderBy
}
