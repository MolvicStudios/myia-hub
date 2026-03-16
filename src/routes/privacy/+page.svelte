<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Política de Privacidad — MyIA Hub</title>
	<meta name="description" content="Política de privacidad de MyIA Hub. Información sobre cómo tratamos tus datos." />
</svelte:head>

<main id="main-content" class="max-w-3xl mx-auto px-4 py-12 text-slate-300 leading-relaxed overflow-y-auto h-full">
	<a href="/" class="text-blue-400 hover:underline text-sm mb-6 inline-block">← Volver al chat</a>

	<h1 class="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>
	<p class="text-sm text-slate-500 mb-8">Última actualización: 14 de marzo de 2026</p>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
		<p>MyIA Hub (en adelante, "la Aplicación") es un servicio web accesible desde <strong>myia.pro</strong>, ubicado en España. El responsable del tratamiento de los datos es el titular del sitio web.</p>
		<p class="mt-2">Contacto: a través del <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">repositorio en GitHub</a>.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">2. Normativa aplicable</h2>
		<p>El tratamiento de datos se rige por:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li>Reglamento (UE) 2016/679 General de Protección de Datos (RGPD).</li>
			<li>Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD).</li>
			<li>Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">3. Datos que recopilamos</h2>
		<p>La Aplicación recopila la mínima cantidad de datos necesaria para su funcionamiento:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>API Keys:</strong> Se almacenan exclusivamente en el almacenamiento local de tu navegador (localStorage). Nunca se envían a nuestros servidores.</li>
			<li><strong>Historial de chats:</strong> Se almacena localmente en tu navegador (IndexedDB). No se transmite ni se almacena en servidores propios.</li>
			<li><strong>Preferencias:</strong> Tema, modelo por defecto, idioma y otras configuraciones se guardan en localStorage.</li>
			<li><strong>Consentimiento de cookies:</strong> Tu elección sobre las cookies se almacena en localStorage.</li>
		</ul>
		<p class="mt-2 text-sm text-slate-400">Ninguno de estos datos se envía ni almacena en servidores del responsable del sitio web.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">4. Finalidad y base legal del tratamiento</h2>
		<div class="mt-2 overflow-x-auto">
			<table class="w-full text-sm border border-slate-700 rounded-lg">
				<thead class="bg-slate-800">
					<tr>
						<th class="px-4 py-2 text-left text-white">Finalidad</th>
						<th class="px-4 py-2 text-left text-white">Base legal</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					<tr>
						<td class="px-4 py-2">Funcionamiento de la aplicación (almacenamiento local)</td>
						<td class="px-4 py-2">Interés legítimo (art. 6.1.f RGPD)</td>
					</tr>
					<tr>
						<td class="px-4 py-2">Comunicación con proveedores de IA</td>
						<td class="px-4 py-2">Ejecución del servicio solicitado (art. 6.1.b RGPD)</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">5. Uso de los datos</h2>
		<p>Los mensajes que envías se transmiten directamente al proveedor de IA que selecciones (OpenAI, Anthropic, Google, Mistral, etc.) a través de nuestro proxy seguro alojado en Cloudflare Workers. Cada proveedor tiene su propia política de privacidad que te recomendamos revisar.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">6. Publicidad</h2>
		<p>MyIA Hub no utiliza redes publicitarias ni muestra anuncios. No se instalan cookies publicitarias ni tecnologías de seguimiento con fines comerciales.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">7. Compartición de datos con terceros</h2>
		<p>No vendemos ni compartimos tus datos personales. Los únicos terceros que pueden recibir información son:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Proveedores de IA:</strong> Reciben los mensajes que envías para generar respuestas (OpenAI, Anthropic, Google, Mistral, DeepSeek, Groq).</li>
			<li><strong>Cloudflare:</strong> Aloja el proxy de la aplicación. Puede recopilar datos técnicos (IP, user-agent) según su <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">política de privacidad</a>.</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">8. Transferencias internacionales</h2>
		<p>Algunos de los terceros mencionados pueden estar ubicados fuera del Espacio Económico Europeo. En tales casos, se aplican las garantías adecuadas previstas en el RGPD (cláusulas contractuales tipo, decisiones de adecuación de la Comisión Europea, etc.).</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">9. Tus derechos</h2>
		<p>De acuerdo con el RGPD y la LOPDGDD, tienes derecho a:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Acceso:</strong> Conocer qué datos tuyos se tratan.</li>
			<li><strong>Rectificación:</strong> Corregir datos inexactos.</li>
			<li><strong>Supresión:</strong> Solicitar la eliminación de tus datos.</li>
			<li><strong>Limitación:</strong> Restringir el tratamiento en determinadas circunstancias.</li>
			<li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado.</li>
			<li><strong>Oposición:</strong> Oponerte al tratamiento basado en interés legítimo.</li>
			<li><strong>Retirada del consentimiento:</strong> Puedes retirar tu consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento previo.</li>
		</ul>
		<p class="mt-3">Dado que todos los datos de la aplicación se almacenan localmente en tu navegador, puedes ejercer estos derechos directamente borrando los datos del sitio desde la configuración del navegador.</p>
		<p class="mt-2">Si consideras que tus derechos no han sido debidamente atendidos, tienes derecho a presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">Agencia Española de Protección de Datos (AEPD)</a>.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">10. Seguridad</h2>
		<p>Todas las comunicaciones se realizan a través de HTTPS. Las API keys se transmiten cifradas y nunca se almacenan en nuestros servidores. Aplicamos medidas técnicas adecuadas para proteger la integridad y confidencialidad de los datos.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">11. Menores de edad</h2>
		<p>La Aplicación no está dirigida a menores de 14 años. No recopilamos intencionalmente datos de menores. Si eres menor de 14 años, no utilices este servicio sin el consentimiento de tu padre, madre o tutor legal.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">12. Cambios en esta política</h2>
		<p>Nos reservamos el derecho de modificar esta política en cualquier momento. Las actualizaciones se publicarán en esta misma página con la fecha de última revisión actualizada.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">13. Contacto</h2>
		<p>Para cualquier consulta relacionada con la privacidad o el ejercicio de tus derechos, puedes contactarnos a través de nuestro repositorio en <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">GitHub</a>.</p>
	</section>

	<p class="text-sm text-slate-500 mt-8">Consulta también nuestra <a href="/cookies" class="text-blue-400 hover:underline">Política de Cookies</a>.</p>
</main>
