import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加 CORS 配置
  app.enableCors({
    origin: true, // 允许所有来源，生产环境建议设置具体域名
    credentials: true, // 允许携带凭证
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 启用版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Pizza API')
    .setDescription('The Pizza API description')
    .setVersion('0.1')
    .addServer('/') // 添加服务器地址
    .build();
  const document = SwaggerModule.createDocument(app, config); // 创建 Swagger 文档
  SwaggerModule.setup('api-docs', app, document); // Swagger UI 地址为 http://localhost:3000/api

  // 全局拦截器和过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
