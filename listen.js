// Setting up Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const PORT = process.env.PORT

// Lodash requirements
const some = require('lodash/some')
const has = require('lodash/has')

function testForContent (text, arr) {
	return some(arr, item => {
		return item.includes(text)
	})
}

function testForWatered (text) {
	const phrases = ['gegossen', 'watered', 'fertig', 'done', 'finished']
	return testForContent(text, phrases)
}

function testForQuestion (text) {
	const phrases = ['zuletzt', 'wann', 'muss', 'anyone']
	return testForContent(text, phrases)
}

function createListener (events) {
	app.post('/', function (req, res, next) {
		const payload = req.body
		if (has(payload, 'challenge')) {
			// This only happens when registing the bot
			res.json({
				challenge: payload.challenge
			})
		} else if (payload.event.type === 'message') {
			if (testForWatered(payload.event.text)) {
				events.watered(payload.event)
			} else if (testForQuestion(payload.event.text)) {
				events.lastWateringQuestion()
			}
			res.sendStatus(200)
	  } else {
	  	res.sendStatus(200)
	  }
	})

	app.listen(PORT, function () {
	  console.log(`UCPlant bot listening on port ${PORT}!`)
	})
}

exports = module.exports = createListener

