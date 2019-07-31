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
		return text.toLowerCase().includes(item)
	})
}

function testForWatered (text) {
	const phrases = ['fertig', 'done', 'finished', 'plitsch', 'platsch', 'erledigt']
	return testForContent(text, phrases)
}

function testForQuestion (text) {
	const phrases = ['zuletzt', 'wann', 'when', 'last']
	return testForContent(text, phrases)
}

function testForMistake (text) {
	const phrases = ['falsch', 'mistake', 'fehler', 'vertan']
	return testForContent(text, phrases)
}

function testForHighscore (text) {
	const phrases = ['highscore']
	return testForContent(text, phrases)
}

function createListener (events) {
	app.post('/', function (req, res, next) {
		const payload = req.body
		if (has(payload, 'challenge')) {
			// This only happens when registering the bot
			res.json({
				challenge: payload.challenge
			})
		} else if (payload.event.type === 'message' && has(payload.event, 'user') && has(payload.event, 'subtype')) {
			if (testForWatered(payload.event.text)) {
				events.watered(payload.event)
			} else if (testForHighscore(payload.event.text)) {
				events.overallScoringQuestion()
			} else if (testForQuestion(payload.event.text)) {
				events.lastWateringQuestion()
			} else if (testForMistake(payload.event.text)) {
				events.mistake()
			} else {
				events.didNotUnderstand(payload.event)
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

