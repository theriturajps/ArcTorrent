const websiteLogos = { // Website logos for spinner container (1337x, YTS, etc.)
	'1337x': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'nyaasi': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'yts': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'tgx': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'torlock': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'piratebay': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'limetorrent': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
	'glodls': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>'
};

async function searchTorrents() { // Search torrents function to fetch torrents from selected website based on search query and page number
	const query = document.getElementById('query').value;
	const selectedWebsite = document.getElementById('selectedText').getAttribute('data-value') || document.getElementById('selectedText').textContent.toLowerCase();
	const page = parseInt(document.getElementById('page').value);
	const resultsDiv = document.getElementById('results');
	const spinnerContainer = document.getElementById('spinner-container');
	const websiteLogo = document.getElementById('website-logo');
	const currentWebsite = document.getElementById('current-website');

	// Validate input
	if (!query.trim()) {
		resultsDiv.innerHTML = `
                    <div class="text-center col-span-full text-yellow-500 bg-yellow-900 bg-opacity-20 p-4 rounded-md w-full max-w-md mx-auto">
                        <div class="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 class="text-lg font-semibold mb-2">No Search Query</h2>
                        <p class="text-sm">Please enter a search query to see results.</p>
                    </div>
                `;
		return;
	}

	// Validate website selection
	const selectedWebsiteItem = document.querySelector('#dropdownList .dropdown-item[data-value="' + selectedWebsite + '"]');
	if (!selectedWebsiteItem) {
		resultsDiv.innerHTML = `
                    <div class="text-center col-span-full text-yellow-500 bg-yellow-900 bg-opacity-20 p-4 rounded-md w-full max-w-md mx-auto">
                        <div class="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 class="text-lg font-semibold mb-2">Website Not Selected</h2>
                        <p class="text-sm">Please select a website from the dropdown to proceed.</p>
                    </div>
                `;
		return;
	}

	// Fetch torrents from selected website
	const website = selectedWebsiteItem.getAttribute('data-value'); // Get selected website value from the dropdown item (1337x, YTS, etc.)

	// Update logo and text based on selected website
	websiteLogo.innerHTML = websiteLogos[website]; // Update logo based on selected website
	currentWebsite.textContent = website.toUpperCase(); // Update website name in loading text

	// Show spinner
	spinnerContainer.style.display = 'flex'; // Show spinner container when search is in progress (loading spinner) with website logo and loading text

	let apiUrl = `https://arc-torrent.vercel.app/api/${website}/${query}/${page}`; // API URL

	try {
		const response = await fetch(apiUrl, {
			method: 'GET', // GET request
			headers: {
				'Content-Type': 'application/json' // JSON response
			},
			timeout: 10000 // 10 seconds timeout
		});

		// Network or server errors
		if (!response.ok) {
			throw new Error(`Network response error: ${response.status}`); // Throw error
		}

		const data = await response.json(); // Parse JSON response

		// Check for empty results
		if (!data || data.length === 0) {
			resultsDiv.innerHTML = `
                        <div class="text-center col-span-full text-yellow-500 bg-yellow-900 bg-opacity-20 p-4 rounded-md w-full max-w-md mx-auto">
                            <div class="flex justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h2 class="text-lg font-semibold mb-2">No Results Found</h2>
                            <p class="text-sm">No results found for "<span class="font-bold">${query}</span>" on <span class="font-bold">${website.toUpperCase()}</span>. Please try again with a different query.</p>
                        </div>
                    `;

			return; // Exit function
		}

		renderResults(website, data); // Render results on the page based on website and data received from API endpoint (1337x, YTS, etc.)

	} catch (error) {
		resultsDiv.innerHTML = `
                    <div class="text-center col-span-full text-yellow-500 bg-yellow-900 bg-opacity-20 p-4 rounded-md w-full max-w-md mx-auto">
                        <div class="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 class="text-lg font-semibold mb-2">Failed to Load Results</h2>
                        <p class="text-sm">
                            ${error.name === 'AbortError' ? 'Request timed out' : 'No search result available for your query due to a network error or the requested page is not available. Please try again later. Thank you!'}
                        </p>
                    </div>
                `;
	} finally {
		spinnerContainer.style.display = 'none'; // Hide spinner after search results are loaded or error occurs (finally block)
	}
}

