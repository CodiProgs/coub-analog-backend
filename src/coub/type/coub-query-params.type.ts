import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CoubQueryParamsType {
	@Field()
	skipCommunities: number

	@Field()
	takeCommunities: number

	@Field()
	skipCoubs: number
}
