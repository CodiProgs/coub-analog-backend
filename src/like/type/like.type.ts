import { Field, ObjectType } from '@nestjs/graphql'
import { CoubType } from 'src/coub/type/coub.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class LikeType {
	@Field() id: string

	@Field(() => UserType) user: UserType

	@Field(() => CoubType) coub: CoubType
}
