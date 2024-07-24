import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { CommunityModule } from './community/community.module';
import { CoubModule } from './coub/coub.module';
import { LikeModule } from './like/like.module';

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
		AuthModule,
		FileModule,
		CommunityModule,
		CoubModule,
		LikeModule
	]
})
export class AppModule {}
