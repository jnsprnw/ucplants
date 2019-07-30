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

function createListener (waterings, msg) {
	app.post('/', function (req, res, next) {
		const payload = req.body
		if (has(payload, 'challenge')) {
			res.json({
				challenge: payload.challenge
			})
		} else if (payload.event.type === 'message') {
			// console.log(payload)
			if (testForWatered(payload.event.text)) {
				res.send('Danke!')
				msg.sendMessage('Danke!')
				// console.log('Danke!')
				// sendMessage('Danke!')
				waterings.addWatering(payload.event)
			} else if (testForQuestion(payload.event.text)) {
				// res.send('Did you question?')
				const answer = waterings.answerWatering()
				msg.sendMessage('Question')
				// sendMessage(answer)
				msg.sendMessage(answer)
				// res.send(answer)
				res.send('Question')
			} else {
				res.send('Sorry, I didn’t get that')
			}
	  } else {
	  	res.sendStatus(200)
	  }
	})

	app.listen(PORT, function () {
	  console.log(`UCPlant bot listening on port ${PORT}!`)
	})
}

exports = module.exports = createListener

