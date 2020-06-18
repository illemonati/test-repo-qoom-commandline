/*
Run this inside of heroku (run bash)
*/

const async = require('async')
	, helper = require('../api/apps/helper/app.js')
	, saver = require('../api/apps/saver/app.js')
	, worker = require('../api/apps/worker/app.js')
	, register = require('../api/apps/register/app.js')
	, mongoer = require('../api/apps/mongoer/app.js')
	, educater = require('../api/apps/educater/app.js')
	, transacter = require('../api/apps/transacter/app.js')
	, emailer = require('../api/apps/emailer/app.js')
;

helper.initialize();
saver.initialize();
worker.initialize();
mongoer.initialize();
register.initialize();
educater.initialize();
transacter.initialize();
emailer.initialize();

worker.start({
	work: {_id: "5e9760e27cad8c0025b86bb1"}
	, domain: 'www.applied-computing.org'
	, origFlow: { name: 'wisenschool_multiple_curriculum_purchase'}
}, console.log, (err, res) => {
	console.log(err || 'DONE');
	process.exit();
})