const axios = require('axios');
const cheerio = require('cheerio');

async function torrent1337x(query = '', page = '1') {
	const url = `https://1337xx.to/search/${query}/${page}/`;

	try {
		const { data: html } = await axios.get(url);
		const $ = cheerio.load(html);

		const torrentLinks = $('td.name').map((_, el) =>
			'https://1337xx.to' + $(el).find('a').next().attr('href')
		).get();

		const allTorrents = await Promise.all(torrentLinks.map(async (link) => {
			const { data: detailHtml } = await axios.get(link);
			const $detail = cheerio.load(detailHtml);

			const torrentData = {
				Name: $detail('.box-info-heading h1').text().trim(),
				Magnet: $detail('.clearfix ul li a').attr('href') || '',
				Url: link,
				Poster: extractPoster($detail),
				...extractDetailsFromSpans($detail)
			};

			return torrentData;
		}));

		return allTorrents;
	} catch (error) {
		console.error('Scraping error:', error);
		return null;
	}
}

function extractPoster($) {
	const poster = $('div.torrent-image img').attr('src');
	if (!poster) return '';
	return poster.startsWith('http') ? poster : 'https:' + poster;
}

function extractDetailsFromSpans($) {
	const details = {};
	const labels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];

	$('div .clearfix ul li > span').each((index, element) => {
		if (labels[index]) {
			details[labels[index]] = $(element).text().trim();
		}
	});

	return details;
}

module.exports = torrent1337x;