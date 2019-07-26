// Setting up request
const request = require('request')

// Application
function sendMessage (text) {
  console.log(text)
  // request.post('https://slack.com/api/chat.postMessage', {
  //   auth: {
  //     'Bearer': 'xoxp-6447579696-7091783879-695747666661-2eb268cd84883a011d92d7d9f451e502'
  //   },
  //   headers: {
  //     'content-type': 'application/xml'
  //   },
  //   body: {
  //     text,
  //     'channel': 'plants'
  //   }
  // })
}

exports = module.exports = sendMessage