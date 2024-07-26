import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CoubQueryParamsType {
	@Field()
	skipCommunities: number

	@Field()
	skipCoubs: number
}
