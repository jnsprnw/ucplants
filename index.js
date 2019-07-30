require('dotenv').config()

const listen = require('./listen')
const cron = require('./cron')

const Messenger = require('./message')
const postwoman = new Messenger('plants')

const Logbook = require('./logbook')
const waterings = new Logbook('db.json')

const EventHandler = require('./events')
const events = new EventHandler(waterings, postwoman)

listen(events)

cron(waterings)
