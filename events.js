// const { isNull, get, filter } = require('lodash')

module.exports = class Person {
  constructor (waterings, postwoman) {
    this.waterings = waterings
    this.postwoman = postwoman
  }

  watered (event) {
    console.log('Watered event triggered')
    this.waterings.addWatering(event)
    this.postwoman.sendMessage(`Danke, <@${event.user}>!`)
  }

  lastWateringQuestion () {
    const answer = this.waterings.answerWatering()
    this.postwoman.sendMessage(answer)
  }
}
