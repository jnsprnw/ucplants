require('dotenv').config()

const listen = require('./listen')
const cron = require('./cron')
const Messenger = require('./message')
const messages = new Messenger('plants')

const Logbook = require('./logbook')
const waterings = new Logbook('db.json')

listen(waterings, messages)

cron(waterings)
