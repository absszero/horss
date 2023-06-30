import { NextApiResponse } from 'next'
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function setXmlHeader ( res: NextApiResponse )  {
    res.setHeader("Content-Type", "application/xml;charset=UTF-8");
}

export function parse ( xml: string )  {
    return (new XMLParser).parse(xml);
}

export function build ( json: any )  {
    return (new XMLBuilder()).build(json);
}

export default { setXmlHeader, parse, build }