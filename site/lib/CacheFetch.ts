import { pino } from 'pino';
import { kv } from "@vercel/kv";
import Xml from '@/lib/Xml';
import LZString from 'lz-string';

export default async (link: string, doCache : boolean = true, onlyTag = "") => {

    let logger = pino();
    let text: string | null = "";
    if (doCache) {
        logger.info(`get cache: ${link}`);
        text = await kv.get(link);
        if (text) {
            let decompressed = LZString.decompressFromUTF16(text);
            if (decompressed) {
                return decompressed;
            }
        }
    }

    logger.info(`fetch: ${link}`);
    const response = await fetch(link);
    text = await response.text() as string;
    if (onlyTag) {
        text = Xml.toSafeXml(text, onlyTag) as string
    }

    if (doCache) {
        logger.info(`set cache: ${link}`);
        let buffer = LZString.compressToUTF16(text)
        await kv.set(link, buffer);
    }

    return text;
}