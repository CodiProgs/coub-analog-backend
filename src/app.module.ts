import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { LikeModule } from './like/like.module'
import { AuthModule } from './auth/auth.module'
import { CoubModule } from './coub/coub.module'
import { CommunityModule } from './community/community.module'

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			introspection: true,
			playground: true,
			context: ({ req, res }) => ({ req, res })
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads')
		}),
		ConfigModule.forRoot(),
		UserModule,
		LikeModule,
		AuthModule,
		CoubModule,
		CommunityModule
	]
})
export class AppModule {}
