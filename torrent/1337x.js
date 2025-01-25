const axios = require('axios');

async function torrentScraper(query = '', page = '1') {
	const url = `https://1337x.to/search/${query}/${page}/`;

	try {
		// Fetch search results page
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		const html = response.data;

		// Extract torrent links using regex
		const linkRegex = /\/torrent\/(\d+)\/(.*?)\//g;
		const links = [];
		let match;

		while ((match = linkRegex.exec(html)) !== null) {
			links.push(`https://1337x.to/torrent/${match[1]}/${encodeURIComponent(match[2])}/`);
		}

		// Fetch details for each torrent
		const torrents = [];

		for (const link of links) {
			try {
				const detailResponse = await axios.get(link, {
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
					}
				});
				const detailHtml = detailResponse.data;

				// More comprehensive regex matching
				const torrentData = {
					Name: detailHtml.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]?.trim() || 'N/A',
					Magnet: detailHtml.match(/href="(magnet:[^"]+)"/)?.[1] || 'N/A',
					Category: detailHtml.match(/Category:\s*<\/strong>\s*(.*?)\s*<\/li>/)?.[1]?.trim() || 'N/A',
					Type: detailHtml.match(/Type:\s*<\/strong>\s*(.*?)\s*<\/li>/)?.[1]?.trim() || 'N/A',
					Size: detailHtml.match(/Size:\s*<\/strong>\s*(.*?)\s*<\/li>/)?.[1]?.trim() || 'N/A',
					Seeders: detailHtml.match(/Seeders:\s*<\/strong>\s*(.*?)\s*<\/li>/)?.[1]?.trim() || 'N/A',
					Leechers: detailHtml.match(/Leechers:\s*<\/strong>\s*(.*?)\s*<\/li>/)?.[1]?.trim() || 'N/A',
					Url: link
				};

				torrents.push(torrentData);
			} catch (detailError) {
				console.error(`Error fetching torrent details: ${detailError.message}`);
			}
		}

		return torrents;
	} catch (error) {
		console.error(`Error in torrent search: ${error.message}`);
		return [];
	}
}

module.exports = torrentScraper;