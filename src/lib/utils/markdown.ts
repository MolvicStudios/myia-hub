/** Lightweight Markdown to HTML renderer — no dependencies */

function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderMarkdown(text: string): string {
	let html = text;

	// Code blocks (```lang\ncode```)
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang: string, code: string) => {
		const langLabel = lang || 'text';
		return `<div class="md-code-wrapper"><div class="md-code-header"><span class="md-code-lang">${escapeHtml(langLabel)}</span><button type="button" class="md-copy-btn" data-code="${escapeHtml(code).replace(/"/g, '&quot;')}">Copiar</button></div><pre class="md-code-block"><code class="language-${escapeHtml(langLabel)}">${escapeHtml(code)}</code></pre></div>`;
	});

	// Inline code
	html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

	// Headers
	html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
	html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
	html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
	html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

	// Bold + italic
	html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
	html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

	// Strikethrough
	html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

	// Blockquote
	html = html.replace(/^>\s?(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

	// Horizontal rule
	html = html.replace(/^---$/gm, '<hr class="md-hr" />');

	// Unordered lists
	html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li class="md-li">$1</li>');
	html = html.replace(/((?:<li class="md-li">.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>');

	// Ordered lists
	html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="md-oli">$1</li>');
	html = html.replace(/((?:<li class="md-oli">.*<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>');

	// Links
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

	// Tables
	html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm, (_match, header: string, _sep: string, body: string) => {
		const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th class="md-th">${c.trim()}</th>`).join('');
		const rows = body.trim().split('\n').map((row: string) => {
			const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="md-td">${c.trim()}</td>`).join('');
			return `<tr>${cells}</tr>`;
		}).join('');
		return `<table class="md-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
	});

	// Paragraphs — wrap loose lines
	html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>');

	return html;
}
