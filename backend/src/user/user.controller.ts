import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from 'src/custom-decorator';
import { UserDetailVo } from './vo/UserInfoVo';
import { UpdateUserPwdDto } from './dto/UpdateUserPwdDto';
import { UpdateUserInfoDto } from './dto/UpdateUserInfoDto';
import { UserListDto } from './dto/UserListDto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storage } from 'src/my-file-storage';

@ApiTags('用户管理')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  // 注册时获取邮箱验证码
  @Get('getRegisterCaptcha')
  async getRegisterCaptcha(@Query('email') email: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${email}`, captcha, 5 * 60);
    await this.emailService.sendEmail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${captcha}</p>`,
    });
    return '验证码发送成功';
  }

  // 修改密码时获取邮箱验证码
  @Get('getUpdatePwdCaptcha')
  async getUpdatePwdCaptcha(@Query('email') email: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_password_captcha_${email}`,
      captcha,
      5 * 60,
    );
    await this.emailService.sendEmail({
      to: email,
      subject: '修改密码验证码',
      html: `<p>你的修改密码验证码是 ${captcha}</p>`,
    });
    return '验证码发送成功';
  }

  // 修改用户信息时获取邮箱验证码
  @Get('getUpdateUserInfoCaptcha')
  @RequireLogin()
  async getUpdateUserInfoCaptcha(@UserInfo('email') email: string) {
    const captcha = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_user_captcha_${email}`,
      captcha,
      5 * 60,
    );
    await this.emailService.sendEmail({
      to: email,
      subject: '修改用户信息验证码',
      html: `<p>你的修改用户信息验证码是 ${captcha}</p>`,
    });
    return '验证码发送成功';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'init data success';
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        email: vo.userInfo.email,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  @Post('admin-login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        email: vo.userInfo.email,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  // 用于accessToken失效时重新获取接口
  @Get('refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      // 根据jwt解析出refreshToken中的userId
      const data = this.jwtService.verify(refreshToken);
      const user: any = this.userService.findUserById(data.userId, false);
      // 生成新的accessToken返回
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      // 同时更新refreshToken以便下次使用
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @Get('admin-refresh-token')
  async adminRefreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      // 根据jwt解析出refreshToken中的userId
      const data = this.jwtService.verify(refreshToken);
      const user: any = this.userService.findUserById(data.userId, false);
      // 生成新的accessToken返回
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      // 同时更新refreshToken以便下次使用
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @Get('test')
  @RequireLogin()
  @RequirePermission('ddd')
  async test() {
    return 'test success';
  }

  // 根据id获取用户详情
  // @UserInfo 参数装饰器 获取之前LoginGuard在request上赋的userId(这样不用前端再传userId参数)
  @Get('getUserInfo')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    const user = await this.userService.getUserInfo(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;
    return vo;
  }

  @Post('updatePassword')
  async updatePassword(@Body() passwordDto: UpdateUserPwdDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  @Post('updateUserInfo')
  @RequireLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body() userInfoDto: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(userId, userInfoDto);
  }

  @Get('freeze')
  @RequireLogin()
  async freeze(@Query('userId') userId: number) {
    return await this.userService.freeze(userId);
  }

  @Post('getUserList')
  @RequireLogin()
  async getUserList(@Body() userListDto: UserListDto) {
    return await this.userService.getUserList(userListDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      // 自定义存储
      storage: storage,
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname);
        if (['.png', '.jpg', '.gif'].includes(extname)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return `/uploads/${file.filename}`;
  }
}
