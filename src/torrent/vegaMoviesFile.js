const axios = require('axios');

async function torrentVegaMovies(query, page = 1) {
	const ALLURL = [];
	const url = `https://vegamovies.ms/page/${page}?s=${query}`;

	try {
		const response = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36",
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				"Accept-Encoding": "gzip, deflate, br",
				"Connection": "keep-alive",
				"Upgrade-Insecure-Requests": "1",
				"Cache-Control": "max-age=0"
			},
			timeout: 5000  // 5 second timeout
		});

		console.log('Response status:', response.status);

		// Convert response to string and log first 500 characters
		const html = response.data.toString();
		console.log('First 500 chars of HTML:', html.substring(0, 500));

		// Find all post-inner post-hover divs directly
		const divMatches = html.match(/<div class="post-inner post-hover"[\s\S]*?<a href="([^"]+)"/g) || [];
		console.log('Number of matches found:', divMatches.length);

		divMatches.forEach(div => {
			const urlMatch = div.match(/href="([^"]+)"/);
			if (urlMatch && urlMatch[1]) {
				ALLURL.push(urlMatch[1]);
				console.log('Found URL:', urlMatch[1]);
			}
		});

		if (ALLURL.length === 0) {
			console.log('No URLs found in the HTML');
			// Return empty array instead of null for no results
			return [];
		}

		return ALLURL;

	} catch (error) {
		console.error("Full error:", error);
		console.error("Error message:", error.message);
		if (error.response) {
			console.error("Response status:", error.response.status);
			console.error("Response headers:", error.response.headers);
		}
		// Return empty array instead of null for errors
		return [];
	}
}

module.exports = torrentVegaMovies;