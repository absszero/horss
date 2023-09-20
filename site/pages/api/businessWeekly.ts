import { NextApiRequest, NextApiResponse } from 'next';
import Xml from '@/lib/Xml';
import Storage from '@/lib/Storage';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rss = 'http://cmsapi.businessweekly.com.tw/?CategoryId=efd99109-9e15-422e-97f0-078b21322450&TemplateId=8E19CF43-50E5-4093-B72D-70A912962D55';
  const storage = new Storage;
  const xml = await storage.fetch(rss, false);

  const json = Xml.parse(xml);
  for (const item of json.rss.channel.item) {
    item.description = await storage.fetch(item.link, true, 'article');
  }
  const xmlContent = Xml.build(json);
  Xml.setXmlHeader(res);
  res.status(200).send(xmlContent);
}
