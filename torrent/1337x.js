const cheerio = require('cheerio');
const axios = require('axios');

async function torrent1337x(query = '', page = '1') {
	const allTorrent = [];
	let html;
	const url = 'https://1337xx.to/search/' + query + '/' + page + '/';

	try {
		html = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
	} catch (error) {
		console.error('Fetch error:', error);
		return null;
	}

	const $ = cheerio.load(html.data);
	const links = $('td.name').map((_, element) => {
		return 'https://1337xx.to' + $(element).find('a').next().attr('href');
	}).get();

	const processedTorrents = await Promise.all(links.map(async (element) => {
		const data = {};
		const labels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];

		try {
			const detailHtml = await axios.get(element, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			});
			const $detail = cheerio.load(detailHtml.data);

			data.Name = $detail('.box-info-heading h1').text().trim();
			data.Magnet = $detail('.clearfix ul li a').attr('href') || "";

			const poster = $detail('div.torrent-image img').attr('src');
			if (poster) {
				data.Poster = poster.startsWith('http') ? poster : 'https:' + poster;
			} else {
				data.Poster = '';
			}

			$detail('div .clearfix ul li > span').each((i, element) => {
				data[labels[i]] = $(element).text();
			});

			data.Url = element;
			return data;
		} catch (error) {
			console.error('Detail fetch error:', error);
			return null;
		}
	}));

	return processedTorrents.filter(torrent => torrent !== null);
}

module.exports = torrent1337x;