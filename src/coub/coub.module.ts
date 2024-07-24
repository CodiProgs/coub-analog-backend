import { Module } from '@nestjs/common'
import { CoubService } from './coub.service'
import { CoubResolver } from './coub.resolver'
import { PrismaService } from 'src/prisma.service'
import { FileModule } from 'src/file/file.module'
import { CommunityModule } from 'src/community/community.module'

@Module({
	imports: [FileModule, CommunityModule],
	providers: [CoubService, CoubResolver, PrismaService]
})
export class CoubModule {}
