import getConfig from 'next/config'
import { pino } from 'pino';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import Xml from '@/lib/Xml';

export default class Storage {
    private redis: RedisClientType;
    private logger;

    constructor() {
        this.logger = pino();

        const { serverRuntimeConfig } = getConfig()
        this.redis = createClient({
            url: serverRuntimeConfig.redisUrl
        });
    }

    private async getRedis() {
        if (this.redis.isReady) {
            return this.redis;
        } else {
            this.redis.on('error', err => console.log('Redis Client Error', err))
            await this.redis.connect();
        }
        return this.redis;
    }

    public async fetch(link: string, doCache: boolean = true, onlyTag = "") {
        this.redis = await this.getRedis();
        let text: string | null = "";
        if (doCache) {
            this.logger.info(`get cache: ${link}`);
            text = await this.redis.get(link);
            if (text) {
                return text;
            }
        }

        this.logger.info(`fetch: ${link}`);
        const response = await fetch(link);
        text = await response.text() as string;
        if (onlyTag) {
            text = Xml.toSafeXml(text, onlyTag) as string
        }

        if (doCache) {
            this.logger.info(`set cache: ${link}`);
            await this.redis.setEx(link, 60 * 60 * 72, text);
        }

        return text;
    }
}