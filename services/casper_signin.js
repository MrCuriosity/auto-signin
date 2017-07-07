var config = require('./config.js')
var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug',
	onPageInitialized: function(page) {
		console.log('page loaded')
	}
});

var SITE = {
	index: 'https://www.v2ex.com',
	signin: 'https://www.v2ex.com/signin',
	mission: 'https://www.v2ex.com/mission/daily'
}
var username = config.username
var password = config.password

casper
/** index cookie */
.start(SITE.index)

.thenOpen(SITE.signin, function() {
	this.wait(5000, function() {
		var name = this.evaluate(function(username, password) {
			__utils__.echo('—————————— on the signin page ——————————')
			document.querySelector('.sl[type="text"]').setAttribute('value', username) // set your username
			document.querySelector('.sl[type="password"]').setAttribute('value', password) // set your password
			document.querySelector('[action="/signin"]').submit()
		}, username, password)
	})
})
.then(function() {
	this.evaluate(function() {
		if (document.querySelector('[href="/member/aboutTime"]').innerHTML === 'aboutTime') {
			__utils__.echo('========================' + document.querySelector('[href="/mission/daily"]') + '========================')
			this.click(document.querySelector('[href="/mission/daily"]'))
		}
	})
})
.thenOpen(SITE.mission, function() {
	this.echo(this.getTitle())//V2EX › 日常任务
	this.capture('Daily-' + (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + '.png', {
		top: 0,
		left: 0,
		width: 1000,
		height: 1000
	}, {
		format: 'png',
		quality: 100
	})
	this.click('.super.normal.button')
	this.evaluate(function() {
		__utils__.echo('button text -> ' + document.querySelector('.super.normal.button').value)
	})
})
.then(function() {
	this.wait(5000, function() {
		this.capture('Result-' + (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + '.png', {
			top: 0,
			left: 0,
			width: 1000,
			height: 1000
		}, {
			format: 'png',
			quality: 100
		})
	})
})

casper.run();