import { NextApiRequest, NextApiResponse } from 'next';
import Xml from '@/lib/Xml';
import Storage from '@/lib/Storage';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rss = 'https://www.blogger.com/feeds/1264116278467470539/posts/default';
  const storage = new Storage;
  const xml = await storage.fetch(rss, false);

  const options = {ignoreAttributes: false, suppressBooleanAttributes: false};
  const json = Xml.parse(xml, options);

  const selectors = ['#main-wrapper'];
  for (const item of json.feed.entry) {
    const html = await storage.fetch(item.link[4]['@_href']);
    for (const selector of selectors) {
      item.summary['#text'] = Xml.toSafeXml(html, selector);
      if (item.summary['#text']) break;
    }
  }
  const xmlContent = Xml.build(json, options);
  Xml.setXmlHeader(res);
  res.status(200).send(xmlContent);
}
