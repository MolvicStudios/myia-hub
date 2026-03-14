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
	<p class="text-sm text-slate-500 mb-8">Última actualización: 14 de marzo de 2026</p>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">1. ¿Qué son las cookies?</h2>
		<p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador. Permiten recordar información sobre tu visita, como tu idioma preferido y otras opciones de configuración. Existen también otras tecnologías de almacenamiento local (localStorage, IndexedDB) que cumplen funciones similares.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">2. Titular del sitio web</h2>
		<p>El presente sitio web <strong>myia.pro</strong> (en adelante, "MyIA Hub") está ubicado en España y se rige por la normativa española y europea, en particular el Reglamento (UE) 2016/679 (RGPD) y la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE).</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">3. Almacenamiento local que utilizamos</h2>
		<p>MyIA Hub utiliza tecnologías de almacenamiento local del navegador estrictamente necesarias para el funcionamiento de la aplicación:</p>

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
						<td class="px-4 py-2">Preferencias (tema, modelo, API keys, consentimiento de cookies)</td>
						<td class="px-4 py-2">Técnica / Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
					<tr>
						<td class="px-4 py-2">IndexedDB</td>
						<td class="px-4 py-2">Historial de chats y memoria de la aplicación</td>
						<td class="px-4 py-2">Técnica / Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
					<tr>
						<td class="px-4 py-2">Cache API</td>
						<td class="px-4 py-2">Service Worker para funcionamiento offline (PWA)</td>
						<td class="px-4 py-2">Técnica / Necesaria</td>
						<td class="px-4 py-2">Persistente</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-3 text-sm text-slate-400">Estas tecnologías son estrictamente necesarias y están exentas de la obligación de consentimiento según el artículo 22.2 de la LSSI-CE, ya que son imprescindibles para la prestación del servicio.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">4. Cookies de terceros (publicidad)</h2>
		<p>MyIA Hub se monetiza exclusivamente mediante la red publicitaria <strong>Monetag</strong> (anteriormente PropellerAds). Monetag y sus socios tecnológicos pueden instalar cookies o utilizar tecnologías de seguimiento en tu navegador con los siguientes fines:</p>

		<div class="mt-4 overflow-x-auto">
			<table class="w-full text-sm border border-slate-700 rounded-lg">
				<thead class="bg-slate-800">
					<tr>
						<th class="px-4 py-2 text-left text-white">Proveedor</th>
						<th class="px-4 py-2 text-left text-white">Propósito</th>
						<th class="px-4 py-2 text-left text-white">Tipo</th>
						<th class="px-4 py-2 text-left text-white">Más información</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					<tr>
						<td class="px-4 py-2">Monetag</td>
						<td class="px-4 py-2">Mostrar anuncios personalizados o contextuales, medición de rendimiento publicitario</td>
						<td class="px-4 py-2">Publicitaria</td>
						<td class="px-4 py-2"><a href="https://monetag.com/privacy-policy/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">Política de privacidad</a></td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-3 text-sm text-slate-400">Estas cookies requieren tu consentimiento previo. No se activarán hasta que aceptes su uso a través del banner de cookies.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">5. Base legal del tratamiento</h2>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Cookies técnicas/necesarias:</strong> Interés legítimo y necesidad para la prestación del servicio (art. 6.1.f RGPD; art. 22.2 LSSI-CE).</li>
			<li><strong>Cookies publicitarias (Monetag):</strong> Consentimiento expreso del usuario (art. 6.1.a RGPD; art. 22.1 LSSI-CE).</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">6. Cómo gestionar las cookies</h2>
		<p>Puedes controlar y gestionar las cookies de las siguientes formas:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Banner de cookies:</strong> Al acceder al sitio por primera vez, puedes aceptar o rechazar las cookies no esenciales. Puedes cambiar tu elección en cualquier momento desde la <a href="/cookies" class="text-blue-400 hover:underline">página de cookies</a>.</li>
			<li><strong>Configuración del navegador:</strong> Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Consulta la ayuda de tu navegador para más información.</li>
			<li><strong>Your Online Choices:</strong> Visita <a href="https://www.youronlinechoices.com/es/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">youronlinechoices.com/es</a> para gestionar las cookies de muchos proveedores de publicidad.</li>
			<li><strong>Borrar datos locales:</strong> Para eliminar todos los datos almacenados por la aplicación, usa la opción "Borrar datos de sitio" en la configuración de tu navegador.</li>
		</ul>
		<p class="mt-3 text-amber-400 text-sm">⚠️ Ten en cuenta que bloquear el almacenamiento local impedirá el funcionamiento correcto de la aplicación (se perderán chats, preferencias y API keys).</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">7. Transferencias internacionales de datos</h2>
		<p>Monetag puede transferir datos a servidores situados fuera del Espacio Económico Europeo. En tal caso, se aplican las garantías previstas en el RGPD (cláusulas contractuales tipo, decisiones de adecuación, etc.). Puedes consultar más detalles en la <a href="https://monetag.com/privacy-policy/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">política de privacidad de Monetag</a>.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">8. Cambios en esta política</h2>
		<p>Nos reservamos el derecho de actualizar esta política en cualquier momento. Publicaremos cualquier cambio en esta página con la fecha de última revisión actualizada.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">9. Contacto</h2>
		<p>Para consultas sobre cookies o el tratamiento de tus datos, contacta a través de nuestro <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">repositorio en GitHub</a>.</p>
	</section>

	<p class="text-sm text-slate-500 mt-8">Consulta también nuestra <a href="/privacy" class="text-blue-400 hover:underline">Política de Privacidad</a>.</p>
</main>
