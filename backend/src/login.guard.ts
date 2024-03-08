import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Permission } from './user/entities/permission.entity';

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

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private relector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // 获取接口上添加的元数据，过滤掉不需要login的接口
    const requireLogin = this.relector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requireLogin) return true;

    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('用户未登录');

    try {
      // 解析token中的user信息，附在request上，以便后续guard使用
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      request.user = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('token失效，请重新登录');
    }
  }
}
