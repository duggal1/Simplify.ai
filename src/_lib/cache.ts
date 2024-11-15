import { Redis } from 'ioredis';

export interface CacheInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

const redis = new Redis();

export const cache: CacheInterface = {
  async get(key: string): Promise<string | null> {
    try {
      const value = await redis.get(key);
      return value ? String(value) : null;
    } catch (error) {
      console.error('Cache get error', { error, key });
      return null;
    }
  },

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await redis.set(key, stringValue, 'EX', ttl);
    } catch (error) {
      console.error('Cache set error', { error, key });
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error', { error, key });
    }
  }
};
