import Cache from 'file-system-cache';
import { resolve } from 'path';
import getConfig from 'next/config';
import { pino } from 'pino';

export default async (link: string, doCache : boolean = true) => {
    const { serverRuntimeConfig } = getConfig()
    const cache = Cache({
        basePath: resolve('./pages', '../.cache'),
        ttl: 172800, // 快取兩天
    });
    let logger = pino();
    logger.info(`get cache: ${link}`);
    let text = await cache.get(link, undefined);
    if (undefined === text) {
        logger.info(`fetch: ${link}`);
        const response = await fetch(link);
        text = await response.text();

        if (doCache) {
            logger.info(`cache: ${link}`);
            cache.set(link, text);
        }
    }

    return text;
}