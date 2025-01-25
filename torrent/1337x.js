const axios = require('axios');

async function scrapeTorrents(query, page = 1) {
	try {
		// Fetch search results page
		const searchUrl = `https://1337xx.to/search/${query}/${page}/`;
		const searchResponse = await axios.get(searchUrl);

		// Extract torrent detail page links using regex
		const torrentLinks = searchResponse.data.match(/\/torrent\/[^"]+/g)
			.map(link => `https://1337xx.to${link}`);

		// Scrape details for each torrent
		const torrents = await Promise.all(torrentLinks.map(async (url) => {
			try {
				const response = await axios.get(url);
				const html = response.data;

				return {
					name: html.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Unknown',
					magnet: html.match(/href="(magnet:[^"]+)"/)?.[1] || '',
					size: html.match(/Size.*?<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || 'N/A',
					seeders: html.match(/Seeders.*?<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '0',
					leechers: html.match(/Leechers.*?<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '0',
					url: url
				};
			} catch (error) {
				console.error(`Error scraping ${url}:`, error.message);
				return null;
			}
		}));

		// Filter out any failed scrapes
		return torrents.filter(torrent => torrent !== null);
	} catch (error) {
		console.error('Search error:', error.message);
		return [];
	}
}

module.exports = scrapeTorrents;