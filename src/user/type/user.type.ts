import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Provider, UserRole } from '@prisma/client'
import { CoubType } from 'src/coub/type/coub.type'
import { LikeType } from 'src/like/type/like.type'

@ObjectType()
export class UserType {
	@Field() id: string

	@Field() nickname: string

	@Field() name: string

	@Field() email: string

	@Field({ nullable: true }) description?: string

	@Field() avatar: string

	@Field(() => UserRole) role: UserRole

	@Field(() => [CoubType], { nullable: true }) coubs?: CoubType[]

	@Field(() => [LikeType], { nullable: true }) likes?: LikeType[]
}

registerEnumType(UserRole, {
	name: 'UserRole'
})

registerEnumType(Provider, {
	name: 'Provider'
})
