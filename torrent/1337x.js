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
				...extractDetails($detail)
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

function extractDetails($) {
	const detailsText = $('div .clearfix ul li > span').map((_, el) => $(el).text()).get().join('|');

	const details = {
		Category: detailsText.match(/Category:\s*([^|]+)/i)?.[1]?.trim() || '',
		Type: detailsText.match(/Type:\s*([^|]+)/i)?.[1]?.trim() || '',
		Language: detailsText.match(/Language:\s*([^|]+)/i)?.[1]?.trim() || '',
		Size: detailsText.match(/Size:\s*([^|]+)/i)?.[1]?.trim() || '',
		UploadedBy: detailsText.match(/Uploaded By:\s*([^|]+)/i)?.[1]?.trim() || '',
		Downloads: detailsText.match(/Downloads:\s*([^|]+)/i)?.[1]?.trim() || '',
		LastChecked: detailsText.match(/Last Checked:\s*([^|]+)/i)?.[1]?.trim() || '',
		DateUploaded: detailsText.match(/Date Uploaded:\s*([^|]+)/i)?.[1]?.trim() || '',
		Seeders: detailsText.match(/Seeders:\s*([^|]+)/i)?.[1]?.trim() || '',
		Leechers: detailsText.match(/Leechers:\s*([^|]+)/i)?.[1]?.trim() || ''
	};

	return details;
}

module.exports = torrent1337x;