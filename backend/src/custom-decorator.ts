import { SetMetadata } from '@nestjs/common';

// 自定义装饰器，用来封装 设置元数据 的方法
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

export const RequireLogin = () => SetMetadata('require-login', true);
