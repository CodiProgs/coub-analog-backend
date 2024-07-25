import { Field, ObjectType } from '@nestjs/graphql'
import { CoubType } from './coub.type'

@ObjectType()
export class CoubResponseType {
	@Field() skip: number

	@Field() take: number

	@Field() queryNumber: number

	@Field(() => [CoubType], { nullable: 'itemsAndList' }) coubs?: CoubType[]
}
