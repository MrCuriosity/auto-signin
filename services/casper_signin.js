
var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug',
	onPageInitialized: function(page) {
		console.log('Initialized')
	}
});

var SITE = {
	index: 'https://www.v2ex.com',
	signin: 'https://www.v2ex.com/signin',
	mission: 'https://www.v2ex.com/mission/daily'
}

casper
/** index cookie */
.start(SITE.index)

.thenOpen(SITE.signin, function() {
	this.wait(5000, function() {
		var name = this.evaluate(function() {
			__utils__.echo('—————————— on the signin page ——————————')
			__utils__.echo(document.querySelector('[action="/signin"]'))
			__utils__.echo('username: ' + document.querySelector('.sl[type="text"]').value + '\n')
			__utils__.echo('password: ' + document.querySelector('.sl[type="password"]').value + '\n')
			document.querySelector('.sl[type="text"]').setAttribute('value', 'aboutTime')
			document.querySelector('.sl[type="password"]').setAttribute('value', '52readbook')
			__utils__.echo('username: ' + document.querySelector('.sl[type="text"]').value + '\n')
			__utils__.echo('password: ' + document.querySelector('.sl[type="password"]').value + '\n')
			document.querySelector('[action="/signin"]').submit()
			// this.fillSelectors('[action="/signin"]', {
			// 	'.sl[type="text"]': 'aboutTime',
			// 	'.sl[type="password"]': '52readbook'
			// }, true)
		})
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
	this.capture(`Daily-${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}`, {
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
		this.capture(`Result-${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}`, {
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
// .thenOpen(SITE.mission, function() {
// 	this.echo('签到页：' + this.evaluate(function() {
// 		__utils__.echo(document.title)
// 	}) )
// })

casper.run();