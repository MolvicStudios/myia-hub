import { describe, it, expect, vi } from 'vitest';
import { getFileIcon, validateFile, formatFileSize, fileToAttachment } from '$lib/utils/fileUtils';

describe('getFileIcon', () => {
	it('returns PDF icon for application/pdf', () => {
		expect(getFileIcon('application/pdf')).toBe('📄');
	});

	it('returns image icon for image types', () => {
		expect(getFileIcon('image/png')).toBe('🖼️');
		expect(getFileIcon('image/jpeg')).toBe('🖼️');
	});

	it('returns audio icon for audio types', () => {
		expect(getFileIcon('audio/mpeg')).toBe('🎵');
	});

	it('returns default icon for unknown type', () => {
		expect(getFileIcon('application/octet-stream')).toBe('📎');
	});
});

describe('validateFile', () => {
	it('accepts files under 10MB', () => {
		const file = new File(['x'.repeat(100)], 'test.txt', { type: 'text/plain' });
		const result = validateFile(file);
		expect(result.valid).toBe(true);
	});

	it('rejects files over 10MB', () => {
		// Create a mock file with size > 10MB
		const file = {
			name: 'large.bin',
			type: 'application/octet-stream',
			size: 11 * 1024 * 1024
		} as File;
		const result = validateFile(file);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('grande');
	});
});

describe('formatFileSize', () => {
	it('formats bytes', () => {
		expect(formatFileSize(512)).toBe('512 B');
	});

	it('formats kilobytes', () => {
		expect(formatFileSize(2048)).toBe('2.0 KB');
	});

	it('formats megabytes', () => {
		expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
	});
});

describe('fileToAttachment', () => {
	it('creates attachment from text file', async () => {
		const file = new File(['Hello world'], 'test.txt', { type: 'text/plain' });
		const attachment = await fileToAttachment(file);
		expect(attachment.name).toBe('test.txt');
		expect(attachment.type).toBe('text/plain');
		expect(attachment.size).toBe(11);
		expect(attachment.preview).toContain('Hello world');
	});

	it('creates attachment from image file', async () => {
		const file = new File([new Uint8Array([0x89, 0x50, 0x4E, 0x47])], 'photo.png', { type: 'image/png' });
		const attachment = await fileToAttachment(file);
		expect(attachment.name).toBe('photo.png');
		expect(attachment.type).toBe('image/png');
		expect(attachment.data).toBeDefined();
	});
});
