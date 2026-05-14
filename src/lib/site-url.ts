/** Canonical site URL for metadata and absolute links (set in production). */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      // fall through
    }
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}
