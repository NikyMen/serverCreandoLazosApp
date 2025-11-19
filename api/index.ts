interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[]>;
  body?: any;
  url: string;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(obj: any): VercelResponse;
  send(body: any): VercelResponse;
}
import { createApp } from '../src/app';

const app = createApp();

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};