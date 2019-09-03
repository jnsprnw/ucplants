// Setting up cron job
const CronJob = require('cron').CronJob

function createCron (events) {
	new CronJob('0 0 12 1-31 * *', function() {
		console.log('Water reminder running', new Date())
	  events.waterNeeded()
	}, null, true);

	new CronJob('0 0 9 * * 1', function() {
		console.log('Plant time!', new Date())
	  events.plantTime()
	}, null, true);
}

exports = module.exports = createCron