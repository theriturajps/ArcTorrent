// Play sound effect function
function playTapSound() {
    const tapSound = new Audio('./assets/click.mp3');
    tapSound.volume = 0.3;
    tapSound.play().catch(err => console.log('Audio play failed:', err));
}

const websiteLogos = {
    '1337x': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'nyaasi': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'yts': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'tgx': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'torlock': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'piratebay': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'limetorrent': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>',
    'glodls': '<path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10 5 10-5v7l-10 5z"/>'
};

async function searchTorrents() {
    playTapSound(); // Play sound when search is triggered

    const query = document.getElementById('query').value;
    const selectedWebsite = document.getElementById('selectedText').getAttribute('data-value') || document.getElementById('selectedText').textContent.toLowerCase();
    const page = parseInt(document.getElementById('page').value);
    const resultsDiv = document.getElementById('results');
    const spinnerContainer = document.getElementById('spinner-container');
    const websiteLogo = document.getElementById('website-logo');
    const currentWebsite = document.getElementById('current-website');

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

    const website = selectedWebsiteItem.getAttribute('data-value');
    websiteLogo.innerHTML = websiteLogos[website];
    currentWebsite.textContent = website.toUpperCase();
    spinnerContainer.style.display = 'flex';

    let apiUrl = `https://arc-torrent.vercel.app/api/${website}/${query}/${page}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`Network response error: ${response.status}`);
        }

        const data = await response.json();

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
            return;
        }

        renderResults(website, data);

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
        spinnerContainer.style.display = 'none';
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
    const pageInput = document.getElementById('page');

    // Add sound to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', playTapSound);
    });

    // Add sound to input fields on focus
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', playTapSound);
    });

    // Dropdown functionality with sound
    dropdownButton.addEventListener('click', (e) => {
        playTapSound();
        dropdownList.classList.toggle('hidden');
    });

    // Select website from dropdown with sound
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            playTapSound();
            const value = e.target.getAttribute('data-value');
            selectedText.textContent = e.target.textContent;
            selectedText.setAttribute('data-value', value);
            dropdownList.classList.add('hidden');
        });
    });

    // Close dropdown when clicked outside
    document.addEventListener('click', (e) => {
        playTapSound();
        if (!dropdown.contains(e.target)) {
            dropdownList.classList.add('hidden');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            playTapSound();
            queryInput.focus();
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            playTapSound();
            searchTorrents();
        }
    });

    // Scroll progress functionality
    const resultScrollSection = document.getElementById('resultScrollSection');
    const scrollProgress = document.getElementById('scrollProgress');

    resultScrollSection.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = resultScrollSection;
        const scrollPercentage = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100);
        scrollProgress.style.width = `${scrollPercentage}%`;
    });

    // Initial welcome message
    const resultsDiv = document.getElementById('results');
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

// Enter key search trigger with sound
document.getElementById('query').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        playTapSound();
        searchTorrents();
    }
});

// Security measures
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'i') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'p')
    ) {
        e.preventDefault();
    }
});

// Share website function with sound
function shareWebsite() {
    playTapSound();
    const shareMessage = "Check out ArcTorrent - A powerful torrent search aggregator!";
    const websiteUrl = window.location.href;

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

// Refresh page function with sound
function refreshPage() {
    playTapSound();
    location.reload();
}