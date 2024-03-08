import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import {
  Between,
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { BookingDto } from './dto/BookingListDto';
import { AddBookingDto } from './dto/AddBookingDto';
import { ChangeBookingStatusDto } from './dto/ChangeBookingStatusDto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 5,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 6,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 1,
    });
    const room2 = await await this.entityManager.findOneBy(MeetingRoom, {
      id: 2,
    });

    const booking1 = new Booking();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking4);
  }

  async getBookingList(bookingDto: BookingDto) {
    const {
      pageNo,
      pageSize,
      username,
      meetingRoomLocation,
      bookingStartTime,
      bookingEndTime,
      meetingRoomName,
    } = bookingDto;
    const skipCount = (pageNo - 1) * pageSize;
    // 各个字段的模糊查询
    const condition: Record<string, any> = {};
    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }
    if (meetingRoomLocation) {
      condition.room.location = Like(`%${meetingRoomLocation}%`);
    }
    if (meetingRoomName) {
      condition.room.name = Like(`%${meetingRoomName}%`);
    }
    if (bookingStartTime && bookingEndTime) {
      condition.startTime = Between(
        new Date(bookingStartTime),
        new Date(bookingEndTime),
      );
    }
    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        skip: skipCount,
        take: pageSize,
        where: condition,
        relations: {
          user: true,
          room: true,
        },
      },
    );
    return {
      bookings: bookings.map((booking) => {
        delete booking.user.password;
        return booking;
      }),
      totalCount,
    };
  }

  async addBooking(userId: number, addBookingDto: AddBookingDto) {
    // 先校验会议室是否存在
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: addBookingDto.meetingRoomId,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });

    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user;
    booking.startTime = new Date(addBookingDto.startTime);
    booking.endTime = new Date(addBookingDto.endTime);

    const res = await this.entityManager.findOneBy(Booking, {
      room: {
        id: meetingRoom.id,
      },
      startTime: LessThanOrEqual(booking.startTime),
      endTime: MoreThanOrEqual(booking.endTime),
    });

    if (res) {
      throw new BadRequestException('该时间段已被预定');
    }
    await this.entityManager.save(Booking, booking);
  }

  async changeBookingStatus(changeBookingStatusDto: ChangeBookingStatusDto) {
    const { id, status } = changeBookingStatusDto;
    await this.entityManager.update(Booking, { id }, { status });
  }

  // 催办
  async urge(id: number) {
    // 先去redis中查看是否已催办
    const flag = this.redisService.get(`urge_${id}`);
    if (flag) {
      return '半小时内只能催办一次，请耐心等待';
    }
    // 查找管理员邮箱，准备发邮件
    let email = await this.redisService.get('admin_email');
    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });
      email = admin.email;
      this.redisService.set('admin_email', email);
    }
    // 发送催办邮件
    this.emailService.sendEmail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id为${id}的预定申请正在等待审批`,
    });
    this.redisService.set(`urge_${id}`, 1, 30 * 60);
  }
}
