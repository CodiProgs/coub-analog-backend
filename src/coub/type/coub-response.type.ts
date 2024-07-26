import { Field, ObjectType } from '@nestjs/graphql'
import { CoubQueryParamsType } from './coub-query-params.type'
import { CoubType } from './coub.type'

@ObjectType()
export class CoubResponseType {
	@Field(() => CoubQueryParamsType) queryParams: CoubQueryParamsType

	@Field(() => [CoubType], { nullable: 'itemsAndList' }) coubs?: CoubType[]
}
