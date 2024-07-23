import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CommunityType {
	@Field() id: string

	@Field() name: string

	@Field() avatar: string
}
