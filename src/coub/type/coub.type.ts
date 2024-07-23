import { Field, ObjectType } from '@nestjs/graphql'
import { CommunityType } from 'src/community/type/community.type'
import { LikeType } from 'src/like/type/like.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class CoubType {
	@Field() id: string

	@Field() title: string

	@Field() url: string

	@Field() views: number

	@Field(() => CommunityType) community: CommunityType

	@Field(() => UserType) user: UserType

	@Field(() => [LikeType], { nullable: true }) likes?: LikeType[]
}
