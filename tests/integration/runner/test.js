/* 

	test.js

	This page will be used to test running python scripts from runner

*/


const mongodb = require('mongodb')
	, url = require('url')
	, path = require('path')
	, fs = require('fs')
	, async = require('async')
	, request = require('request')
	, Configs = require('../../../config.js')
	, worker = require('../../../api/apps/worker/app.js')
	, helper = require('../../../api/apps/helper/app.js')
;

const
	workData = {
		input: {
			domain: 'wisen'
			, file: 'test.py'
		},
		name: 'run_python_script'
	}
	domain = 'wisen';
;

console.log(`Running Flow`);
flow = JSON.parse(JSON.stringify(workData));
flow.input = flow.input || {};
flow.input.requestDomain = domain;


let calledOnce = false;
worker.initializeTask({flow}, null, function(err, work) {
	if(err) {
		console.log(err, `Error in registering work flow`);
		process.exit();
		return //next(err);
	}
	origFlow = flow;
	worker.start({work, domain, origFlow}, console.log, (err, data)=> {
		if(err) {
			console.log(`Error in starting work flow: ${err}`);
			process.exit();
			return //next(err);
		}
		if(calledOnce) return;
		calledOnce = true;
		console.log(`DONE`, data);
		process.exit();
		//next();
	});	
});

