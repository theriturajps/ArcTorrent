const axios = require('axios');

async function torrentScraper(query = '', page = '1') {
	const url = `https://1337xx.to/search/${query}/${page}/`;

	try {
		const response = await axios.get(url);
		const html = response.data;

		// Regex to extract torrent detail links
		const linkMatches = html.matchAll(/href="(\/torrent\/[^"]+)"/g);
		const detailLinks = [...linkMatches].map(match => `https://1337xx.to${match[1]}`);

		const torrents = await Promise.all(detailLinks.map(async (link) => {
			try {
				const detailResponse = await axios.get(link);
				const detailHtml = detailResponse.data;

				return {
					Name: detailHtml.match(/<h1 class="box-info-heading">(.*?)<\/h1>/)?.[1] || '',
					Magnet: detailHtml.match(/href="(magnet:[^"]+)"/)?.[1] || '',
					Poster: detailHtml.match(/src="(https?:\/\/[^"]+\.(?:jpg|png|jpeg))"/)?.[1] || '',
					Category: detailHtml.match(/Category:<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '',
					Type: detailHtml.match(/Type:<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '',
					Size: detailHtml.match(/Size:<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '',
					Seeders: detailHtml.match(/Seeders:<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '',
					Leechers: detailHtml.match(/Leechers:<\/strong>\s*(.*?)\s*<\/li>/)?.[1] || '',
					Url: link
				};
			} catch {
				return null;
			}
		}));

		return torrents.filter(torrent => torrent !== null);
	} catch {
		return [];
	}
}

module.exports = torrentScraper;