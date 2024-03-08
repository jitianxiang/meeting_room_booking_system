import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 相应拦截，统一相应格式
    const response: any = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: 'success',
          data,
        };
      }),
    );
  }
}
