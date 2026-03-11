<script lang="ts">
	import { i18n } from '$lib/stores/i18nStore';

	interface Props {
		onuse?: (prompt: string) => void;
	}

	let { onuse }: Props = $props();

	const PROMPTS_ES = [
		'Explícame la computación cuántica como si tuviera 10 años',
		'Escribe un poema corto sobre inteligencia artificial',
		'¿Cuáles son las 5 tendencias tecnológicas más importantes de 2026?',
		'Compara los pros y contras de trabajar remoto vs presencial',
		'Dame 3 ideas creativas para un proyecto con IA',
		'¿Cómo funciona una red neuronal? Resúmelo en 3 párrafos',
		'Escribe un cuento de 100 palabras sobre un robot que aprende a soñar',
		'¿Qué lenguaje de programación debería aprender primero y por qué?',
		'Dame 5 recetas rápidas y saludables para cenar',
		'Explica la teoría de la relatividad de forma sencilla',
		'¿Cuáles son los mejores hábitos para ser más productivo?',
		'Crea un plan de estudio de 30 días para aprender Python',
		'¿Qué diferencias hay entre machine learning y deep learning?',
		'Escribe un haiku sobre el amanecer',
		'Dame ideas para automatizar tareas repetitivas con IA'
	];

	const PROMPTS_EN = [
		'Explain quantum computing as if I were 10 years old',
		'Write a short poem about artificial intelligence',
		'What are the 5 most important tech trends of 2026?',
		'Compare the pros and cons of remote vs in-office work',
		'Give me 3 creative project ideas using AI',
		'How does a neural network work? Summarize in 3 paragraphs',
		'Write a 100-word story about a robot learning to dream',
		'Which programming language should I learn first and why?',
		'Give me 5 quick and healthy dinner recipes',
		'Explain the theory of relativity simply',
		'What are the best habits for being more productive?',
		'Create a 30-day study plan to learn Python',
		'What are the differences between machine learning and deep learning?',
		'Write a haiku about sunrise',
		'Give me ideas for automating repetitive tasks with AI'
	];

	function getDailyPrompt(locale: string): string {
		const prompts = locale === 'en' ? PROMPTS_EN : PROMPTS_ES;
		const day = Math.floor(Date.now() / 86400000);
		return prompts[day % prompts.length];
	}

	let dailyPrompt = $derived(getDailyPrompt($i18n('app.title') === 'MyIA Hub' ? 'es' : 'en'));
</script>

<div class="w-full max-w-lg">
	<button
		type="button"
		class="w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 hover:border-slate-600/50 rounded-xl transition-all duration-200 group"
		onclick={() => onuse?.(dailyPrompt)}
	>
		<div class="flex items-center gap-2 mb-1">
			<span class="text-xs">💡</span>
			<span class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Prompt del día</span>
		</div>
		<p class="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
			"{dailyPrompt}"
		</p>
	</button>
</div>
