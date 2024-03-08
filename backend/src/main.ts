import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 添加uploads为静态目录，使前端可访问资源
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
  // 添加全局参数验证
  app.useGlobalPipes(new ValidationPipe());
  // 添加全局响应拦截
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 添加全局异常拦截
  app.useGlobalFilters(new CustomExceptionFilter());
  // 开启跨域
  app.enableCors();
  // 自动生成swagger文档
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
