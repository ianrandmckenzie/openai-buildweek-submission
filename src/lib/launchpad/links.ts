export interface LaunchpadLinkInput { title: string; url: string; tags: string[]; project_id: string; description: string; icon_color: string; }

export function normalizeUrl(value: string): string {
  const raw = value.trim();
  if (!raw) throw new Error('A URL is required');
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(withProtocol);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only HTTP and HTTPS links are supported');
  return parsed.toString();
}

export function parseLinkInput(url: string, title: string, tags: string, project_id: string, description = '', icon_color = 'auto'): LaunchpadLinkInput {
  const normalized = normalizeUrl(url);
  const parsed = new URL(normalized);
  return { title: title.trim() || parsed.hostname, url: normalized, tags: [...new Set(tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))], project_id, description: description.trim(), icon_color };
}

export function filterLinks<T extends { title: string; url: string; tags?: string[] }>(links: T[], query: string, tag?: string): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  return links.filter((link) => (!normalizedQuery || `${link.title} ${link.url}`.toLowerCase().includes(normalizedQuery)) && (!tag || link.tags?.includes(tag)));
}

export function allTags<T extends { tags?: string[] }>(links: T[]): string[] { return [...new Set(links.flatMap((link) => link.tags ?? []))].sort(); }
