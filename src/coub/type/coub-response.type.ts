import { Field, ObjectType } from '@nestjs/graphql'
import { CoubType } from './coub.type'

@ObjectType()
export class CoubResponseType {
	@Field() skipCommunities: number

	@Field() takeCommunities: number

	@Field() skipCoub: number

	@Field(() => [CoubType], { nullable: 'itemsAndList' }) coubs?: CoubType[]
}
