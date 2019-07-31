'use strict'

const { chain, toPairs, sortBy, map, countBy, reverse } = require('lodash')

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

	getWateringsByUsers () {
		const waterings = this.db
			.get(KEY_WATERINGS)
		  .value()

		return chain(waterings)
			.map(KEY_USER)
			.countBy()
			.toPairs()
			.sortBy('1')
			.reverse()
			.value()
	}

	getMostRecentWatering () {
		return this.db
			.get(KEY_WATERINGS)
			.sortBy(KEY_DATE)
		  .takeRight(1)
		  .value()[0]
	}

	removeWatering () {
		const numberOfWaterings = this.db.get(KEY_WATERINGS).value().length

		this.db.get(`${KEY_WATERINGS}[${numberOfWaterings - 1}]`)
		  .remove()
		  .write()
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
}
