const { random } = require('lodash')
const { format } = require('timeago.js')
const converter = require('number-to-words')
const diffDates = require('diff-dates')

function randomItem (arr) {
  const i = random(0, arr.length - 1)
  return arr[i]
}

module.exports = class Person {
  constructor (waterings, postwoman, planttime) {
    this.waterings = waterings
    this.postwoman = postwoman
    this.planttime = planttime
  }

  didNotUnderstand (event) {
    const messages = [`I’m sorry, <@${event.user}>. I did not understand that.`]
    messages.push(`Did you watered the plants? Write something with »done«, »fertig«, »erledigt« or try something similar.`)
    messages.push(`Do you want to know when the last watering was? Write somethin with »when«, »zuletzt«, »last«, …`)
    messages.push(`Did you trigger a watering by mistake? Write »mistake«, »Fehler«, »vertan«, …`)
    messages.push(`Or try »Highscore« if you dare`)
    this.postwoman.sendMessage(messages.join('\n'))
  }

  mistake (event) {
    console.log('Mistake event triggered')
    this.waterings.removeWatering()
    this.postwoman.sendMessage(`The last watering was removed`)
  }

  plantTime () {
    console.log('PlantTime event triggered')
    this.postwoman.sendMessage(`It’s Monday – That means it’s PlantTime :nerd_face:!\nLearn something new about plants: ${this.planttime.getLink()}`)
  }

  watered (event) {
    console.log('Watered event triggered')
    this.waterings.addWatering(event)
    this.postwoman.sendMessage(`Thank you so much <@${event.user}>! ${randomItem([':deciduous_tree:', ':earth_africa:', ':green_heart:', ':cherry_blossom:', ':herb:', ':ear_of_rice:', ':cactus:', ':palm_tree:', ':evergreen_tree:'])}`)
  }

  lastWateringQuestion () {
    console.log('Question event triggered')
    const { date, user } = this.waterings.getMostRecentWatering()
    const wateringsByUser = this.waterings.getWateringsByUser(user)

    const answer = `<@${user}> watered them ${format(date)}. She or he did that already ${wateringsByUser} times!`
    this.postwoman.sendMessage(answer)
  }

  overallScoringQuestion () {
    console.log('Highscore event triggered')
    const rank = this.waterings.getWateringsByUsers()
    const messages = []
    for (let i = 0; i < 3; i++) {
      if (i + 1 <= rank.length) {
        const [user, n] = rank[i]
        messages.push(`<@${user}> is on the ${converter.toWordsOrdinal(i + 1)} place with ${n} watering${n === 1 ? '' : 's'}`)
      }
    }
    if (rank.length === 1) {
      messages.push(`Looks like <@${rank[0][0]}> is doing all the work. Let’s buy her/him a ${randomItem(['coffee', 'ice cream', 'meal', 'flower'])}!`)
    }
    this.postwoman.sendMessage(messages.join('\n'))
    // console.log(messages.join('\n'))
  }

  waterNeeded (odd) {
    const { date } = this.waterings.getMostRecentWatering()
    const diff = diffDates(new Date(), new Date(date) , 'days')

    if (diff > 5) {
      switch (diff) {
        case 6:
          this.postwoman.sendMessage(`Just a quick reminder that someone should water the plants tomorrow :)${odd ? ' (PS: No watering this week for Severina and Zamy)' : ''}`)
          break
        case 7:
          this.postwoman.sendMessage(`Anyone up for watering the plants today?${odd ? ' (PS: Severina and Zamy are good this week.)' : ''}`)
          break
        case 8:
          this.postwoman.sendMessage(`Someone should have watered the plants yesterday, but I give you another chance today :)${odd ? ' (PS: As you know: no watering this week for Severina and Zamy)' : ''}`)
          break
        default:
          const messages = ['Hey people! Plants need water, too! :fallen_leaf:', 'Why does no one love plants anymore? :wilted_flower:', 'Did we do something wrong?']
          this.postwoman.sendMessage([randomItem(messages), `It’s been ${diff} days since the last watering`].join('\n'))
          break
      }
    }
  }
}
