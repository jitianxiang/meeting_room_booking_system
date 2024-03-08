import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/CreateMeetingRoomDto';
import { UpdateMeetingRoomDto } from './dto/UpdateMeetingRoomDto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.repository.save([room1, room2, room3]);
  }

  async getMeetingRoomList(meetingRoomListDto) {
    const { pageNo, pageSize, name, capacity, equipment } = meetingRoomListDto;
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为1');
    }
    const skipCount = (pageNo - 1) * pageSize;
    // 各个字段的模糊查询
    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      select: [
        'id',
        'name',
        'capacity',
        'location',
        'equipment',
        'description',
        'isBooked',
        'createTime',
        'updateTime',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    return {
      meetingRooms,
      totalCount,
    };
  }

  async createMeetingRoom(createMeetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: createMeetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名称已存在');
    }
    return await this.repository.insert(createMeetingRoomDto);
  }

  async updateMeetingRoom(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id: updateMeetingRoomDto.id,
    });
    if (!room) {
      throw new BadRequestException('会议室不存在');
    }
    room.capacity = updateMeetingRoomDto.capacity;
    room.location = updateMeetingRoomDto.location;
    room.name = updateMeetingRoomDto.name;
    if (updateMeetingRoomDto.description) {
      room.description = updateMeetingRoomDto.description;
    }
    if (updateMeetingRoomDto.equipment) {
      room.equipment = updateMeetingRoomDto.equipment;
    }
    return await this.repository.save(room);
  }

  async getMeetingRoomInfoById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  async delMeetingRoomById(id: number) {
    return await this.repository.delete({ id });
  }
}
