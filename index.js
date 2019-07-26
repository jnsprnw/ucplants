require('dotenv').config()

const listen = require('./listen')
const cron = require('./cron')
const sendMsg = require('./message')

const Logbook = require('./logbook')
const waterings = new Logbook('db.json')

listen(waterings, sendMsg)

cron(waterings)
