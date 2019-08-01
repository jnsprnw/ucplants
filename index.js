require('dotenv').config()

const listen = require('./listen')
const cron = require('./cron')

const Messenger = require('./message')
const postwoman = new Messenger('plants')

const Logbook = require('./logbook')
const waterings = new Logbook('db.json')

const LinkList = require('./linklist')
const planttime = new LinkList('planttime.json')

const EventHandler = require('./events')
const events = new EventHandler(waterings, postwoman, planttime)

listen(events)

events.overallScoringQuestion()

cron(events)
