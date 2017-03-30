/** requirements */
const express = require('express')
const path = require('path')
const signin = require('./services/v2ex_sign.js')
const config = require('./config.js')
/** variables */
const PORT = config.PORT
const HOST = config.HOST
const SIGNIN_SITE = config.SIGNIN_SITE
const DAILY_SITE = config.DAILY_SITE
const headers = config.headers
const app = express()

// signin({ sign_site: SIGNIN_SITE })

/** configuration */
app.use(express.static(path.join(__dirname, '/public')))

/** router */
app.get('/', (req, res)=> {
	res.status(200).send(path.join(__dirname, 'public', 'index.html'))
})

/** server */
app.listen(PORT, HOST, err => {
	if (err) console.error
	console.log(`App is running on ${HOST}:${PORT}`)
})



















