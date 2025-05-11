import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加 CORS 配置
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders:
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    credentials: true,
    maxAge: 86400,
  });

  // 启用版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  if (process.env.NODE_ENV === 'development') {
    // Swagger 配置
    const config = new DocumentBuilder()
      .setTitle('Pizza API')
      .setDescription('The Pizza API description')
      .setVersion('0.1')
      .addServer('/') // 添加服务器地址
      .build();
    const document = SwaggerModule.createDocument(app, config); // 创建 Swagger 文档
    SwaggerModule.setup('api-docs', app, document); // Swagger UI 地址为 http://localhost:3000/api-docs
  }

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 如果传入了 DTO 中未定义的属性，则抛出错误
      transform: true, // 自动转换负载类型 (例如 string to number, if applicable and enabled)
      // transformOptions: {
      //   enableImplicitConversion: true, // 对于 price/discount 从 string 到 string 不需要这个
      // },
    }),
  );

  // 全局拦截器和过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