function renderResults(website, torrents) {
	const resultsDiv = document.getElementById('results'); // Get results container element by ID from the DOM
	resultsDiv.innerHTML = ''; // Clear existing results before rendering new results

	torrents.forEach(torrent => {
		let torrentCard = ''; // Initialize empty card template variable for each torrent result item received from the API endpoint response (1337x, YTS, etc.)
		if (website === '1337x') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-red-700 transform transition-all hover:scale-95 hover:border-red-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[70%]">${torrent.Name}</h3>
                        <span class="bg-gray-800 px-2 py-1 rounded text-xs">${torrent.Category || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'yts') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-blue-700 transform transition-all hover:scale-95 hover:border-blue-500">
                <div class="relative h-48 overflow-hidden">
                    <img src="${(torrent.Poster) || "./assets/image/ImageNotAvailableTransparent.png"}" class="w-full h-full object-cover opacity-70 hover:opacity-100">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <h3 class="text-sm font-bold text-blue-300 truncate">${torrent.Name}</h3>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                <div class="flex justify-between items-center text-xs">
                    <span class="bg-gray-800 px-2 py-1 rounded">${torrent.ReleasedDate || 'N/A'}</span>
                    <span class="text-green-400">${torrent.Language || 'N/A'}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${torrent.Files.map(file => `
                        <a href="${file.Torrent}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">${file.Quality} Torrent</a>
                        <a href="${file.Magnet}" class="bg-green-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-green-700 transition">${file.Quality} Magnet</a>
                    `).join('')}
                </div>
                </div>
            </div>
            `;
		} else if (website === 'nyaasi') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-purple-700 transform transition-all hover:scale-95 hover:border-purple-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[80%]">${torrent.Name}</h3>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <span class="bg-gray-800 px-2 py-1 rounded text-xs">${torrent.Category}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                        <a href="${torrent.Torrent}" class="bg-green-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-green-700 transition">Torrent</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'tgx') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-green-700 transform transition-all hover:scale-95 hover:border-green-500">
                <div class="relative h-48 overflow-hidden">
                    <img src="${(torrent.Poster) || "./assets/image/ImageNotAvailableTransparent.png"}" class="w-full h-full object-cover opacity-70 hover:opacity-100">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <h3 class="text-sm font-bold text-blue-300 truncate">${torrent.Name}</h3>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center text-xs">
                        <span class="bg-gray-800 px-2 py-1 rounded">${(torrent.Category).split(' ')[1] || 'N/A'}</span>
                        <div class="flex items-center space-x-2">
                            <span>Size: ${torrent.Size || '-'}</span>
                            <span class="text-green-400">Seeds: ${torrent.Seeders || '-'}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                        <a href="${torrent.Torrent}" class="bg-green-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-green-700 transition">Torrent</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'torlock') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-red-700 transform transition-all hover:scale-95 hover:border-red-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[70%]">${torrent.Name}</h3>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                        <a href="${torrent.Torrent}" class="bg-green-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-green-700 transition">Torrent</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'piratebay') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-red-700 transform transition-all hover:scale-95 hover:border-red-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[70%]">${torrent.Name}</h3>
                        <span class="bg-gray-800 px-2 py-1 rounded text-xs">${torrent.Category || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'limetorrent') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-red-700 transform transition-all hover:scale-95 hover:border-red-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[70%]">${torrent.Name}</h3>
                        <span class="bg-gray-800 px-2 py-1 rounded text-xs">${torrent.Category || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        <a href="${torrent.Torrent}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Torrent</a>
                    </div>
                </div>
            </div>
            `;
		} else if (website === 'glodls') {
			torrentCard = `
            <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md border-2 border-red-700 transform transition-all hover:scale-95 hover:border-red-500">
                <div class="p-3 space-y-2">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-blue-300 truncate max-w-[70%]">${torrent.Name}</h3>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <div>Size: <span class="font-medium">${torrent.Size || '-'}</span></div>
                        <div>Seeds: <span class="text-green-400 font-bold">${torrent.Seeders || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <a href="${torrent.Torrent}" class="bg-green-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-green-700 transition">Torrent</a>
                        <a href="${torrent.Magnet}" class="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center hover:bg-blue-700 transition">Magnet</a>
                    </div>
                </div>
            </div>
            `;
		}
		resultsDiv.innerHTML += torrentCard; // Append each torrent card to the results container
	});
}

