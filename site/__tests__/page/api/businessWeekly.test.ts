import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/businessWeekly'
import '@testing-library/jest-dom'
import { readFileSync } from 'fs';

// import Storage from '@/lib/Storage';
const mockFetch = jest.fn();
jest.mock('../../../lib/Storage', () => {
  return jest.fn().mockImplementation(() => {
    return {fetch: mockFetch};
  });
});

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
    mockFetch
    .mockReturnValueOnce(Promise.resolve(xml))
    .mockReturnValue(Promise.resolve(html));

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
  });
})