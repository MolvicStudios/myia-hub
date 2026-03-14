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
	'sidebar.createNew': { es: 'Crear nuevo chat', en: 'Create new chat' },
	'sidebar.closeSidebar': { es: 'Cerrar sidebar', en: 'Close sidebar' },
	'sidebar.ariaLabel': { es: 'Barra lateral de chats', en: 'Chat sidebar' },
	'sidebar.chatList': { es: 'Lista de conversaciones', en: 'Conversation list' },
	'sidebar.rename': { es: 'Renombrar', en: 'Rename' },
	'sidebar.delete': { es: 'Eliminar', en: 'Delete' },
	'sidebar.deleteConfirm': { es: '¿Eliminar este chat? Esta acción no se puede deshacer.', en: 'Delete this chat? This action cannot be undone.' },

	// Chat
	'chat.placeholder': { es: 'Escribe un mensaje... (@modelo para mencionar)', en: 'Type a message... (@model to mention)' },
	'chat.send': { es: 'Enviar mensaje', en: 'Send message' },
	'chat.attachFiles': { es: 'Adjuntar archivos', en: 'Attach files' },
	'chat.dropFiles': { es: 'Soltar archivos aquí', en: 'Drop files here' },
	'chat.inputArea': { es: 'Área de entrada de mensaje', en: 'Message input area' },
	'chat.modelSuggestions': { es: 'Sugerencias de modelos', en: 'Model suggestions' },
	'chat.selectFiles': { es: 'Seleccionar archivos para adjuntar', en: 'Select files to attach' },
	'chat.chatMessage': { es: 'Mensaje de chat', en: 'Chat message' },
	'chat.startConversation': { es: 'Comienza la conversación', en: 'Start the conversation' },
	'chat.thinking': { es: 'Pensando…', en: 'Thinking…' },
	'chat.writing': { es: 'Escribiendo…', en: 'Writing…' },
	'chat.cancel': { es: 'Cancelar', en: 'Cancel' },
	'chat.cancelGeneration': { es: 'Cancelar generación', en: 'Cancel generation' },
	'chat.messages': { es: 'Mensajes de la conversación', en: 'Conversation messages' },
	'chat.userMessage': { es: 'Mensaje del usuario', en: 'User message' },
	'chat.systemMessage': { es: 'Mensaje del sistema', en: 'System message' },
	'chat.assistantResponse': { es: 'Respuesta de', en: 'Response from' },
	'chat.attachment': { es: 'Adjunto', en: 'Attachment' },
	'chat.removeFile': { es: 'Eliminar archivo', en: 'Remove file' },
	'chat.copied': { es: '✓ Copiado', en: '✓ Copied' },
	'chat.copy': { es: 'Copiar', en: 'Copy' },
	'chat.notFound': { es: 'Chat no encontrado', en: 'Chat not found' },

	// ModelSelector
	'model.selector': { es: 'Selector de modelo', en: 'Model selector' },
	'model.search': { es: 'Buscar modelo...', en: 'Search model...' },
	'model.searchLabel': { es: 'Buscar modelo', en: 'Search model' },
	'model.list': { es: 'Lista de modelos', en: 'Model list' },
	'model.fast': { es: '⚡ Rápido', en: '⚡ Fast' },
	'model.medium': { es: '🔄 Medio', en: '🔄 Medium' },
	'model.slow': { es: '🐢 Lento', en: '🐢 Slow' },
	'model.free': { es: '🆓 Gratis', en: '🆓 Free' },

	// Status
	'status.idle': { es: 'Listo', en: 'Ready' },
	'status.loading': { es: 'Pensando…', en: 'Thinking…' },
	'status.typing': { es: 'Escribiendo…', en: 'Writing…' },
	'status.error': { es: 'Error', en: 'Error' },
	'status.label': { es: 'Estado del modelo', en: 'Model status' },

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
	'settings.clearMemoryConfirm': { es: '¿Borrar toda la memoria local?', en: 'Clear all local memory?' },
	'settings.language': { es: 'Idioma', en: 'Language' },
	'settings.close': { es: 'Cerrar', en: 'Close' },
	'settings.closeSettings': { es: 'Cerrar configuración', en: 'Close settings' },
	'settings.panelLabel': { es: 'Panel de configuración', en: 'Settings panel' },
	'settings.sections': { es: 'Secciones de configuración', en: 'Settings sections' },
	'settings.enableMemory': { es: 'Activar memoria local', en: 'Enable local memory' },
	'settings.subtitle': { es: 'Gestiona tus claves API, preferencias y memoria local.', en: 'Manage your API keys, preferences, and local memory.' },
	'settings.preferences': { es: 'Preferencias', en: 'Preferences' },
	'settings.changeTheme': { es: 'Cambiar', en: 'Change' },
	'settings.darkMode': { es: '🌙 Modo oscuro', en: '🌙 Dark mode' },
	'settings.lightMode': { es: '☀️ Modo claro', en: '☀️ Light mode' },
	'settings.memorySection': { es: 'Memoria', en: 'Memory' },
	'settings.memoryEnabled': { es: 'Memoria local habilitada', en: 'Local memory enabled' },
	'settings.memorySave': { es: 'Guardar contexto de conversaciones', en: 'Save conversation context' },
	'settings.clearMemoryFullConfirm': { es: '¿Eliminar toda la memoria local? Esta acción no se puede deshacer.', en: 'Delete all local memory? This action cannot be undone.' },
	'settings.dangerZone': { es: 'Zona de peligro', en: 'Danger zone' },
	'settings.resetConfirm': { es: '¿Restaurar toda la configuración a los valores por defecto?', en: 'Reset all settings to defaults?' },
	'settings.resetBtn': { es: '⚠️ Restaurar configuración por defecto', en: '⚠️ Reset to default settings' },

	// Welcome
	'welcome.title': { es: 'Bienvenido a MyIA Hub', en: 'Welcome to MyIA Hub' },
	'welcome.subtitle': { es: 'Tu hub de inteligencia artificial multimodelo. Elige un modelo para comenzar una conversación.', en: 'Your multi-model AI hub. Choose a model to start a conversation.' },
	'welcome.hint': { es: 'Usa @modelo en un chat para dirigirte a un modelo específico', en: 'Use @model in a chat to target a specific model' },

	// Prompts
	'prompts.saved': { es: 'Prompts guardados', en: 'Saved prompts' },
	'prompts.labelPlaceholder': { es: 'Etiqueta (opcional)', en: 'Label (optional)' },
	'prompts.textPlaceholder': { es: 'Escribe tu prompt...', en: 'Write your prompt...' },
	'prompts.save': { es: 'Guardar prompt', en: 'Save prompt' },
	'prompts.empty': { es: 'No hay prompts guardados aún.', en: 'No saved prompts yet.' },
	'prompts.delete': { es: 'Eliminar', en: 'Delete' },

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
	'shortcuts.closeBtn': { es: 'Cerrar', en: 'Close' },

	// Export
	'export.title': { es: 'Exportar conversación', en: 'Export conversation' },
	'export.json': { es: 'Formato estructurado', en: 'Structured format' },
	'export.md': { es: 'Formato legible', en: 'Readable format' },
	'export.clipboard': { es: 'Copiar al portapapeles', en: 'Copy to clipboard' },
	'export.cancel': { es: 'Cancelar', en: 'Cancel' },

	// Footer
	'footer.privacy': { es: 'Privacidad', en: 'Privacy' },
	'footer.cookies': { es: 'Cookies', en: 'Cookies' },
	'footer.tutorial': { es: 'Tutorial', en: 'Tutorial' },
	'footer.compare': { es: 'Comparador', en: 'Comparator' },
	'footer.debate': { es: 'Debate', en: 'Debate' },

	// Layout / Header
	'layout.openMenu': { es: 'Abrir menú lateral', en: 'Open sidebar menu' },
	'layout.toggleSidebar': { es: 'Alternar barra lateral', en: 'Toggle sidebar' },
	'layout.openSettings': { es: 'Abrir configuración', en: 'Open settings' },
	'layout.skipToContent': { es: 'Ir al contenido principal', en: 'Skip to main content' },
	'layout.exportConversation': { es: 'Exportar conversación', en: 'Export conversation' },
	'layout.export': { es: 'Exportar', en: 'Export' },

	// Cookie banner
	'cookies.banner': { es: 'Este sitio utiliza cookies técnicas necesarias y cookies publicitarias de Monetag. Puedes aceptar, rechazar o configurar su uso.', en: 'This site uses necessary technical cookies and advertising cookies from Monetag. You can accept, reject or configure their use.' },
	'cookies.moreInfo': { es: 'Más información', en: 'More information' },
	'cookies.reject': { es: 'Rechazar', en: 'Reject' },
	'cookies.accept': { es: 'Aceptar todas', en: 'Accept all' },
	'cookies.configure': { es: 'Configurar', en: 'Configure' },
	'cookies.consent': { es: 'Consentimiento de cookies', en: 'Cookie consent' },
	'cookies.configTitle': { es: 'Configuración de cookies', en: 'Cookie settings' },
	'cookies.necessary': { es: 'Técnicas (necesarias)', en: 'Technical (necessary)' },
	'cookies.necessaryDesc': { es: 'Imprescindibles para el funcionamiento de la aplicación. No se pueden desactivar.', en: 'Essential for the application to work. Cannot be disabled.' },
	'cookies.advertising': { es: 'Publicitarias (Monetag)', en: 'Advertising (Monetag)' },
	'cookies.advertisingDesc': { es: 'Permiten mostrar anuncios personalizados y medir su rendimiento.', en: 'Allow showing personalized ads and measuring their performance.' },
	'cookies.back': { es: 'Volver', en: 'Back' },
	'cookies.saveConfig': { es: 'Guardar preferencias', en: 'Save preferences' },

	// Compare page
	'compare.title': { es: 'Comparador de modelos', en: 'Model comparator' },
	'compare.back': { es: '← Volver', en: '← Back' },
	'compare.selectModels': { es: 'Selecciona 2-4 modelos', en: 'Select 2-4 models' },
	'compare.placeholder': { es: 'Escribe tu prompt para comparar...', en: 'Write your prompt to compare...' },
	'compare.button': { es: 'Comparar', en: 'Compare' },
	'compare.empty': { es: 'Selecciona modelos y escribe un prompt para compararlos', en: 'Select models and write a prompt to compare them' },
	'compare.unknownError': { es: 'Error desconocido', en: 'Unknown error' },

	// Debate page
	'debate.title': { es: 'Debate Multi-Modelo', en: 'Multi-Model Debate' },
	'debate.subtitle': { es: 'Hasta 4 modelos debaten entre sí, leyendo las respuestas de los demás', en: 'Up to 4 models debate each other, reading each other\'s responses' },
	'debate.participants': { es: 'Participantes', en: 'Participants' },
	'debate.change': { es: 'Cambiar', en: 'Change' },
	'debate.close': { es: 'Cerrar', en: 'Close' },
	'debate.apiKeyConfigured': { es: 'API key configurada', en: 'API key configured' },
	'debate.missingApiKey': { es: 'Falta API key', en: 'Missing API key' },
	'debate.remove': { es: 'Quitar', en: 'Remove' },
	'debate.minMax': { es: 'participantes', en: 'participants' },
	'debate.missingKeys': { es: 'Falta API key para:', en: 'Missing API key for:' },
	'debate.configureInSettings': { es: 'Configúrala en Ajustes.', en: 'Configure it in Settings.' },
	'debate.topic': { es: 'Tema del debate', en: 'Debate topic' },
	'debate.rounds': { es: 'Rondas', en: 'Rounds' },
	'debate.totalTurns': { es: 'turnos totales', en: 'total turns' },
	'debate.start': { es: 'Iniciar Debate', en: 'Start Debate' },
	'debate.models': { es: 'modelos', en: 'models' },
	'debate.round': { es: 'Ronda', en: 'Round' },
	'debate.writingLive': { es: 'Escribiendo…', en: 'Writing…' },
	'debate.thinkingLive': { es: 'Pensando…', en: 'Thinking…' },
	'debate.completed': { es: 'Debate completado', en: 'Debate completed' },
	'debate.interventions': { es: 'intervenciones', en: 'interventions' },
	'debate.newDebate': { es: 'Nuevo debate', en: 'New debate' },
	'debate.stop': { es: 'Detener debate', en: 'Stop debate' },
	'debate.errorIn': { es: 'Error en', en: 'Error in' },

	// Theme labels
	'theme.dark': { es: '🌙 Oscuro', en: '🌙 Dark' },
	'theme.light': { es: '☀️ Claro', en: '☀️ Light' },
	'theme.solarized': { es: '🌊 Solarized', en: '🌊 Solarized' },
	'theme.nord': { es: '❄️ Nord', en: '❄️ Nord' },

	// API Key Manager
	'apikeys.title': { es: 'Claves API', en: 'API Keys' },
	'apikeys.active': { es: 'Activa', en: 'Active' },
	'apikeys.review': { es: 'Revisar', en: 'Review' },
	'apikeys.verify': { es: 'Verificar clave', en: 'Verify key' },
	'apikeys.verifyOf': { es: 'Verificar clave de', en: 'Verify key of' },
	'apikeys.show': { es: 'Mostrar', en: 'Show' },
	'apikeys.hide': { es: 'Ocultar', en: 'Hide' },
	'apikeys.keyOf': { es: 'clave de', en: 'key of' },
	'apikeys.deleteOf': { es: 'Eliminar clave de', en: 'Delete key of' },
	'apikeys.editOf': { es: 'Editar clave de', en: 'Edit key of' },
	'apikeys.apiKeyOf': { es: 'Clave API de', en: 'API key of' },
	'apikeys.save': { es: 'Guardar', en: 'Save' },
	'apikeys.cancel': { es: 'Cancelar', en: 'Cancel' },
	'apikeys.invalidFormat': { es: 'Formato de clave no válido. Revisa el prefijo y longitud.', en: 'Invalid key format. Check the prefix and length.' },
	'apikeys.valid': { es: '✓ Clave válida', en: '✓ Valid key' },
	'apikeys.invalid': { es: 'Clave inválida o sin permisos', en: 'Invalid key or no permissions' },
	'apikeys.validRateLimited': { es: '✓ Clave válida (rate-limited)', en: '✓ Valid key (rate-limited)' },
	'apikeys.accepted': { es: 'clave aceptada', en: 'key accepted' },
	'apikeys.connectionError': { es: 'Error de conexión', en: 'Connection error' },

	// Ollama Settings
	'ollama.title': { es: 'Ollama (Modelos Locales)', en: 'Ollama (Local Models)' },
	'ollama.enable': { es: 'Habilitar Ollama', en: 'Enable Ollama' },
	'ollama.enableDesc': { es: 'Ejecuta modelos de IA en tu máquina sin coste ni API keys', en: 'Run AI models on your machine with no cost or API keys' },
	'ollama.enableAria': { es: 'Activar Ollama', en: 'Enable Ollama' },
	'ollama.endpoint': { es: 'Endpoint de Ollama', en: 'Ollama Endpoint' },
	'ollama.testing': { es: 'Probando...', en: 'Testing...' },
	'ollama.test': { es: '🔌 Probar', en: '🔌 Test' },
	'ollama.connectedModels': { es: 'modelo(s) instalado(s)', en: 'model(s) installed' },
	'ollama.connected': { es: 'Conectado', en: 'Connected' },
	'ollama.noModels': { es: 'Conectado, pero no hay modelos instalados. Ejecuta: ollama pull llama3.2:3b', en: 'Connected, but no models installed. Run: ollama pull llama3.2:3b' },
	'ollama.corsError': { es: 'Error CORS: Ollama rechaza conexiones desde myia.pro. Ejecuta el comando de "Solución rápida" del tutorial.', en: 'CORS Error: Ollama rejects connections from myia.pro. Run the "Quick fix" command from the tutorial.' },
	'ollama.connectionError': { es: 'No se pudo conectar con Ollama. ¿Está ejecutándose? Comprueba con: curl http://localhost:11434', en: 'Could not connect to Ollama. Is it running? Check with: curl http://localhost:11434' },
	'ollama.models': { es: 'Modelos', en: 'Models' },
	'ollama.quickFix': { es: '⚡ Solución rápida (si Ollama ya está instalado)', en: '⚡ Quick fix (if Ollama is already installed)' },
	'ollama.quickFixDesc': { es: 'Ollama necesita permitir conexiones desde myia.pro. Copia y pega este comando en tu terminal:', en: 'Ollama needs to allow connections from myia.pro. Copy and paste this command in your terminal:' },
	'ollama.quickFixLinux': { es: 'Esto para el servicio y arranca Ollama permitiendo conexiones desde cualquier origen.', en: 'This stops the service and starts Ollama allowing connections from any origin.' },
	'ollama.quickFixWindows': { es: 'Ejecuta en PowerShell. Cierra Ollama de la bandeja del sistema antes.', en: 'Run in PowerShell. Close Ollama from the system tray first.' },
	'ollama.quickFixMac': { es: 'Esto para Ollama y lo reinicia permitiendo conexiones.', en: 'This stops Ollama and restarts it allowing connections.' },
	'ollama.fullInstall': { es: '📖 Instalación completa', en: '📖 Full installation' },
	'ollama.fullInstallDesc': { es: 'Si aún no tienes Ollama instalado, sigue estos pasos', en: 'If you haven\'t installed Ollama yet, follow these steps' },
	'ollama.step1Install': { es: '1. Instalar Ollama:', en: '1. Install Ollama:' },
	'ollama.step1Windows': { es: '1. Descargar e instalar:', en: '1. Download and install:' },
	'ollama.step1WindowsDesc': { es: 'Ve a', en: 'Go to' },
	'ollama.step1WindowsDesc2': { es: ', descarga y ejecuta el instalador de Windows.', en: ', download and run the Windows installer.' },
	'ollama.step1MacAlt': { es: 'O descarga desde', en: 'Or download from' },
	'ollama.step2': { es: '2. Descargar un modelo:', en: '2. Download a model:' },
	'ollama.step2Windows': { es: '2. Descargar un modelo (PowerShell):', en: '2. Download a model (PowerShell):' },
	'ollama.step3Linux': { es: '3. Arrancar con permisos CORS para MyIA Hub:', en: '3. Start with CORS permissions for MyIA Hub:' },
	'ollama.step3Windows': { es: '3. Arrancar con permisos CORS (cierra Ollama de la bandeja primero):', en: '3. Start with CORS permissions (close Ollama from tray first):' },
	'ollama.step3Mac': { es: '3. Arrancar con permisos CORS:', en: '3. Start with CORS permissions:' },
	'ollama.makePermanent': { es: 'Para hacerlo permanente:', en: 'To make it permanent:' },
	'ollama.addLinesAndSave': { es: 'Añade estas líneas y guarda:', en: 'Add these lines and save:' },
	'ollama.restartAfter': { es: 'Reinicia Ollama después.', en: 'Restart Ollama afterwards.' },
	'ollama.makePermanentMac': { es: 'Para hacerlo permanente, añade a ~/.zshrc:', en: 'To make it permanent, add to ~/.zshrc:' },
	'ollama.recommendedModels': { es: 'Modelos recomendados:', en: 'Recommended models:' },
	'ollama.recommendedDesc': { es: 'llama3.2:3b (2GB, rápido), phi4-mini (2.5GB, bueno en código), gemma3:4b (3GB, equilibrado), qwen3:4b (2.5GB, multiidioma). Para PC con más RAM: mistral:7b o deepseek-r1:7b.', en: 'llama3.2:3b (2GB, fast), phi4-mini (2.5GB, good at code), gemma3:4b (3GB, balanced), qwen3:4b (2.5GB, multilingual). For PCs with more RAM: mistral:7b or deepseek-r1:7b.' },
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
