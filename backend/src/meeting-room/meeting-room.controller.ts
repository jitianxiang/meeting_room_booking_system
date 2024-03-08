import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/custom-decorator';
import { MeetingRoomListDto } from './dto/MeetingRoomListDto';
import { CreateMeetingRoomDto } from './dto/CreateMeetingRoomDto';
import { UpdateMeetingRoomDto } from './dto/UpdateMeetingRoomDto';

@ApiTags('会议室管理')
@Controller('api/meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('initData')
  async initData() {
    await this.meetingRoomService.initData();
    return 'init data success';
  }

  @Post('getMeetingRoomList')
  @RequireLogin()
  async getMeetingRoomList(@Body() meetingRoomListDto: MeetingRoomListDto) {
    return await this.meetingRoomService.getMeetingRoomList(meetingRoomListDto);
  }

  @Post('createMeetingRoom')
  @RequireLogin()
  async createMeetingRoom(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    await this.meetingRoomService.createMeetingRoom(createMeetingRoomDto);
    return '新增会议室成功';
  }

  @Post('updateMeetingRoom')
  @RequireLogin()
  async updateMeetingRoom(@Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    await this.meetingRoomService.updateMeetingRoom(updateMeetingRoomDto);
    return '修改会议室成功';
  }

  @Get('getMeetingRoomInfoById')
  @RequireLogin()
  async getMeetingRoomInfoById(@Query('id') id: number) {
    return await this.meetingRoomService.getMeetingRoomInfoById(id);
  }

  @Get('delMeetingRoomById')
  @RequireLogin()
  async delMeetingRoomById(@Query('id') id: number) {
    await this.meetingRoomService.delMeetingRoomById(id);
    return '删除会议室成功';
  }
}
