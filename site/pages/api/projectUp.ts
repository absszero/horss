import { NextApiRequest, NextApiResponse } from 'next';
import Xml from '@/lib/Xml';
import Storage from '@/lib/Storage';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rss = 'https://www.projectup.net/rss';
  const storage = new Storage;
  const xml = await storage.fetch(rss, false);

  const json = Xml.parse(xml, {ignoreAttributes: false});
  for (const item of json.rss.channel.item) {
    const html = await storage.fetch(item.link);
    item.description = Xml.toSafeXml(html, 'article')
  }
  const xmlContent = Xml.build(json, {ignoreAttributes: false});
  Xml.setXmlHeader(res);
  res.status(200).send(xmlContent);
}
