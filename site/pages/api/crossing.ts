import { NextApiRequest, NextApiResponse } from 'next';
import Xml from '@/lib/Xml';
import Storage from '@/lib/Storage';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rss = 'https://crossing.cw.com.tw/rss';
  const storage = new Storage;
  const xml = await storage.fetch(rss, false);

  const options = {ignoreAttributes: false, allowBooleanAttributes: true, suppressBooleanAttributes: false};
  const json = Xml.parse(xml, options);
  for (const item of json.rss.channel.item) {
    const html = await storage.fetch(item.link);
    item.description = Xml.toSafeXml(html, 'article')
  }
  const xmlContent = Xml.build(json, options);
  Xml.setXmlHeader(res);
  res.status(200).send(xmlContent);
}
