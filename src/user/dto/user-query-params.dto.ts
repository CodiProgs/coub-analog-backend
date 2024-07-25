import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { OrderBy } from 'src/common/enums/enums'

@InputType()
export class UserQueryParamsDto {
	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skip?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	take?: number

	@Field(() => OrderBy, { nullable: true })
	@IsOptional()
	@IsEnum(OrderBy)
	orderBy?: OrderBy
}
