import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  meetingRoomName: string;

  @ApiProperty()
  meetingRoomLocation: string;

  @ApiProperty()
  bookingStartTime: string;

  @ApiProperty()
  bookingEndTime: string;
}
