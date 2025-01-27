const VALID_WEBSITES = [
	'1337x', 'yts', 'nyaasi', 'tgx', 'torlock',
	'piratebay', 'limetorrent', 'glodls', 'all'
];

const PORT = process.env.PORT || 3000;

module.exports = {
	VALID_WEBSITES,
	PORT,
	PAGE_LIMITS: {
		'1337x': 50,
		'nyaasi': 14
	}
};