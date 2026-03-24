/// <reference types="@sveltejs/kit" />
declare App {
	interface Platform {
		env?: { OPENAI_API_KEY?: string; ANTHROPIC_API_KEY?: string }
	}
}

declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties
		}
	}
}
