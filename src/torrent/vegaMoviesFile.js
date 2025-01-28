const axios = require('axios');

async function torrentVegaMovies(query, page = '1') {
	let all = [];
	let ALLURL = [];
	const baseUrl = "https://vegamovies.ms";
	const url = page === '' || page === '1' ? `${baseUrl}/?s=${query}` : `${baseUrl}/page/${page}?s=${query}`;

	try {
		const html = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36"
			}
		});

		// Extract URLs using regex
		const urlRegex = /<div class="post-inner post-hover">.*?<a href="([^"]+)".*?<\/div>/gs;
		const matches = [...html.data.matchAll(urlRegex)];
		ALLURL = matches.map(match => `https://en.yts-official.mx${match[1]}`);

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

				// Extract data using regex patterns
				data.Name = extractValue(htmlContent, /<div class="hidden-xs">.*?<h1[^>]*>(.*?)<\/h1>/s);
				data.ReleasedDate = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>(.*?)<\/h2>/s);
				data.Genre = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>.*?<\/h2>.*?<h2[^>]*>(.*?)<\/h2>/s);

				const ratingMatch = htmlContent.match(/<div class="bottom-info.*?rating-row.*?<span[^>]*>(.*?)<\/span>/s);
				data.Rating = ratingMatch ? `${ratingMatch[1].trim()} ⭐` : 'Not Rated';

				data.Likes = extractValue(htmlContent, /<div class="bottom-info.*?rating-row.*?<span[^>]*>.*?<span[^>]*>(.*?)<\/span>/s);
				data.Runtime = extractValue(htmlContent, /<div class="tech-spec-info".*?row.*?tech-spec-element.*?tech-spec-element.*?tech-spec-element[^>]*>(.*?)<\/div>/s);
				data.Language = extractValue(htmlContent, /<div class="tech-spec-info".*?row.*?tech-spec-element.*?tech-spec-element[^>]*>(.*?)<\/div>/s);
				data.Url = url;

				const posterMatch = htmlContent.match(/<div id="movie-poster".*?<img[^>]*src="([^"]+)"/s);
				data.Poster = posterMatch ? `https://en.yts-official.mx${posterMatch[1]}` : null;

				// Extract torrent files information
				const torrentRegex = /<div class="modal-torrent">(.*?)<\/div>/gs;
				const torrentMatches = [...htmlContent.matchAll(torrentRegex)];

				torrentMatches.forEach(match => {
					const torrentHtml = match[1];
					const files = {
						Quality: extractValue(torrentHtml, /<span[^>]*>(.*?)<\/span>/),
						Type: extractValue(torrentHtml, /<span[^>]*>.*?<\/span>(.*?)<\/span>/),
						Size: extractValue(torrentHtml, /<span[^>]*>.*?<\/span>.*?<span[^>]*>(.*?)<\/span>/),
						Torrent: `https://en.yts-official.mx${extractValue(torrentHtml, /href="([^"]+)"/)}`,
						Magnet: extractValue(torrentHtml, /href="(magnet:[^"]+)"/)
					};
					data.Files.push(files);
				});

				all.push(data);
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

// Helper function to extract values using regex
function extractValue(html, regex) {
	const match = html.match(regex);
	return match ? match[1].trim() : null;
}

module.exports = torrentVegaMovies;