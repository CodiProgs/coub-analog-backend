import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { PrismaService } from 'src/prisma.service'
import { FileModule } from 'src/file/file.module'

@Module({
	imports: [FileModule],
	providers: [UserService, UserResolver, PrismaService],
	exports: [UserService]
})
export class UserModule {}
