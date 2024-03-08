import { PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './CreateMeetingRoomDto';
import { IsNotEmpty, IsNumber } from 'class-validator';

// 直接继承create dto
export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  @IsNumber()
  id: number;
}
