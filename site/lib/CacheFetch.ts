import { pino } from 'pino';
import { kv } from "@vercel/kv";

export default async (link: string, doCache : boolean = true) => {

    let logger = pino();
    logger.info(`get cache: ${link}`);
    let text = await kv.get(link);
    if(text) {
        return text as string;
    }

    logger.info(`fetch: ${link}`);
    const response = await fetch(link);
    text = await response.text();

    if (doCache) {
        logger.info(`set cache: ${link}`);
        await kv.set(link, text);
    }

    return text as string;
}