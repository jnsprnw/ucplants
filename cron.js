// Setting up cron job
const CronJob = require('cron').CronJob

function createCron (waterings) {
	new CronJob('*/40 * * * * *', function() {
		console.log(waterings.answerWatering())
	  // console.log('You will see this message every second');
	}, null, true);
}

exports = module.exports = createCron