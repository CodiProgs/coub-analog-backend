import { Module } from '@nestjs/common'
import { CommunityService } from './community.service'
import { CommunityResolver } from './community.resolver'
import { PrismaService } from 'src/prisma.service'
import { FileModule } from 'src/file/file.module'

@Module({
	imports: [FileModule],
	providers: [CommunityService, CommunityResolver, PrismaService],
	exports: [CommunityService]
})
export class CommunityModule {}
