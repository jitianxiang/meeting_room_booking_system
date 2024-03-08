import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  // 拦截默认异常，catch HttpException
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    // 统一异常的返回格式
    response.statusCode = exception.getStatus();
    // 处理ValidationPipe的报错，错误信息在responese.message中
    const res = exception.getResponse() as { message: string[] };
    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: res.message?.join ? res.message.join(',') : exception.message,
      })
      .end();
  }
}
