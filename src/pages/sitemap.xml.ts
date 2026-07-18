import type { APIRoute } from 'astro';

// 단일 페이지 사이트라 @astrojs/sitemap 대신 수제 XML. 페이지가 늘어나면 integration으로 전환.
export const GET: APIRoute = ({ site }) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL('/', site)}</loc>
  </url>
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
