/* 
	Random Temp Subdomain Maintainer

	This script will continuoulsy create and destroy subdomains so that there will be a set of subdomains available for demoing purposes

*/

const provisioner = require('./app.js')
	, async = require('async')
	, helper = require('../helper/app.js')
;

const 
	generateCount = 20
	, subdomainPrefix = 'xx-'
	, dynoName = process.env.dynoName || 'qoom-disposable-ships'
	, domainName = process.env.domainName || 'qoom.space'
	, start = new Promise(function(resolve, reject) {
		resolve();
	})
	, notify = function(err, message) {
 		console.log(err || message);
 	}
;


function getTempSubdomains() {
	return new Promise(function(resolve, reject) {
		provisioner.getHerokuSubDomains({dynoName}, notify, (err, subdomains) => {
			if(err) {
				return reject(err);
			}
			subdomains = subdomains.filter(subdomain => subdomain.hostname.startsWith(subdomainPrefix));
			notify(null, {message: `Got ${subdomains.length} temporary subdomains`});
			resolve();			
		});
	});
}

function deleteTempSubdomains() {
	return new Promise(function(resolve, reject) {
		provisioner.clearAllHerokuSubDomains({dynoName}, notify, (err, log) => {
			if(err) {
				return reject(err);
			}
			console.log(log);
			notify(null, {message: `Deleted All Subdomains`})
			resolve();			
		});
	});
}

function deleteFiles() {
	return new Promise(function(resolve, reject) {
		notify(null, {message: 'Deleting Files'})
		notify(null, {message: 'Not Implemented'});
		resolve();
	});
}

function generateTempSubdomains() {
	return new Promise(function(resolve, reject) {
		let tempSubDomains = [];
		while (tempSubDomains.length < generateCount) {
			tempSubDomains.push(`${subdomainPrefix}${helper.generateRandomString().toLowerCase()}.${domainName}`);
		}
		let createdSubDomains = [];
		async.eachLimit(tempSubDomains, 5, (domain, next) => {
			provisioner.addSubDomainToHeroku({
				domain, dynoName
			}, notify, (err, domainData) => {
				if(err) {
					return next(err);
				}
				createdSubDomains.push(domainData);
				next();
			});
		}, (err) => {
			if(err) {
				return reject(err);
			}
			notify(null, {message: `Created ${createdSubDomains.length} subdomains`});
			resolve();			
		})
	});
}

start
	.then(getTempSubdomains)
	.then(deleteTempSubdomains)
	.then(deleteFiles)
	.then(generateTempSubdomains)
	.then(function() {
		notify(null, {message: 'DONE'});
		process.exit();
	})
	.catch(function(ex) {
		notify(ex);
		process.exit();
	});