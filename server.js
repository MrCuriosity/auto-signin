/** requirements */
const request = require('request').defaults({ jar: true })
const cheerio = require('cheerio')
const express = require('express')
const path = require('path')

/** variables */
const PORT = 3000
const HOST = '127.0.0.1'
const baseUrl = 'https://www.v2ex.com'
const SIGNIN_SITE = 'https://www.v2ex.com/signin'
const DAILY_SITE = 'https://www.v2ex.com/mission/daily'
const headers = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	'Referer': 'https://www.v2ex.com/signin',
	'Origin': 'https://www.v2ex.com'
}
const app = express()

function signin({ sign_site, daily_site }) {
	var getCode = new Promise((resolve, reject)=> {
		request(sign_site, (err, res, body)=> {
			if (err) console.error(err)
			const $ = cheerio.load(body)
			let data = {}
			data[$('.sl[type="text"]').attr('name')] = 'aboutTime'
			data[$('.sl[type="password"]').attr('name')] = '52readbook'
			data['once'] = parseInt($('[name="once"]').val(), 10)
			data['next'] = '/'
			resolve(data)
		})
	})
	getCode.then( data => {
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
					reject(0)
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
				if (err) console.error(err)
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
		request({
			method: 'GET',
			baseUrl: baseUrl,
			url: url,
			jar: true,
			followRedirect: true,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
				'Referer': 'https://www.v2ex.com/mission/daily'
			}
		}, (err, res, body)=> {
			if (err) console.error(err)
			console.log(res)
		})
	})
	.catch(e => console.error(e))
}
signin({ sign_site: SIGNIN_SITE })

/** configuration */
app.use(express.static(path.join(__dirname, '/public')))



















