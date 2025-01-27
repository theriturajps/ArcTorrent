const { VALID_WEBSITES, PAGE_LIMITS } = require('../config/constants');
const torrentServices = require('../services/torrent');
const { formatErrorResponse } = require('../utils/response');

exports.search = async (req, res) => {
	const { website, query, page } = req.params;
	const normalizedWebsite = website.toLowerCase();

	// Validate website
	if (!VALID_WEBSITES.includes(normalizedWebsite)) {
		return res.json(formatErrorResponse(
			'Please enter valid website name (1337x, yts, nyaasi, tgx, torlock, piratebay, limetorrent, glodls and all)'
		));
	}

	// Validate page limits
	if (PAGE_LIMITS[normalizedWebsite] && page > PAGE_LIMITS[normalizedWebsite]) {
		return res.json(formatErrorResponse(
			`Please enter page value less than ${PAGE_LIMITS[normalizedWebsite] + 1}`
		));
	}

	try {
		const data = await torrentServices[normalizedWebsite](query, page);

		if (data === null) {
			return res.json(formatErrorResponse('Website is blocked change IP'));
		}

		if (data.length === 0) {
			return res.json(formatErrorResponse(`No search result available for query (${query})`));
		}

		return res.json(data);
	} catch (error) {
		return res.json(formatErrorResponse('An error occurred while processing your request'));
	}
};