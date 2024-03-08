import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { StatusEnum } from '../entities/booking.entity';

export class ChangeBookingStatusDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNotEmpty({
    message: 'status不能为空',
  })
  @ApiProperty()
  status: StatusEnum;
}
