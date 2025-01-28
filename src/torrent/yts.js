const axios = require('axios');

async function torrentYts(query, page = '1') {
	let all = [];
	let ALLURL = [];
	const baseUrl = "https://en.yts-official.mx";
	const url = page === '' || page === '1'
		? `${baseUrl}/browse-movies?keyword=${query}&quality=all&genre=all&rating=0&year=0&order_by=latest`
		: `${baseUrl}/browse-movies?keyword=${query}&quality=all&genre=all&rating=0&year=0&order_by=latest&page=${page}`;

	try {
		const html = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36"
			}
		});

		// Extract movie URLs
		const urlRegex = /<div class="browse-movie-bottom">.*?<a href="([^"]+)".*?<\/div>/gs;
		const matches = [...html.data.matchAll(urlRegex)];
		ALLURL = matches.map(match => `${baseUrl}${match[1]}`);

		await Promise.all(ALLURL.map(async (url) => {
			const data = {
				Name: null,
				ReleasedDate: null,
				Genre: null,
				Rating: null,
				Likes: null,
				Runtime: null,
				Language: null,
				Url: null,
				Poster: null,
				Files: []
			};

			try {
				const response = await axios.get(url);
				const htmlContent = response.data;

				// Extract basic movie details
				data.Name = extractValue(htmlContent, /<div class="hidden-xs">.*?<h1[^>]*>(.*?)<\/h1>/s);
				data.ReleasedDate = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>(.*?)<\/h2>/s);
				data.Genre = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>.*?<\/h2>.*?<h2[^>]*>(.*?)<\/h2>/s);
				data.Rating = extractValue(htmlContent, /<div class="bottom-info".*?rating-row[^>]*>.*?<span[^>]*>(.*?)<\/span>/s);
				data.Rating = data.Rating ? `${data.Rating.trim()} ⭐` : 'Not Rated';
				data.Likes = extractValue(htmlContent, /<div class="bottom-info".*?rating-row.*?<span[^>]*>.*?<span[^>]*>(.*?)<\/span>/s);
				data.Runtime = extractValue(htmlContent, /Runtime:<\/span>\s*<span[^>]*>(.*?)<\/span>/s);
				data.Language = extractValue(htmlContent, /Language:<\/span>\s*<span[^>]*>(.*?)<\/span>/s);
				data.Url = url;

				const posterMatch = htmlContent.match(/<div id="movie-poster".*?<img[^>]*src="([^"]+)"/s);
				data.Poster = posterMatch ? `${baseUrl}${posterMatch[1]}` : null;

				// Improved torrent files extraction
				const torrentRegex = /<div class="modal-torrent">\s*<span[^>]*>(.*?)<\/span>\s*<span[^>]*>(.*?)<\/span>.*?<span[^>]*>(.*?)<\/span>.*?href="([^"]+)".*?href="([^"]+)"/gs;
				const torrentMatches = [...htmlContent.matchAll(torrentRegex)];

				torrentMatches.forEach(match => {
					const files = {
						Quality: match[1].trim(),
						Type: match[2].trim(),
						Size: match[3].trim(),
						Torrent: `${baseUrl}${match[4]}`,
						Magnet: match[5]
					};
					if (Object.values(files).every(value => value)) {
						data.Files.push(files);
					}
				});

				// Only push data if Files array is not empty
				if (data.Files.length > 0) {
					all.push(data);
				}
			} catch (error) {
				console.error(`Error processing URL ${url}:`, error.message);
			}
		}));

		return all;
	} catch (error) {
		console.error('Error fetching initial page:', error.message);
		return null;
	}
}

function extractValue(html, regex) {
	const match = html.match(regex);
	return match ? match[1].trim() : null;
}

module.exports = torrentYts;