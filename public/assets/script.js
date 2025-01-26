const ALLOWED_DOMAINS = [
	'arc-torrent.vercel.app',
	'localhost'
];

function checkDomainSecurity() {
	const currentHost = window.location.hostname;
	const isAllowedDomain = ALLOWED_DOMAINS.some(domain =>
		currentHost === domain || currentHost.endsWith('.' + domain)
	);

	if (!isAllowedDomain) {
		// Clear previous content from head and body
		document.head.innerHTML = ``;
		document.body.innerHTML = ``

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
		document.head.appendChild(link);

		document.body.innerHTML = `
			<div class="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
				<div class="max-w-md w-full bg-red-900 bg-opacity-30 border-2 border-red-700 rounded-lg p-6 text-center">
					<div class="mb-6">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-red-300 mb-4">Unauthorized Access Detected</h2>
					<p class="text-red-200 mb-6">
						This application is protected and can only be accessed from authorized domains. 
						If you believe this is an error, please contact the site administrator.
					</p>
					<div class="bg-red-800 bg-opacity-50 p-4 rounded-md mb-6">
						<p class="text-red-200 text-sm">
							<strong>Current Host:</strong> ${currentHost}<br>
							<strong>Allowed Domains:</strong> ${ALLOWED_DOMAINS.join(', ')}
						</p>
					</div>
					<div class="flex justify-center space-x-4">
						<a href="https://arc-torrent.vercel.app" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
							Go to Official Site
						</a>
					</div>
				</div>
			</div>
		`;
		return false;
	}
	return true;
}

// Intercept and block script access
function blockScriptAccess() {
	const scripts = document.getElementsByTagName('script');
	for (let script of scripts) {
		if (script.src) {
			const scriptUrl = new URL(script.src);
			const isAllowedDomain = ALLOWED_DOMAINS.some(domain =>
				scriptUrl.hostname === domain || scriptUrl.hostname.endsWith('.' + domain)
			);

			if (!isAllowedDomain) {
				script.remove();
				console.warn('Blocked script from unauthorized domain:', scriptUrl.href);
			}
		}
	}
}

// Add event listeners to run security checks
document.addEventListener('DOMContentLoaded', () => {
	if (!checkDomainSecurity()) {
		return;
	}
	blockScriptAccess();
});

// Prevent direct source code theft
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
	if ((e.ctrlKey && e.shiftKey && e.key === 'I') || // DevTools
		(e.ctrlKey && e.key === 'U') ||  // View Source
		(e.ctrlKey && e.key === 'S')) { // Save
		e.preventDefault();
	}
});