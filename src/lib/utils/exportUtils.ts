/**
 * Export utilities — convert chats to JSON or Markdown for download.
 */
import type { Chat, ChatMessage } from '$lib/types';

/** Export a chat as JSON and trigger download */
export function exportAsJson(chat: Chat) {
	const data = JSON.stringify(chat, null, 2);
	downloadFile(data, `${sanitizeFilename(chat.title)}.json`, 'application/json');
}

/** Export a chat as Markdown and trigger download */
export function exportAsMarkdown(chat: Chat) {
	const lines: string[] = [
		`# ${chat.title}`,
		'',
		`**Modelo:** ${chat.model}`,
		`**Creado:** ${new Date(chat.createdAt).toLocaleString()}`,
		`**Actualizado:** ${new Date(chat.updatedAt).toLocaleString()}`,
		'',
		'---',
		''
	];

	for (const msg of chat.messages) {
		const role = msg.role === 'user' ? '👤 Usuario' : msg.role === 'assistant' ? '🤖 Asistente' : '⚙️ Sistema';
		const time = new Date(msg.timestamp).toLocaleTimeString();
		lines.push(`### ${role} — ${time}`);
		if (msg.model) lines.push(`*Modelo: ${msg.model}*`);
		lines.push('');
		lines.push(msg.content);
		lines.push('');

		if (msg.attachments?.length) {
			lines.push('**Archivos adjuntos:**');
			for (const a of msg.attachments) {
				lines.push(`- ${a.name} (${a.type})`);
			}
			lines.push('');
		}

		lines.push('---');
		lines.push('');
	}

	const md = lines.join('\n');
	downloadFile(md, `${sanitizeFilename(chat.title)}.md`, 'text/markdown');
}

/** Trigger a file download in the browser */
function downloadFile(content: string, filename: string, mimeType: string) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/** Sanitize a string for use as a filename */
function sanitizeFilename(name: string): string {
	return name
		.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-_]/g, '')
		.replace(/\s+/g, '_')
		.slice(0, 50) || 'chat';
}
