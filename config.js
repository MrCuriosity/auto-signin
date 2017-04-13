module.exports = {
	PORT: 3000,
	HOST: '127.0.0.1',
	baseUrl: 'https://www.v2ex.com',
	SIGNIN_SITE: '/signin',
	DAILY_SITE: 'www.v2ex.com/mission/daily',
	headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
		'referer': 'https://www.v2ex.com/signin'
	},
	signin_headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
		'referer': 'https://www.v2ex.com/signin',
		'origin': 'https://www.v2ex.com'
	},
	daily_headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
		'Referer': 'https://www.v2ex.com/mission/daily',
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding': 'sdch, br',
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
		'Upgrade-Insecure-Requests': 1
	}
}