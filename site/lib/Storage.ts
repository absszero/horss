import getConfig from 'next/config'
import { pino } from 'pino';
import { createClient } from 'redis';
import Xml from '@/lib/Xml';
import LZString from 'lz-string';

export default class Storage {
    private redis: any;
    private logger;

    constructor() {
        this.logger = pino();
    }

    private async getRedis() {
        const { serverRuntimeConfig } = getConfig()
        const redis = await createClient({
            url: serverRuntimeConfig.redisUrl
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        return redis;
    }

    public async fetch(link: string, doCache: boolean = true, onlyTag = "") {
        if (!this.redis) {
            this.redis = await this.getRedis();
        }

        let text: string | null = "";
        if (doCache) {
            this.logger.info(`get cache: ${link}`);
            text = await this.redis.get(link);
            if (text) {
                let decompressed = LZString.decompressFromUTF16(text);
                if (decompressed) {
                    return decompressed;
                }
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
            let buffer = LZString.compressToUTF16(text)
            await this.redis.set(link, buffer, new Date().getTime() + 5 * 60 * 60 * 24);
        }

        return text;
    }
}