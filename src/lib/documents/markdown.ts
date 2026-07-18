export interface MarkdownDocument { title: string; content: string; }

function escapeHtml(value: string): string { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
function inlineMarkdown(value: string): string {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/_([^_]+)_/g, '<em>$1</em>');
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return output;
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n'); const output: string[] = []; let inCode = false; let code: string[] = []; let listOpen = false;
  const closeList = () => { if (listOpen) { output.push('</ul>'); listOpen = false; } };
  for (const line of lines) {
    if (line.trim().startsWith('```')) { if (inCode) { output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code = []; } inCode = !inCode; closeList(); continue; }
    if (inCode) { code.push(line); continue; }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line); const bullet = /^\s*[-*+]\s+(.+)$/.exec(line);
    if (heading) { closeList(); const level = heading[1].length; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
    if (bullet) { if (!listOpen) { output.push('<ul>'); listOpen = true; } output.push(`<li>${inlineMarkdown(bullet[1])}</li>`); continue; }
    closeList(); if (!line.trim()) continue; output.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  if (inCode) output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); closeList(); return output.join('');
}

export function sanitizeMarkdown(markdown: string): string { return markdown.replace(/<\/?script\b[^>]*>/gi, '').replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/javascript:/gi, ''); }
export function createMarkdownDownload(document: MarkdownDocument): Blob { return new Blob([`# ${document.title.trim() || 'Untitled'}\n\n${document.content}`], { type: 'text/markdown;charset=utf-8' }); }
