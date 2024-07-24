import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserType } from './type/user.type'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { FileService } from 'src/file/file.service'

@Resolver()
export class UserResolver {
	constructor(
		private userService: UserService,
		private fileService: FileService
	) {}

	@Query(() => UserType, { nullable: true })
	async user(@Args('nickname') nickname: string) {
		return this.userService.getByNickname(nickname)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateUser(@CurrentUser('id') id: string, @Args('input') dto: UserDto) {
		return this.userService.update(id, dto)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateEmail(
		@CurrentUser('id') id: string,
		@Args('email') email: string
	) {
		return this.userService.updateEmail(id, email)
	}

	@Auth()
	@Mutation(() => UserType)
	async updatePassword(
		@CurrentUser('id') id: string,
		@Args('password') password: string
	) {
		return this.userService.updatePassword(id, password)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateAvatar(
		@CurrentUser('id') id: string,
		@Args('avatar', { type: () => GraphQLUpload }) avatar: FileUpload
	) {
		const avatarPath = await this.fileService.saveFile(
			avatar,
			'avatars',
			'image'
		)

		return this.userService.updateAvatar(id, avatarPath)
	}

	@Auth()
	@Mutation(() => UserType)
	async deleteUser(@CurrentUser('id') id: string) {
		return this.userService.delete(id)
	}
}
