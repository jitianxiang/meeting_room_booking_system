import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MeetingRoomListDto {
  @IsNotEmpty({
    message: 'pageNo不能为空',
  })
  @ApiProperty()
  @IsNumber()
  pageNo: number;

  @IsNotEmpty({
    message: 'pageSize不能为空',
  })
  @ApiProperty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  capacity: number;

  @IsOptional()
  @ApiProperty()
  equipment: string;
}
