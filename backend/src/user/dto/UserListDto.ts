import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserListDto {
  @IsNotEmpty({
    message: 'pageNo不能为空',
  })
  @IsInt()
  @ApiProperty()
  pageNo: number;

  @IsNotEmpty({
    message: 'pageSize不能为空',
  })
  @IsInt()
  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;
}
