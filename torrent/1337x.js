const cheerio = require('cheerio');
const axios = require('axios');

async function torrent1337x(query = '', page = '1') {

	const baseUrl = 'https://1337xx.to';
	const searchUrl = `${baseUrl}/search/${encodeURIComponent(query)}/${page}/`;

	try {
		// Fetch search results page
		const searchResponse = await axios.get(searchUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});

		const $ = cheerio.load(searchResponse.data);

		// Select torrent detail page links for the specific page
		const detailLinks = $('td.name a.row-item-name').map((_, element) =>
			`${baseUrl}${$(element).attr('href')}`
		).get();

		// Fetch details for each torrent on the page
		const torrentDetails = await Promise.all(detailLinks.map(async (url) => {
			try {
				const detailResponse = await axios.get(url, {
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
					}
				});

				const $detail = cheerio.load(detailResponse.data);

				// Extract torrent details
				const torrent = {
					Name: $detail('.box-info-heading h1').text().trim(),
					Magnet: $detail('.clearfix ul li a[href^="magnet:"]').attr('href') || '',
					Url: url
				};

				// Extract additional info
				const infoLabels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];

				$detail('div.clearfix ul li > span').each((i, element) => {
					if (infoLabels[i]) {
						torrent[infoLabels[i]] = $detail(element).text().trim();
					}
				});

				// Handle poster image
				const poster = $detail('div.torrent-image img').attr('src');
				if (poster) {
					torrent.Poster = poster.startsWith('http') ? poster : `https:${poster}`;
				} else {
					torrent.Poster = '';
				}

				return torrent;
			} catch (error) {
				console.error(`Error fetching torrent details: ${url}`, error);
				return null;
			}
		}));

		// Filter out any null results and return page-specific results
		return torrentDetails.filter(torrent => torrent !== null);

	} catch (error) {
		console.error('Error in torrent search:', error);
		return null;
	}
}

module.exports = torrent1337x;