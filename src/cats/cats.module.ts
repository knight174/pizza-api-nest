import { Global, Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 成为共享模块。任何导入了 Cats Module 的模块都可以使用 CatsService
})
export class CatsModule {}
