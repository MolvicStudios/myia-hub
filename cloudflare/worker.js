/**
 * Cloudflare Worker — API proxy for MyIA Hub.
 * Proxies requests to AI model APIs, adding server-side API keys if configured.
 * This keeps user API keys safe and allows optional server-managed keys.
 * Includes per-IP rate limiting.
 */

const ALLOWED_ORIGINS = [
	'https://myia.pro',
	'https://myia-hub.pages.dev',
	'http://localhost:5173',
	'http://localhost:4173'
];

/* ── Rate limiting (in-memory, per isolate) ── */
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30;        // max requests per window
const ipHits = new Map();         // ip → { count, resetAt }

function isRateLimited(ip) {
	const now = Date.now();
	let entry = ipHits.get(ip);
	if (!entry || now > entry.resetAt) {
		entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
	}
	entry.count++;
	ipHits.set(ip, entry);
	// Periodically clean old entries
	if (ipHits.size > 5000) {
		for (const [k, v] of ipHits) {
			if (now > v.resetAt) ipHits.delete(k);
		}
	}
	return entry.count > RATE_LIMIT_MAX;
}

function getCorsHeaders(request) {
	const origin = request.headers.get('Origin') || '';
	const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
	return {
		'Access-Control-Allow-Origin': allowedOrigin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
	};
}

const PROVIDER_ENDPOINTS = {
	openai: 'https://api.openai.com/v1/chat/completions',
	anthropic: 'https://api.anthropic.com/v1/messages',
	gemini: 'https://generativelanguage.googleapis.com/v1beta',
	mistral: 'https://api.mistral.ai/v1/chat/completions',
	deepseek: 'https://api.deepseek.com/chat/completions',
	groq: 'https://api.groq.com/openai/v1/chat/completions',
	openrouter: 'https://openrouter.ai/api/v1/chat/completions',
	ollama: null // resolved from env.OLLAMA_ENDPOINT
};

export default {
	async fetch(request, env) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: getCorsHeaders(request) });
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(request) });
		}

		// Rate limiting
		const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
		if (isRateLimited(clientIp)) {
			return new Response(JSON.stringify({ error: 'Demasiadas peticiones. Espera un minuto.' }), {
				status: 429,
				headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json', 'Retry-After': '60' }
			});
		}

		const url = new URL(request.url);
		const provider = url.pathname.replace('/api/', '').replace('/', '');

		if (!(provider in PROVIDER_ENDPOINTS)) {
			return new Response(JSON.stringify({ error: `Unknown provider: ${provider}` }), {
				status: 400,
				headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
			});
		}

		try {
			const body = await request.text();
			const clientApiKey = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
			// Prefer server-side env key, fallback to client key
			const envKey = env[`${provider.toUpperCase()}_API_KEY`] || '';
			const apiKey = envKey || clientApiKey;

			if (!apiKey && provider !== 'ollama') {
				return new Response(JSON.stringify({ error: 'No API key provided' }), {
					status: 401,
					headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
				});
			}

			const headers = { 'Content-Type': 'application/json' };
			let forwardBody = body;

			if (provider === 'anthropic') {
				headers['x-api-key'] = apiKey;
				headers['anthropic-version'] = '2024-10-22';
			} else if (provider !== 'ollama') {
				headers['Authorization'] = `Bearer ${apiKey}`;
			}

			if (provider === 'openrouter') {
				headers['HTTP-Referer'] = 'https://myia-hub.pages.dev';
				headers['X-Title'] = 'MyIA Hub';
			}

			let targetUrl;

			if (provider === 'gemini') {
				const parsed = JSON.parse(body);
				const base = `${PROVIDER_ENDPOINTS[provider]}/models/${parsed.model}`;
				if (parsed.stream) {
					targetUrl = `${base}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
				} else {
					targetUrl = `${base}:generateContent?key=${encodeURIComponent(apiKey)}`;
				}
				// Strip model and stream — forward only Gemini-native fields (contents, systemInstruction, generationConfig, etc.)
				const { model: _m, stream: _s, ...geminiBody } = parsed;
				forwardBody = JSON.stringify(geminiBody);
				// Gemini uses key in URL, not Authorization header
				delete headers['Authorization'];
			} else if (provider === 'ollama') {
				const ollamaEndpoint = env.OLLAMA_ENDPOINT;
				if (!ollamaEndpoint) {
					return new Response(JSON.stringify({ error: 'Los modelos Ollama requieren un servidor local. Ejecuta Ollama en tu máquina y usa la app en localhost:5173, o configura OLLAMA_ENDPOINT en el Worker.' }), {
						status: 503,
						headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
					});
				}
				targetUrl = `${ollamaEndpoint}/api/chat`;
			} else {
				targetUrl = PROVIDER_ENDPOINTS[provider];
			}

			const response = await fetch(targetUrl, {
				method: 'POST',
				headers,
				body: forwardBody
			});

			const responseHeaders = { ...getCorsHeaders(request) };
			// Forward streaming headers if present
			if (response.headers.get('content-type')) {
				responseHeaders['Content-Type'] = response.headers.get('content-type');
			}

			return new Response(response.body, {
				status: response.status,
				headers: responseHeaders
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message || 'Proxy error' }), {
				status: 500,
				headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
			});
		}
	}
};
