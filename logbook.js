'use strict'

const { format } = require('timeago.js')

// Setting up LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const KEY_WATERINGS = 'waterings'
const KEY_DATE = 'date'
const KEY_USER = 'user'
const KEY_COUNT = 'count'

module.exports = class Person {
	constructor (db) {
		const adapter = new FileSync(db)
		this.db = low(adapter)
		this.db.defaults({ [KEY_WATERINGS]: [], [KEY_COUNT]: 0 }).write()
	}

	// Helper methods
	getWateringsByUser (user) {
		return this.db
			.get(KEY_WATERINGS)
			.filter({ [KEY_USER]: user })
		  .value()
		  .length
	}

	getMostRecentWatering () {
		return this.db
			.get(KEY_WATERINGS)
			.sortBy(KEY_DATE)
		  .takeRight(1)
		  .value()[0]
	}

	addWatering ({ user }) {
		this.db
			.update([KEY_COUNT], n => n + 1)
			.get(KEY_WATERINGS)
		  .push({
		  	[KEY_DATE]: new Date(),
		  	[KEY_USER]: user
		  })
		  .write()

		console.log('Watering added')
	}

	answerWatering () {
		const { date, user } = this.getMostRecentWatering()

		const wateringsByUser = this.getWateringsByUser(user)

		console.log('Waterings requested')

		return `${user} watered them ${format(date)}. She or he did that already ${wateringsByUser} times!`
	}
}
