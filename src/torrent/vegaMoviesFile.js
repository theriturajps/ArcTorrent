const cheerio = require('cheerio');
const axios = require('axios');

async function torrentVegaMovies(query, page = '1') {

	let all = []
	let ALLURL = [];
	if (page === '' || page === '1') {
		var url = "https://vegamovies.ms/?s=" + query;
	} else {
		var url = "https://vegamovies.ms/page/" + page + "?s=" + query;
	}
	let html;
	try {
		html = await axios.get(url, headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36"
		});
	} catch {
		return null;
	}

	const $ = cheerio.load(html.data);
	$('div.post-inner.post-hover').each((_, element) => {
		let url = $(element).find('a').attr('href');
		console.log(url);
		ALLURL.push(url);
	})

	await Promise.all(ALLURL.map(async (url) => {
		const data = {
			'Name': null,
			'Likes': null,
			'Language': null,
			'Url': null,
		};
		let html;
		try {
			html = await axios.get(url);
		} catch {
			return;
		}

		const $ = cheerio.load(html.data);

		data['Name'] = $('div.post-inner.group').find('h1').text();
		data['Likes'] = $('div.bottom-info div.rating-row').eq(0).find('span').eq(1).text()
		data['Language'] = $('#content > div:nth-child(2) > article > div > div.entry.themeform > div.entry-inner > p:nth-child(5) > span:nth-child(10) > strong').text().trim();
		data['Url'] = url;

		all.push(data);
	}))

	return all;

}

module.exports = torrentVegaMovies;