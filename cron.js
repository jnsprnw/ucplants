// Setting up cron job
const CronJob = require('cron').CronJob

function createCron (events) {
	new CronJob('0 12 1-31 * *', function() {
		console.log('Water reminder running', new Date())
	  events.waterNeeded()
	}, null, true);
}

exports = module.exports = createCron