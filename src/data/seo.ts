// Set PUBLIC_SITE_URL to the deployed canonical origin, without a path.
export function absoluteSiteURL(path: string): string | undefined {
  const origin = import.meta.env.PUBLIC_SITE_URL;
  if (!origin) return undefined;
  try {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return undefined;
    return new URL(path, url.origin).href;
  } catch { return undefined; }
}
