const cheerio = require('cheerio');
const axios = require('axios');

async function torrentYts(query, page = '1') {

	let all = []
	let ALLURL = [];
	if (page === '' || page === '1') {
		var url = "https://en.yts-official.mx/browse-movies?keyword=" + query + "&quality=all&genre=all&rating=0&year=0&order_by=latest"
	} else {
		var url = "https://en.yts-official.mx/browse-movies?keyword=" + query + "&quality=all&genre=all&rating=0&year=0&order_by=latest&page=" + page;
	}
	let html;
	try {
		html = await axios.get(url, headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36"
		});
	} catch {
		return null;
	}

	const $ = cheerio.load(html.data);
	$('div.browse-movie-bottom').each((_, element) => {
		let url = `https://en.yts-official.mx` + $(element).find('a').attr('href');
		ALLURL.push(url);
	})

	await Promise.all(ALLURL.map(async (url) => {
		const data = {
			'Name': null,
			'ReleasedDate': null,
			'Genre': null,
			'Rating': null,
			'Likes': null,
			'Runtime': null,
			'Language': null,
			'Url': null,
			'Poster': null,
			'Files': []
		};
		let html;
		try {
			html = await axios.get(url);
		} catch {
			return;
		}

		const $ = cheerio.load(html.data);

		data['Name'] = $('div.hidden-xs').find('h1').text();
		data['ReleasedDate'] = $('div.hidden-xs').find('h2').eq(0).text();
		data['Genre'] = $('div.hidden-xs').find('h2').eq(1).text();
		data['Rating'] = (($('div.bottom-info div.rating-row').eq(3).find('span').eq(0).text()) + ' ⭐').trim() || 'Not Rated'
		data['Likes'] = $('div.bottom-info div.rating-row').eq(0).find('span').eq(1).text()
		data['Runtime'] = $('div .tech-spec-info').find('div .row').eq(1).find('div .tech-spec-element').eq(2).text().trim();
		data['Language'] = $('div .tech-spec-info').find('div .row').eq(0).find('div .tech-spec-element').eq(2).text().trim();
		data['Url'] = url;
		data['Poster'] = ('https://en.yts-official.mx' + $('div #movie-poster').eq(0).find('img').attr('src'));

		$('.modal-download > div:nth-child(1) div.modal-content').each((i, el) => {
			$('div.modal-torrent').each((_, ele) => {
				let files = {};
				files.Quality = $(ele).find(':nth-child(1) >span').text();;
				files.Type = $(ele).find(':nth-child(2)').text();
				files.Size = $(ele).find(':nth-child(5)').text();
				files.Torrent = ('https://en.yts-official.mx' + $(ele).find(':nth-child(6)').attr('href'));
				files.Magnet = $(ele).find(':nth-child(7)').attr('href');

				data.Files.push(files);
			})

		})
		all.push(data);
	}))

	return all;

}

module.exports = torrentYts;