const cheerio = require('cheerio');
const axios = require('axios');

async function torrent1337x(query = '', page = '1') {
	const allTorrent = [];
	const url = `https://1337xx.to/search/${query}/${page}/`;
	console.log(url);

	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const links = $('td.name').map((_, element) =>
			'https://1337xx.to' + $(element).find('a').next().attr('href')
		).get();

		for (const link of links) {
			try {
				const torrentPage = await axios.get(link);
				const $torrent = cheerio.load(torrentPage.data);

				const torrentData = {
					Name: $torrent('.box-info-heading h1').text().trim(),
					Magnet: $torrent('.clearfix ul li a').attr('href') || "",
					Url: link
				};

				// Poster handling
				const poster = $torrent('div.torrent-image img').attr('src');
				torrentData.Poster = poster
					? (poster.startsWith('http') ? poster : 'https:' + poster)
					: "";

				// Additional details
				const labels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];

				$torrent('div .clearfix ul li > span').each((i, element) => {
					torrentData[labels[i]] = $torrent(element).text();
				});

				allTorrent.push(torrentData);
			} catch (error) {
				console.error(`Error fetching torrent details: ${error.message}`);
			}
		}

		return allTorrent;
	} catch (error) {
		console.error(`Error searching torrents: ${error.message}`);
		return null;
	}
}

module.exports = torrent1337x;