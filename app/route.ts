import { readFileSync } from 'fs';
import path from 'path';

export function GET() {
  const html = readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf-8');
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
