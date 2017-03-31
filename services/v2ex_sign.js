const request = require('request').defaults({ jar: true })
const cheerio = require('cheerio')
const config = require('../config.js')

const baseUrl = config.baseUrl
const headers = config.headers

module.exports = function signin({ sign_site, daily_site, username, password }) {

	return new Promise((resolve, reject)=> {
		request(sign_site, (err, res, body)=> {
			if (err) {
				console.error(err)
				reject(err)
			}
			const $ = cheerio.load(body)
			let data = {}
			data[$('.sl[type="text"]').attr('name')] = username
			data[$('.sl[type="password"]').attr('name')] = password
			data['once'] = parseInt($('[name="once"]').val(), 10)
			data['next'] = '/'
			resolve(data)
		})
	})
	.then( data => {
		return new Promise((resolve, reject)=> {
			request({
				method: 'POST',
				baseUrl: baseUrl,
				url: '/signin',
				form: data,
				jar: true,
				followRedirect: true,
				headers: headers

			}, (err, res, body)=> {
				if (err) console.error(err)
				if (res.statusCode === 302) {
					resolve(data.once)
				} else {
					reject('登录出错')
				}
			})
		})
	})
	.then( onceCode => {
		return new Promise((resolve, reject)=> {
			request({
				method: 'GET',
				baseUrl: baseUrl,
				url: '/mission/daily',
				jar: true,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
				}
			}, (err, res, body)=> {
				if (err) {
					console.error(err)
					reject(err)
				}
				if (body.indexOf('每日登录奖励已领取') > -1) {
					console.log('已领取')
				} else {
					console.log('未领取')
					resolve(body.match(/\/mission\/daily\/redeem\?once=\d+/)[0])
				}
			})
		})
	})
	.then( url => {
		console.log(url)
		return new Promise((resolve, reject)=> {
			request({
				method: 'GET',
				baseUrl: baseUrl,
				url: url,
				jar: true,
				followRedirect: true,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
					'Referer': 'https://www.v2ex.com/mission/daily',
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, sdch, br',
					'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6',
					'cache-control': 'no-cache'
				}
			}, (err, res, body)=> {
				if (err) {
					console.error(err)
					reject(err)
				}
				console.log(res)
				resolve(body)
			})
		})
	})
	.catch(e => console.error(e))
}