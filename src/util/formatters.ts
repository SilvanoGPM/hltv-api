export function normalizeSlug(slug: string) {
  return slug.startsWith("/") ? slug.replace("/", "") : slug;
}
