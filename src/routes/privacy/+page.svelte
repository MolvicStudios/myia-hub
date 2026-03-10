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
	<p class="text-sm text-slate-500 mb-8">Última actualización: 10 de marzo de 2026</p>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
		<p>MyIA Hub (en adelante, "la Aplicación") es un servicio accesible desde <strong>myia.pro</strong>. El responsable del tratamiento de los datos es el titular de la web.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">2. Datos que recopilamos</h2>
		<p>La Aplicación recopila la mínima cantidad de datos necesaria:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>API Keys:</strong> Se almacenan exclusivamente en el almacenamiento local de tu navegador (localStorage). Nunca se envían a nuestros servidores.</li>
			<li><strong>Historial de chats:</strong> Se almacena localmente en tu navegador (IndexedDB). No se transmite ni se almacena en servidores externos.</li>
			<li><strong>Preferencias:</strong> Tema, modelo por defecto y otras configuraciones se guardan en localStorage.</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">3. Uso de los datos</h2>
		<p>Los mensajes que envías se transmiten al proveedor de IA que selecciones (OpenAI, Anthropic, Google, etc.) a través de nuestro proxy seguro. Cada proveedor tiene su propia política de privacidad que te recomendamos revisar.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">4. Cookies y tecnologías similares</h2>
		<p>La Aplicación utiliza:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Almacenamiento local (localStorage/IndexedDB):</strong> Para guardar tus preferencias y chats. Son estrictamente necesarios para el funcionamiento.</li>
			<li><strong>Cookies de terceros (Google AdSense):</strong> Utilizamos Google AdSense para mostrar anuncios. Google puede utilizar cookies para personalizar anuncios basándose en tu historial de navegación. Puedes obtener más información en la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">política de privacidad de Google</a>.</li>
		</ul>
		<p class="mt-2">Para más detalles, consulta nuestra <a href="/cookies" class="text-blue-400 hover:underline">Política de Cookies</a>.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">5. Compartición de datos</h2>
		<p>No vendemos ni compartimos tus datos personales. Los únicos terceros que reciben información son:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li><strong>Proveedores de IA:</strong> Reciben los mensajes que envías para generar respuestas.</li>
			<li><strong>Cloudflare:</strong> Aloja la aplicación y el proxy. Puede recopilar datos técnicos (IP, user-agent) según su política de privacidad.</li>
			<li><strong>Google AdSense:</strong> Para la entrega de publicidad contextual.</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">6. Tus derechos</h2>
		<p>De acuerdo con el RGPD, tienes derecho a:</p>
		<ul class="list-disc pl-6 mt-2 space-y-1">
			<li>Acceder, rectificar o eliminar tus datos.</li>
			<li>Dado que todos los datos se almacenan localmente, puedes eliminarlos borrando los datos del navegador.</li>
			<li>Desactivar las cookies de publicidad a través de la configuración de tu navegador o en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">Configuración de anuncios de Google</a>.</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">7. Seguridad</h2>
		<p>Las comunicaciones se realizan a través de HTTPS. Las API keys se transmiten cifradas y nunca se almacenan en nuestros servidores.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">8. Cambios en esta política</h2>
		<p>Nos reservamos el derecho de modificar esta política. Las actualizaciones se publicarán en esta misma página con la fecha de última revisión.</p>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-white mb-3">9. Contacto</h2>
		<p>Para cualquier consulta relacionada con la privacidad, puedes contactarnos a través de nuestro repositorio en <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">GitHub</a>.</p>
	</section>
</main>
