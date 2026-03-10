/** Lightweight i18n store — Spanish (default) + English */
import { writable, derived, get } from 'svelte/store';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'myia_locale';

function detectLocale(): Locale {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'en' || saved === 'es') return saved;
	}
	if (typeof navigator !== 'undefined') {
		return navigator.language.startsWith('en') ? 'en' : 'es';
	}
	return 'es';
}

export const locale = writable<Locale>(detectLocale());

locale.subscribe((l) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, l);
	}
});

export function setLocale(l: Locale) {
	locale.set(l);
}

/** Translation dictionary */
const translations: Record<string, Record<Locale, string>> = {
	// General
	'app.title': { es: 'MyIA Hub', en: 'MyIA Hub' },
	'app.subtitle': { es: 'Hub de Inteligencia Artificial', en: 'AI Hub' },

	// Sidebar
	'sidebar.newChat': { es: 'Nuevo chat', en: 'New chat' },
	'sidebar.search': { es: 'Buscar chats...', en: 'Search chats...' },
	'sidebar.noChats': { es: 'No hay chats aún', en: 'No chats yet' },

	// Chat
	'chat.placeholder': { es: 'Escribe un mensaje... (@modelo para mencionar)', en: 'Type a message... (@model to mention)' },
	'chat.send': { es: 'Enviar mensaje', en: 'Send message' },
	'chat.attachFiles': { es: 'Adjuntar archivos', en: 'Attach files' },
	'chat.dropFiles': { es: 'Soltar archivos aquí', en: 'Drop files here' },

	// Settings
	'settings.title': { es: 'Configuración', en: 'Settings' },
	'settings.apis': { es: '🔑 APIs', en: '🔑 APIs' },
	'settings.prefs': { es: '⚙️ Preferencias', en: '⚙️ Preferences' },
	'settings.memory': { es: '🧠 Memoria', en: '🧠 Memory' },
	'settings.theme': { es: 'Tema', en: 'Theme' },
	'settings.defaultModel': { es: 'Modelo por defecto', en: 'Default model' },
	'settings.memoryLocal': { es: 'Memoria local', en: 'Local memory' },
	'settings.memoryDesc': { es: 'Recordar contexto entre sesiones', en: 'Remember context between sessions' },
	'settings.clearMemory': { es: '🗑️ Borrar toda la memoria', en: '🗑️ Clear all memory' },
	'settings.language': { es: 'Idioma', en: 'Language' },

	// Welcome
	'welcome.title': { es: 'Bienvenido a MyIA Hub', en: 'Welcome to MyIA Hub' },
	'welcome.subtitle': { es: 'Elige un modelo para empezar', en: 'Choose a model to start' },

	// Prompts
	'prompts.saved': { es: 'Prompts guardados', en: 'Saved prompts' },
	'prompts.labelPlaceholder': { es: 'Etiqueta (opcional)', en: 'Label (optional)' },
	'prompts.textPlaceholder': { es: 'Escribe tu prompt...', en: 'Write your prompt...' },
	'prompts.save': { es: 'Guardar prompt', en: 'Save prompt' },
	'prompts.empty': { es: 'No hay prompts guardados aún.', en: 'No saved prompts yet.' },

	// PWA
	'pwa.install': { es: 'Instalar MyIA Hub', en: 'Install MyIA Hub' },
	'pwa.installDesc': { es: 'Accede más rápido desde tu escritorio o móvil', en: 'Access faster from desktop or mobile' },
	'pwa.installBtn': { es: 'Instalar', en: 'Install' },
	'pwa.later': { es: 'Ahora no', en: 'Not now' },

	// Shortcuts
	'shortcuts.title': { es: 'Atajos de teclado', en: 'Keyboard shortcuts' },
	'shortcuts.newChat': { es: 'Nuevo chat', en: 'New chat' },
	'shortcuts.toggleSidebar': { es: 'Toggle sidebar', en: 'Toggle sidebar' },
	'shortcuts.settings': { es: 'Configuración', en: 'Settings' },
	'shortcuts.help': { es: 'Atajos de teclado', en: 'Keyboard shortcuts' },
	'shortcuts.close': { es: 'Cerrar panel', en: 'Close panel' },

	// Export
	'export.title': { es: 'Exportar', en: 'Export' },
	'export.json': { es: 'Descargar JSON', en: 'Download JSON' },
	'export.md': { es: 'Descargar Markdown', en: 'Download Markdown' },
	'export.clipboard': { es: 'Copiar al portapapeles', en: 'Copy to clipboard' },

	// Footer
	'footer.privacy': { es: 'Privacidad', en: 'Privacy' },
	'footer.cookies': { es: 'Cookies', en: 'Cookies' },
	'footer.tutorial': { es: 'Tutorial', en: 'Tutorial' },
	'footer.compare': { es: 'Comparador', en: 'Comparator' },
};

/** Translation helper — returns the translated string or the key if not found */
export function t(key: string): string {
	const l = get(locale);
	return translations[key]?.[l] ?? key;
}

/** Reactive translation store */
export const i18n = derived(locale, ($locale) => {
	return (key: string): string => translations[key]?.[$locale] ?? key;
});
