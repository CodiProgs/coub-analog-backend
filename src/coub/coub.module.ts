import { Module } from '@nestjs/common'
import { CoubService } from './coub.service';
import { CoubResolver } from './coub.resolver';

@Module({
  providers: [CoubService, CoubResolver]
})
export class CoubModule {}
