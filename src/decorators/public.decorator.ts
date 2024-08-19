// 声明为公共的路由
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
