// Setting up Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Setting up LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ waterings: [], count: 0 })
  .write()

// Setting up cron job
const CronJob = require('cron').CronJob

// Setting up request
const request = require('request')

// Lodash requirements
const some = require('lodash/some')
const { format } = require('timeago.js');

// Application
function sendMessage (text) {
	request.post('https://slack.com/api/chat.postMessage', {
	  auth: {
	    'Bearer': 'xoxp-6447579696-7091783879-695747666661-2eb268cd84883a011d92d7d9f451e502'
	  },
	  headers: {
      'content-type': 'application/xml'
    },
    body: {
		  text,
		  'channel': 'plants'
		}
	})
}

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

function addWatering ({ user }) {
	db
		.update('count', n => n + 1)
		.get('waterings')
	  .push({
	  	date: new Date().toUTCString(),
	  	user
	  })
	  .write()
}

function answerWatering () {
	const event = db
		.get('waterings')
		.sortBy('date')
	  .takeRight(1)
	  .value()[0]

	const { date, user } = event

	const eventsByUser = db
		.get('waterings')
		.filter({ user: user })
	  .value()

	return `${user} watered them ${format(date)}. She or he did that already ${eventsByUser.length} times!`
}

app.post('/', function (req, res, next) {
	const payload = req.body
	// console.log(payload)
	if (payload.event.type === 'message') {
		if (testForWatered(payload.event.text)) {
			res.send('Danke!')
			sendMessage('Danke!')
			addWatering(payload.event)
		} else if (testForQuestion(payload.event.text)) {
			// res.send('Did you question?')
			const answer = answerWatering()
			console.log('Question')
			sendMessage(answer)
			res.send(answer)
		} else {
			res.send('Sorry, I didn’t get that')
		}
  } else {
  	res.sendStatus(200)
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true);

