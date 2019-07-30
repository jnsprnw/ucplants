const { isNull, get, filter } = require('lodash')

// Setting up request
const request = require('request')

const BEARER = process.env.BEARER

function sendRequest (endpoint, body, callback) {
  request.post(`https://slack.com/api/${endpoint}`, {
    auth: {
      'bearer': BEARER
    },
    json: body
  },
  callback)
}

module.exports = class Person {
  constructor (channelName) {
    this.channelID = false
    this.getChannelID(channelName)
  }

  getChannelID (channelName) {
    console.log(`Requesting list of channels. Looking for »${channelName}«`)
    sendRequest('channels.list', undefined, (error, response, body) => {
      if (!error) {
        const channels = get(JSON.parse(body), 'channels', [])
        const channel = filter(channels, { name: channelName })
        const channelID = get(channel, [0, 'id'])
        if (channelID) {
          this.channelID = channelID
          console.log(`Channel ID found: ${channelID}`)
          this.sendInitMessage()
        } else {
          console.log(`Error occured during channel finding. Unable to find channel called »${channelName}«`)
        }
      } else {
        console.log('Error occured during channel list request. Unable to get avaible channel list')
        console.log(error)
      }
    })
  }

  sendMessage (text) {
    sendRequest('chat.postMessage', {
      text,
      channel: this.channelID
    }, (error, response, body) => {
      if (error) {
        console.log(error)
      }
    })
  }

  sendInitMessage () {
    this.sendMessage(`Hello everyone, I’m your personal and very smart (!) plant watering bot.`)
  }
}
