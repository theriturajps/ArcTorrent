const express = require('express');
const path = require('path');
const cors = require('cors');
const scrap1337x = require('./torrent/1337x');


const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/:website/:query/:page?', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	let website = (req.params.website).toLowerCase();
	let query = req.params.query;
	let page = req.params.page;

	if (website === '1337x') {
		if (page > 50) {
			return res.json({
				error: 'Please enter page  value less than 51 to get the result :)'
			})
		} else {
			scrap1337x.torrent1337x(query, page)
				.then((data) => {
					if (data === null) {
						return res.json({
							error: 'Website is blocked change IP'
						})

					} else if (data.length === 0) {
						return res.json({
							error: 'No search result available for query (' + query + ')'
						})
					} else {
						return res.send(data);
					}

				})
		}
	}
	if (website === "all") {
		combo(query, page).then((data) => {
			if (data !== null && data.length > 0) {
				return res.send(data);
			} else {
				return res.json({
					error: 'No search result available for query (' + query + ')'
				});
			}
		})

	} else if (website !== 'nyaasi' && website !== '1337x' && website !== 'yts' && website !== 'piratebay' && website !== 'torlock' && website !== 'eztv' && website !== 'tgx' && website !== 'all' && website !== "rarbg" && website !== 'ettv' && website !== 'zooqle' && website !== 'kickass' && website !== 'bitsearch' && website !== 'glodls' && website !== 'magnetdl' && website !== 'limetorrent' && website !== 'torrentfunk' && website !== 'torrentproject') {
		return res.json({
			error: 'please select 1337x | nyaasi | yts | Piratebay | torlock | eztv | TorrentGalaxy(tgx) | rarbg | zooqle | kickass | bitsearch | glodls | magnetdl | limetorrent | torrentfunk | torrentproject | all (to scrap from every site)'
		})
	}
});

app.use('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
console.log('Listening on PORT : ', PORT);
app.listen(PORT);