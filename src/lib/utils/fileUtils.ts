/**
 * File utilities — reading, previewing, and validating file uploads.
 */
import type { FileAttachment } from '$lib/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const FILE_ICONS: Record<string, string> = {
	'application/pdf': '📄',
	'text/plain': '📝',
	'text/markdown': '📝',
	'text/csv': '📊',
	'image/png': '🖼️',
	'image/jpeg': '🖼️',
	'image/gif': '🖼️',
	'image/webp': '🖼️',
	'audio/mpeg': '🎵',
	'audio/wav': '🎵',
	'audio/ogg': '🎵',
	'application/json': '📋',
	'application/zip': '📦'
};

/** Get icon for a file type */
export function getFileIcon(mimeType: string): string {
	return FILE_ICONS[mimeType] ?? '📎';
}

/** Validate a file for upload */
export function validateFile(file: File): { valid: boolean; error?: string } {
	if (file.size > MAX_FILE_SIZE) {
		return { valid: false, error: `Archivo demasiado grande (máx ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
	}
	return { valid: true };
}

/** Convert a File to a FileAttachment */
export async function fileToAttachment(file: File): Promise<FileAttachment> {
	const base64 = await fileToBase64(file);
	let preview: string | undefined;

	if (file.type.startsWith('image/')) {
		preview = base64;
	} else if (file.type.startsWith('text/') || file.type === 'application/json') {
		const text = await file.text();
		preview = text.slice(0, 500);
	}

	return {
		name: file.name,
		type: file.type,
		size: file.size,
		preview,
		data: base64
	};
}

/** Convert a File to base64 */
function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
