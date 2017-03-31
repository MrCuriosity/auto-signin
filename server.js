/** requirements */
const express = require('express')
const path = require('path')
const parser = require('body-parser')
const multer = require('multer')
const signin = require('./services/v2ex_sign.js')
const config = require('./config.js')
/** variables */
const PORT = config.PORT
const HOST = config.HOST
const SIGNIN_SITE = config.SIGNIN_SITE
const DAILY_SITE = config.DAILY_SITE
const headers = config.headers
const upload = multer()
const app = express()

/** configuration */
app.use(express.static(path.join(__dirname, '/public')))
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

/** router */
app.get('/', (req, res)=> {
	res.status(200).send(path.join(__dirname, 'public', 'index.html'))
})
app.post('/daily/v2ex', upload.any(), (req, res)=> {
	const username = req.body.username
	const password = req.body.password
	signin({ sign_site: SIGNIN_SITE, username, password })
	.then( result => {
		res.status(200).send(result)
	})
})

/** server */
app.listen(PORT, HOST, err => {
	if (err) console.error
	console.log(`App is running on ${HOST}:${PORT}`)
})



















