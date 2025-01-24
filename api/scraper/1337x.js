const cheerio = require('cheerio');
const axios = require('axios');

async function torrent1337x(query = '', page = '1') {
	const allTorrent = [];

	try {
		const url = `https://1337x.to/search/${query}/${page}/`;
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});

		const $ = cheerio.load(response.data);

		const torrentRows = $('table.table-list tbody tr');

		for (let i = 0; i < torrentRows.length; i++) {
			const row = $(torrentRows[i]);
			const detailLink = row.find('td.name a:last-child');
			const relativeUrl = detailLink.attr('href');

			if (!relativeUrl) continue;

			const fullDetailUrl = `https://1337x.to${relativeUrl}`;

			try {
				const detailResponse = await axios.get(fullDetailUrl, {
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
					}
				});

				const $detail = cheerio.load(detailResponse.data);

				const torrentData = {
					Name: $detail('.box-info-heading h1').text().trim(),
					Magnet: $detail('.clearfix ul li a').attr('href') || '',
					Category: row.find('td.coll-1').text().trim(),
					Size: row.find('td.coll-4').text().trim(),
					Seeders: row.find('td.coll-2').text().trim(),
					Leechers: row.find('td.coll-3').text().trim()
				};

				allTorrent.push(torrentData);
			} catch (detailError) {
				console.error(`Error fetching torrent detail: ${detailError.message}`);
			}
		}

		return allTorrent;
	} catch (error) {
		console.error(`Scraping Error: ${error.message}`);
		return null;
	}
}

module.exports = torrent1337x;