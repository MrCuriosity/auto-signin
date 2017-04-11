document.addEventListener('DOMContentLoaded', ()=> {
	const $ = selector => document.querySelector(selector)
	const jsonToString = json => {
		let str = ''
		if (Object.prototype.toString.call(json) !== '[object Object]') {
			console.error('参数必须是json格式')
			return null;
		} else {
			var s = Object.keys(json).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}&`).join('')
			return s.slice(0, s.length - 1);
		}
	}

	$('input.username').addEventListener('keypress', e => onKeyPress(e))
	$('input.password').addEventListener('keypress', e => onKeyPress(e))
	$('#submit').addEventListener('click', e => fetchApi())

	var onKeyPress = e => {
		console.log(e)
		if (!!e.keyCode && e.keyCode === 13) {
			fetchApi()
		}
	}
	var fetchApi = ()=> {
		const username = $('[placeholder="Username"]').value
		const password = $('[placeholder="Password"]').value
		if (!username || !password || !username.trim() || !password.trim()) return;

		fetch('/daily/v2ex', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: jsonToString({ username, password })
		})
		.then(res => {
			return new Promise((resolve, reject)=> {
				console.log(res)
				if (res.status === 200) {
					resolve(res.text())
				} else {
					reject(res)
				}
			})
		})
		.then(result => {
			$('#res_title').innerHTML = `请求成功`
			$('#res_content').innerHTML = result
		}, reason => {
			$('#res_title').innerHTML = `出问题啦！`
			$('#res_content').innerHTML = reason
		})
		.catch( e => console.error(e))
	}
})













