import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';
import { Request } from 'express';

interface JwtUserData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

// 放在LoginGuard之后运行，确保拿到permissions
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private relector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user) return true;

    // 获取接口元数据上的所需的权限
    const requiredPermissions = this.relector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions) return true;

    // 将登录人的权限和接口所需权限作比对
    for (let i = 0; i < requiredPermissions.length; i++) {
      const found = request.user.permissions.find(
        (item) => item.code === requiredPermissions[i],
      );
      if (!found) throw new UnauthorizedException('你没有访问该接口的权限');
    }
    return true;
  }
}
