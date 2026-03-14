<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Política de Cookies — MyIA Hub</title>
	<meta name="description" content="Política de cookies de MyIA Hub. Información sobre las cookies y tecnologías de almacenamiento que utilizamos." />
</svelte:head>

<main id="main-content" class="max-w-3xl mx-auto px-4 py-12 text-slate-300 leading-relaxed overflow-y-auto h-full">
	<a href="/" class="text-blue-400 hover:underline text-sm mb-6 inline-block">← Volver al chat</a>

	<h1 class="text-3xl font-bold text-white mb-8">Política de Cookies</h1>
	<p class="text-sm text-slate-500 mb-8">Última actualización: 10 de marzo de 2026</p>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">1. ¿Qué son las cookies?</h2>
		<p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador. Permiten recordar información sobre tu visita, como tu idioma preferido y otras opciones de configuración.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">2. Almacenamiento local que utilizamos</h2>
		<p>MyIA Hub utiliza principalmente tecnologías de almacenamiento local del navegador:</p>

		<div class="mt-4 overflow-x-auto">
			<table class="w-full text-sm border border-slate-700 rounded-lg">
				<thead class="bg-slate-800">
					<tr>
						<th class="px-4 py-2 text-left text-white">Tecnología</th>
						<th class="px-4 py-2 text-left text-white">Propósito</th>
						<th class="px-4 py-2 text-left text-white">Tipo</th>
						<th class="px-4 py-2 text-left text-white">Duración</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					<tr>
						<td class="px-4 py-2">localStorage</td>
						<td class="px-4 py-2">Preferencias (tema, modelo, API keys)</td>
						<td class="px-4 py-2">Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
					<tr>
						<td class="px-4 py-2">IndexedDB</td>
						<td class="px-4 py-2">Historial de chats y memoria</td>
						<td class="px-4 py-2">Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
					<tr>
						<td class="px-4 py-2">Cache API</td>
						<td class="px-4 py-2">Service Worker para funcionamiento offline</td>
						<td class="px-4 py-2">Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">3. Cookies de terceros</h2>
		<p>Utilizamos los siguientes servicios de terceros que pueden establecer sus propias cookies:</p>

		<div class="mt-4 overflow-x-auto">
			<table class="w-full text-sm border border-slate-700 rounded-lg">
				<thead class="bg-slate-800">
					<tr>
						<th class="px-4 py-2 text-left text-white">Servicio</th>
						<th class="px-4 py-2 text-left text-white">Proveedor</th>
						<th class="px-4 py-2 text-left text-white">Propósito</th>
						<th class="px-4 py-2 text-left text-white">Más info</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					<tr>
						<td class="px-4 py-2">InMobi Choice (CMP)</td>
						<td class="px-4 py-2">InMobi / The Moneytizer</td>
						<td class="px-4 py-2">Gestión del consentimiento (TCF 2.3)</td>
						<td class="px-4 py-2"><a href="https://www.inmobi.com/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">Ver política</a></td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">4. Gestión del consentimiento</h2>
		<p>Utilizamos InMobi Choice como plataforma de gestión del consentimiento (CMP) conforme al marco TCF 2.3, lo que te permite controlar qué cookies aceptas.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">5. Cómo gestionar las cookies</h2>
		<p>Puedes controlar y gestionar las cookies de varias formas:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Configuración del navegador:</strong> Puedes bloquear o eliminar cookies desde la configuración de tu navegador.</li>
			<li><strong>Your Online Choices:</strong> Visita <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">youronlinechoices.com</a> para gestionar las cookies de muchos proveedores de publicidad.</li>
			<li><strong>Borrar datos locales:</strong> Para eliminar los datos de la aplicación, puedes usar la opción "Borrar datos de sitio" en la configuración de tu navegador.</li>
		</ul>
		<p class="mt-3 text-amber-400 text-sm">⚠️ Ten en cuenta que bloquear el almacenamiento local impedirá el funcionamiento correcto de la aplicación (se perderán chats, preferencias y API keys).</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">6. Cambios en esta política</h2>
		<p>Nos reservamos el derecho de actualizar esta política. Publicaremos cualquier cambio en esta página con la fecha de última revisión.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">7. Contacto</h2>
		<p>Para consultas sobre cookies, contacta a través de nuestro <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">repositorio en GitHub</a>.</p>
	</section>

	<p class="text-sm text-slate-500 mt-8">Consulta también nuestra <a href="/privacy" class="text-blue-400 hover:underline">Política de Privacidad</a>.</p>
</main>
