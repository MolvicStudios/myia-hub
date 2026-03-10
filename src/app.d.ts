/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Platform {
		env?: {
			OPENAI_API_KEY?: string;
			ANTHROPIC_API_KEY?: string;
		};
	}
}
