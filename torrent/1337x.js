const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTorrents(query, page = 1) {
	// Construct the search URL
	const searchUrl = `https://1337xx.to/search/${query}/${page}/`;

	try {
		// Fetch the search results page
		const searchResponse = await axios.get(searchUrl);
		const $ = cheerio.load(searchResponse.data);

		// Extract torrent detail page links
		const torrentLinks = $('td.name a').map((_, el) =>
			'https://1337xx.to' + $(el).next().attr('href')
		).get();

		// Scrape details for each torrent
		const torrents = await Promise.all(torrentLinks.map(async (link) => {
			const torrentPage = await axios.get(link);
			const $torrent = cheerio.load(torrentPage.data);

			return {
				name: $torrent('.box-info-heading h1').text().trim(),
				magnet: $torrent('.clearfix ul li a').first().attr('href') || '',
				poster: getPosterUrl($torrent),
				category: $torrent('div .clearfix ul li span').first().text(),
				size: $torrent('div .clearfix ul li span').eq(3).text(),
				seeders: $torrent('div .clearfix ul li span').eq(8).text(),
				leechers: $torrent('div .clearfix ul li span').eq(9).text(),
				url: link
			};
		}));

		return torrents;
	} catch (error) {
		console.error('Error scraping torrents:', error);
		return null;
	}
}

// Helper function to get poster URL
function getPosterUrl($) {
	const poster = $('div.torrent-image img').attr('src');
	if (!poster) return '';
	return poster.startsWith('http') ? poster : 'https:' + poster;
}

module.exports = scrapeTorrents;