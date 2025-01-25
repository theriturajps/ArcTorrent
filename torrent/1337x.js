const axios = require('axios');
const cheerio = require('cheerio');

class TorrentScraper {
	constructor(baseUrl = 'https://1337xx.to') {
		this.baseUrl = baseUrl;
	}

	async search(query, page = 1) {
		try {
			const url = `${this.baseUrl}/search/${query}/${page}/`;
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);

			const torrentLinks = $('td.name').map((_, element) =>
				this.baseUrl + $(element).find('a').next().attr('href')
			).get();

			const torrents = await Promise.all(
				torrentLinks.map(link => this.scrapeTorrentDetails(link))
			);

			return torrents;
		} catch (error) {
			console.error('Search error:', error);
			return [];
		}
	}

	async scrapeTorrentDetails(url) {
		try {
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);

			const torrent = {
				name: $('.box-info-heading h1').text().trim(),
				url: url,
				magnet: $('.clearfix ul li a').attr('href') || '',
				poster: this.normalizePosterUrl($('div.torrent-image img').attr('src')),
				details: {}
			};

			const labels = ['Category', 'Type', 'Language', 'Size', 'UploadedBy', 'Downloads', 'LastChecked', 'DateUploaded', 'Seeders', 'Leechers'];

			$('div .clearfix ul li > span').each((i, element) => {
				torrent.details[labels[i]] = $(element).text();
			});

			return torrent;
		} catch (error) {
			console.error(`Error scraping ${url}:`, error);
			return null;
		}
	}

	normalizePosterUrl(poster) {
		if (!poster) return '';
		return poster.startsWith('http') ? poster : 'https:' + poster;
	}
}

module.exports = TorrentScraper;