import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  // 封装redis的get方法
  async get(key: string) {
    return await this.redisClient.get(key);
  }

  // 封装redis的set方法，过期时间为可选参数
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      // 设置过期时间
      await this.redisClient.expire(key, ttl);
    }
  }
}
