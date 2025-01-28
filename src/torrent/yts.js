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

				// Extract movie details using regex
				data.Name = extractValue(htmlContent, /<div class="hidden-xs">.*?<h1[^>]*>(.*?)<\/h1>/s);
				data.ReleasedDate = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>(.*?)<\/h2>/s);
				data.Genre = extractValue(htmlContent, /<div class="hidden-xs">.*?<h2[^>]*>.*?<\/h2>.*?<h2[^>]*>(.*?)<\/h2>/s);

				const ratingMatch = htmlContent.match(/<div class="bottom-info.*?rating-row.*?<span[^>]*>(.*?)<\/span>/s);
				data.Rating = ratingMatch ? `${ratingMatch[1].trim()} ⭐` : 'Not Rated';

				const likesMatch = htmlContent.match(/<div class="bottom-info.*?rating-row.*?<span[^>]*>.*?<span[^>]*>(.*?)<\/span>/s);
				data.Likes = likesMatch ? likesMatch[1].trim() : null;

				// Extract technical specs
				const techSpecRegex = /<div class="tech-spec-info".*?<div class="row">(.*?)<\/div>/gs;
				const techSpecs = [...htmlContent.matchAll(techSpecRegex)];
				if (techSpecs.length >= 2) {
					data.Runtime = extractValue(techSpecs[1][1], /<div class="tech-spec-element".*?>(.*?)<\/div>/s);
					data.Language = extractValue(techSpecs[0][1], /<div class="tech-spec-element".*?>(.*?)<\/div>/s);
				}

				data.Url = url;

				const posterMatch = htmlContent.match(/<div id="movie-poster".*?<img[^>]*src="([^"]+)"/s);
				data.Poster = posterMatch ? `${baseUrl}${posterMatch[1]}` : null;

				// Extract torrent files information
				const torrentSection = htmlContent.match(/<div class="modal-download">.*?<div class="modal-content">(.*?)<\/div>/s);
				if (torrentSection) {
					const torrentRegex = /<div class="modal-torrent">(.*?)<\/div>/gs;
					const torrentMatches = [...torrentSection[1].matchAll(torrentRegex)];

					torrentMatches.forEach(match => {
						const torrentHtml = match[1];
						const files = {
							Quality: extractValue(torrentHtml, /<span[^>]*>(.*?)<\/span>/),
							Type: extractValue(torrentHtml, /<span[^>]*>.*?<\/span>.*?>(.*?)<\/span>/),
							Size: extractValue(torrentHtml, /<span[^>]*>.*?<\/span>.*?<span[^>]*>(.*?)<\/span>/),
							Torrent: `${baseUrl}${extractValue(torrentHtml, /href="([^"]+)"/)}`,
							Magnet: extractValue(torrentHtml, /href="(magnet:[^"]+)"/)
						};
						data.Files.push(files);
					});
				}

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

module.exports = torrentYts;