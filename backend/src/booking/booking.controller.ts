import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags } from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/custom-decorator';
import { BookingDto } from './dto/BookingListDto';
import { ChangeBookingStatusDto } from './dto/ChangeBookingStatusDto';
import { AddBookingDto } from './dto/AddBookingDto';

@ApiTags('会议室预定')
@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('init-data')
  async initData() {
    await this.bookingService.initData();
    return 'init data success';
  }

  @Post('getBookingList')
  @RequireLogin()
  async getBookingList(@Body() bookingDto: BookingDto) {
    return await this.bookingService.getBookingList(bookingDto);
  }

  @Post('changeBookingStatus')
  @RequireLogin()
  async changeBookingStatus(
    @Body() changeBookingStatusDto: ChangeBookingStatusDto,
  ) {
    await this.bookingService.changeBookingStatus(changeBookingStatusDto);
    return '修改预订状态成功';
  }

  @Post('addBooking')
  @RequireLogin()
  async addBooking(
    @UserInfo('id') userId,
    @Body() addBookingDto: AddBookingDto,
  ) {
    await this.bookingService.addBooking(userId, addBookingDto);
    return '预定会议成功';
  }
}
