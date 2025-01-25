const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTorrents(query, page = 1) {
	try {
		const baseUrl = 'https://1337xx.to';
		const searchUrl = `${baseUrl}/search/${query}/${page}/`;

		const searchResponse = await axios.get(searchUrl);
		const $ = cheerio.load(searchResponse.data);

		const torrentLinks = $('td.name').map((_, el) =>
			baseUrl + $(el).find('a').next().attr('href')
		).get();

		const torrents = await Promise.all(
			torrentLinks.map(async (link) => {
				try {
					const detailResponse = await axios.get(link);
					const $detail = cheerio.load(detailResponse.data);

					return {
						name: $detail('.box-info-heading h1').text().trim(),
						magnet: $detail('.clearfix ul li a').first().attr('href') || '',
						poster: getPosterUrl($detail),
						details: getDetails($detail)
					};
				} catch (error) {
					console.error(`Error scraping ${link}:`, error);
					return null;
				}
			})
		);

		return torrents.filter(torrent => torrent !== null);
	} catch (error) {
		console.error('Search error:', error);
		return [];
	}
}

function getPosterUrl($) {
	const poster = $('div.torrent-image img').attr('src');
	return poster
		? (poster.startsWith('http') ? poster : 'https:' + poster)
		: '';
}

function getDetails($) {
	const details = {};
	const labels = [
		'Category', 'Type', 'Language', 'Size',
		'UploadedBy', 'Downloads', 'LastChecked',
		'DateUploaded', 'Seeders', 'Leechers'
	];

	$('div .clearfix ul li > span').each((i, el) => {
		details[labels[i]] = $(el).text().trim();
	});

	return details;
}

module.exports = scrapeTorrents;