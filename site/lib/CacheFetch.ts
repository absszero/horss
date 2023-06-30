import Cache from 'file-system-cache';
import { resolve } from 'path';
import getConfig from 'next/config'

export default async (link: string) => {
    const { serverRuntimeConfig } = getConfig()
    const cache = Cache({
        basePath: resolve('./' + '.cahce'),
        ttl: 172800, // 快取兩天
      });
    let text = await cache.get(link, undefined);
    if (undefined === text) {
        const response = await fetch(link);
        text = await response.text();
        cache.set(link, text);
    }

    return text;
}