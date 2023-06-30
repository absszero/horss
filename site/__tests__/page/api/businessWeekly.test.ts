import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/businessWeekly'
import '@testing-library/jest-dom'
import { readFileSync } from 'fs';

import fetch from '@/lib/CacheFetch';
jest.mock('../../../lib/CacheFetch');

let req: NextApiRequest;
let res: jest.Mocked<NextApiResponse> = {
  status: jest.fn().mockReturnThis(),
  setHeader: jest.fn(),
  send: jest.fn(),
} as unknown as jest.Mocked<NextApiResponse>;

describe('Home', () => {
  it('should return', async () => {
    const xml = readFileSync(__dirname + '/sample.xml', 'utf-8');
    const html = readFileSync(__dirname + '/sample.html', 'utf-8');
    (fetch as jest.Mock)
    .mockReturnValueOnce(Promise.resolve(xml))
    .mockReturnValue(Promise.resolve(html));

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
  });
})