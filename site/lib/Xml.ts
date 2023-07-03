import { NextApiResponse } from 'next'
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { parse as htmlParse } from 'node-html-parser';

export function setXmlHeader ( res: NextApiResponse )  {
    res.setHeader("Content-Type", "application/xml;charset=UTF-8");
}

export function parse ( xml: string, options?: {} )  {
    return (new XMLParser(options)).parse(xml);
}

export function build ( json: any, options?: {} )  {
    return (new XMLBuilder(options)).build(json);
}

export function toSafeXml(html: string, selector: string) {
    const root = htmlParse(html);
    const article = root.querySelector(selector);
    return article?.toString().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

export default { setXmlHeader, parse, build, toSafeXml }