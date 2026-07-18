import { describe, expect, it } from 'vitest';
import { createMarkdownDownload, renderMarkdown, sanitizeMarkdown } from '../src/lib/documents/markdown';

describe('markdown workspace', () => {
  it('renders supported typography and links', () => { const html = renderMarkdown('# Title\n\n**bold** and *italic*\n\n- One\n- Two\n\n[Docs](https://example.com)'); expect(html).toContain('<h1>Title</h1>'); expect(html).toContain('<strong>bold</strong>'); expect(html).toContain('<ul><li>One</li><li>Two</li></ul>'); expect(html).toContain('rel="noreferrer"'); });
  it('escapes HTML and removes executable vectors', () => { const safe = sanitizeMarkdown('<script>alert(1)</script>\n<img src=x onerror="alert(2)">\n[jump](javascript:alert(3))'); expect(safe).not.toContain('<script'); expect(safe).not.toContain('onerror'); expect(safe).not.toContain('javascript:'); expect(renderMarkdown(safe)).toContain('&lt;img'); });
  it('creates a markdown download blob', async () => { const blob = createMarkdownDownload({ title: 'Notes', content: 'Body' }); expect(blob.type).toContain('text/markdown'); expect(await blob.text()).toBe('# Notes\n\nBody'); });
});