// Keyboard Shortcuts
document.addEventListener('DOMContentLoaded', () => {
	const dropdown = document.getElementById('website');
	const dropdownButton = document.getElementById('dropdownButton');
	const dropdownList = document.getElementById('dropdownList');
	const dropdownItems = document.querySelectorAll('.dropdown-item');
	const selectedText = document.getElementById('selectedText');
	const queryInput = document.getElementById('query');

	// Dropdown functionality
	dropdownButton.addEventListener('click', (e) => {
		dropdownList.classList.toggle('hidden');
	});

	// Select website from dropdown
	dropdownItems.forEach(item => {
		item.addEventListener('click', (e) => {
			const value = e.target.getAttribute('data-value');
			selectedText.textContent = e.target.textContent;
			// Importantly, set the data-value attribute on the selectedText element
			selectedText.setAttribute('data-value', value);
			document.getElementById('dropdownList').classList.add('hidden');
		});
	});

	// Close dropdown when clicked outside
	document.addEventListener('click', (e) => {
		if (!dropdown.contains(e.target)) {
			dropdownList.classList.add('hidden');
		}
	});

	// Add keyboard event listener
	document.addEventListener('keydown', function (event) { // Listen for keyboard events on the document level for global keyboard shortcuts (Ctrl+F, Ctrl+Enter, etc.)

		if ((event.ctrlKey || event.metaKey) && event.key === 'f') { // Ctrl+F or Cmd+F to focus on search input field (query) for quick search access (keyboard shortcut)
			event.preventDefault();
			queryInput.focus();
		}

		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { // Ctrl+Enter or Cmd+Enter to trigger search (keyboard shortcut)
			event.preventDefault();
			searchTorrents();
		}
	});

	// Existing initial page load code
	const resultScrollSection = document.getElementById('resultScrollSection'); // Get the scrollable results section element by ID from the DOM
	const scrollProgress = document.getElementById('scrollProgress'); // Get the scroll progress bar element by ID from the DOM

	resultScrollSection.addEventListener('scroll', () => {
		const { scrollTop, scrollHeight, clientHeight } = resultScrollSection; // Get scroll position, scroll height, and client height of the results section
		const scrollPercentage = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100); // Calculate scroll percentage

		scrollProgress.style.width = `${scrollPercentage}%`; // Update scroll progress bar width based on scroll percentage
	});

	const resultsDiv = document.getElementById('results'); // Get results container element by ID from the DOM

	resultsDiv.innerHTML = `
                <div class="text-center col-span-full text-blue-300 bg-blue-900 bg-opacity-20 p-6 rounded-md space-y-4" style="max-width: 615px; margin: 0 auto;">
                    <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z" /></svg>
                    </div>
                    <h2 class="text-xl font-bold">
                        Welcome to <a href="/" class="text-blue-200">ArcTorrent</a>
                    </h2>
                    <p class="text-sm text-blue-200">
                        Search across multiple torrent websites seamlessly with advanced features and quick access.
                    </p>
                    <div class="grid md:grid-cols-2 gap-4 text-left">
                        <div>
                            <h3 class="font-semibold text-blue-300 mb-2">Available Websites :</h3>
                            <table class="w-full border-collapse text-xs text-gray-300">
                                <tbody>
                                    <tr>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ 1337x</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ YTS</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ Torrent Galaxy</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ Nyaasi</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ Torlock</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ LimeTorrent</td>
                                    </tr>
                                    <tr>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ Torrent Galaxy</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ PirateBay</td>
                                        <td class="p-1 hover:text-blue-300 transition-colors">➧ Glodls</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p class="text-xs text-red-300 mt-2">➠ More coming soon...</p>
                        </div>
                        <div>
                            <h3 class="font-semibold text-blue-300 mb-2">Keyboard Shortcuts :</h3>
                            <ul class="text-xs text-gray-300 space-y-1">
                                <li>➽ <kbd class="bg-gray-700 px-1 rounded">Ctrl/Cmd + F</kbd> : Focus search bar</li>
                                <li>➽ <kbd class="bg-gray-700 px-1 rounded">Ctrl/Cmd + Enter</kbd> : Trigger search</li>
                                <li>➽ <kbd class="bg-gray-700 px-1 rounded">Enter</kbd> : Instant search results</li>
                            </ul>
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 italic mt-4">
                        <strong>Pro Tip :</strong> Press Enter after typing your search query for instant results
                    </div>
                </div>
            `;

});

document.getElementById('query').addEventListener('keypress', function (event) { // Listen for 'Enter' key press on search input field (query) for instant search results (keyboard shortcut)
	if (event.key === 'Enter') {
		event.preventDefault();
		searchTorrents();
	}
});

document.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click
document.addEventListener('keydown', (e) => {
	if ( // Disable specific key combinations like Ctrl+U, Ctrl+Shift+I (Inspect Element), Ctrl+S (Save Page), Ctrl+P (Print)
		(e.ctrlKey && e.key === 'u') || // View Source
		(e.ctrlKey && e.shiftKey && e.key === 'i') || // DevTools
		(e.ctrlKey && e.key === 's') || // Save Page
		(e.ctrlKey && e.key === 'p')    // Print
	) {
		e.preventDefault(); // Prevent default action for the above key combinations (Ctrl+U, Ctrl+Shift+I, Ctrl+S, Ctrl+P)
	}
});

function shareWebsite() { // Share website function
	const shareMessage = "Check out ArcTorrent - A powerful torrent search aggregator!";
	const websiteUrl = window.location.href; // Get current website URL for sharing (window.location.href)

	if (navigator.share) {
		navigator.share({
			title: 'ArcTorrent',
			text: shareMessage,
			url: websiteUrl
		}).catch(console.error);
	} else {
		const tempInput = document.createElement('input');
		tempInput.value = `${shareMessage} ${websiteUrl}`;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);
	}
}

function refreshPage() {
	location.reload();
}