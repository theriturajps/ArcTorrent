const cheerio = require('cheerio')
const axios = require('axios')

async function glodls(query, page = '0', maxRetries = 3) {
	const url = `https://glodls.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`;

	const userAgents = [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
	];

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const html = await axios.get(url, {
				headers: {
					"User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
					"Accept-Language": "en-US,en;q=0.5",
					"DNT": "1",
					"Connection": "keep-alive",
					"Upgrade-Insecure-Requests": "1"
				},
				timeout: 10000  // 10-second timeout
			});

			const $ = cheerio.load(html.data);
			const ALLTORRENT = [];

			$('.ttable_headinner tr').each((_, element) => {
				const torrent = {
					'Name': $(element).find('td').eq(1).find('a').text().trim(),
					'Size': $(element).find('td').eq(4).text(),
					'UploadedBy': $(element).find('td').eq(7).find('a b font').text(),
					'Seeders': $(element).find('td').eq(5).find('font b').text(),
					'Leechers': $(element).find('td').eq(6).find('font b').text(),
					'Url': "https://glodls.to" + $(element).find('td').eq(1).find('a').next().attr('href'),
					'Torrent': "https://glodls.to" + $(element).find('td').eq(2).find('a').attr('href'),
					'Magnet': $(element).find('td').eq(3).find('a').attr('href'),
				}
				if (torrent.Name !== '') {
					ALLTORRENT.push(torrent);
				}
			});

			return ALLTORRENT.length > 0 ? ALLTORRENT : null;

		} catch (error) {
			if (attempt === maxRetries) {
				console.error(`Glodls scraping failed after ${maxRetries} attempts:`, error);
				return null;
			}
			await new Promise(resolve => setTimeout(resolve, 2000 * attempt));  // Exponential backoff
		}
	}
}

module.exports = glodls