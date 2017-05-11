let request = require('request')
const cheerio = require('cheerio')
const config = require('../config.js')

const baseUrl = config.baseUrl
const headers = config.headers
const daily_headers = config.daily_headers
const signin_headers = config.signin_headers
request = request.defaults({ jar: true, baseUrl, followRedirect: true })
request.debug = true

module.exports = function signin({ sign_site, daily_site, username, password }) {

	return new Promise((resolve, reject)=> {
		request({
			method: 'GET',
			uri: ''
		}, (err, res, body)=> {
			if (err) console.error(err)
			if (res.statusCode === 200) {
				console.log('index')
				resolve()
			}
		})
	})
	.then(()=> {
		return new Promise((resolve, reject)=> {
			request({
				method: 'GET',
				uri: sign_site,
				headers: headers
			}, (err, res, body)=> {
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
				console.log('resolve username: %s password %s ', username, password)
				resolve(data)
			})
		})
	})
	.then( data => {
		return new Promise((resolve, reject)=> {
			request({
				method: 'POST',
				baseUrl: baseUrl,
				uri: '/signin',
				form: data,
				headers: headers
			}, (err, res, body)=> {
				if (err) console.error(err)
				console.log(body)
				if (res.statusCode === 302) {
					console.log('login success, onceCode: %s', data.once)
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
				uri: '/mission/daily',
				headers: headers
			}, (err, res, body)=> {
				// console.log(body)
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
				uri: url,
				headers: daily_headers
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