import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

// 自定义装饰器，用来封装 设置元数据 的方法
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

export const RequireLogin = () => SetMetadata('require-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
