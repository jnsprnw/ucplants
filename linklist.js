'use strict'

// Setting up LowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const KEY_QUEUE = 'queue'
const KEY_ARCHIVE = 'archive'

module.exports = class Person {
	constructor (db) {
		const adapter = new FileSync(db)
		this.db = low(adapter)
	}

	getLink () {
		const nextLink = this.db
			.get(KEY_QUEUE)
			.take(1)
			.value()[0]

		this.db
			.get(KEY_QUEUE)
			.remove((link, i) => {
				return i === 0
			})
			.write()

		this.db
			.get(KEY_ARCHIVE)
			.push(nextLink)
			.write()

		return nextLink
	}
}
