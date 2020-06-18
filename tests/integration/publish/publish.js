/*
	The purpose of this test to verify that a person can publish an app
	and then unpublish it
*/

const 
	url = require('url')
	, path = require('path')
	, async = require('async')
	, request = require('request')
	, fs = require('fs')
	, Configs = require('../../../config.js')
	, register = require('../../../api/apps/register/app.js')
	, saver = require('../../../api/apps/saver/app.js')
	, workerSchemas = require('../../../api/apps/worker/schemas.js')
	, apperSchemas = require('../../../api/apps/apper/schemas.js')
	, publishFlow = require('./resources/publishFlow.json')
	, unpublishFlow = require('./resources/unpublishFlow.json')
;

let fileData
	,person
	, publish_flow
	, unpublish_flow
	, files = []
	, appId
	, testSummary = {
		fail: 0, pass: 0
	}
;

const 
	start = new Promise(function(resolve, reject) {
		resolve();
	})
	, configs = Configs()
	, personName =  process.argv[2] || 'Jared Dev'
	, localPort = '8081'
	, filesToCreate = [
		'tetris.js', 'tetris.css', 'tetris.html', 'frog.png'
	]
	, filePrefix = 'publish_Test_'
	, route = 'publishTetrisx'
	, lowerCaseRoute = route.toLowerCase()
	, report = function(test, summary, result) {
		testSummary[result ? 'pass' : 'fail']++;
		console.log(`${result ? '✅': '❌'} ${test}: ${summary}`)
	}
	, notify = function(err, message) {
 		if(err) {
 			return console.error(err)
 		}
 		console.log(`----------------------------------------------`)
 		console.log(message)
 		console.log(`----------------------------------------------\n`)
 	}
;


function getPerson() {
	return new Promise(function(resolve, reject) {
		notify(null, `Getting Person: ${personName}`);
		register.findPerson(null, {name: personName}, (err, _person) => {
			if(err) {
				return reject(err)
			}
			if(!_person || _person.length === 0) {
				return reject(`Cannot find person ${personName}`);
			}
			person = _person;
			notify(null, `Found Person: ${personName}`);
			resolve();
		})
	});
}

function getPublishFlow() {
	return new Promise(function(resolve, reject) {
		notify(null, `Getting Publish Flow`);
		const name = publishFlow.name;
		workerSchemas.flow
			.then(model => {
				model.findOne({name}).exec((err, flow) => {

					if(err) {
						return reject(err);
					}
					// if(flow) {
					// 	publish_flow = flow;
					// 	notify(null, `Got Publish Flow`);
					// 	return resolve();				
					// }

					model.findOneAndUpdate(
						{name}
						, publishFlow
						, {upsert: true, new: true}
						, function(err, flow) {
							if(err) {
								return reject(err);
							}
							if(!flow) {
								return reject('No Published Flow Updated')
							}
							publish_flow = flow;
							notify(null, `Created Publish Flow`);
							return resolve();				
						}
					);
				});	
			})
			.catch(ex => reject(ex));
	});
}

function getUnpublishFlow() {
	return new Promise(function(resolve, reject) {
		notify(null, `Getting Unpublish Flow`);
		const name = unpublishFlow.name
		workerSchemas
			.flow.then(model => {
				model.findOne({name}).exec((err, flow) => {
					if(err) {
						return reject(err);
					}
					// if(flow) {
					// 	unpublish_flow = flow;
					// 	notify(null, `Got Unpublish Flow`);
					// 	return resolve();				
					// }

					model.findOneAndUpdate(
						{name}
						, unpublishFlow
						, {upsert: true, new: true}
						, function(err, flow) {
							if(err) {
								return reject(err);
							}
							unpublish_flow = flow;
							notify(null, `Created Unpublish Flow`);
							return resolve();				
						});
					});	
				})
			.catch(ex => reject(ex));
	});
}

function createFiles() {
	return new Promise(function(resolve, reject) {
		notify(null, `Creating Files: ${filesToCreate}`);

		fileData = filesToCreate.reduce((o, n) => {
			const encoding = n.endsWith('png') ? undefined : 'utf8'
			o[n] = fs.readFileSync(path.join('./resources', n), encoding);
			return o;
		}, {});
		saver.file
			.then(model => {
				async.each(Object.keys(fileData), (name, next) => {
					const doc = new model({
						name: (`${filePrefix}${name}`).toLowerCase()
						, encoding: name.endsWith('png') ? 'binary': 'utf8'
						, dateCreated: new Date()
						, dateUpdated: new Date()
						, appName: ''
						, subName: ''
						, isBackup: false
						, domain: person.ship.domain
						, contents: fileData[name]
						, modifyCount: 0
					})
					doc.save((err, file) => {
						if(err) {
							notify(err);
							return next(err);
						}
						if(!file) {
							const message = `Did not create file: ${doc.name}`
							notify(message);
							return next(message);
						}
						files.push(file);
						return next();				
					});
				}, (err) => {
					if(err) {
						return reject(err);
					}
					if(files.length !== filesToCreate.length) {
						return reject('Not enough files created')
					}
					notify(null, `Created Files: ${filesToCreate}`);
					resolve();
				})
			})
			.catch(ex => reject(ex));
	});
}

function publish() {
	let workId;
	const s = configs.REQUIREHTTP ? 's' : ''
		, domain = person.ship.name.split('.').length > 1 ? person.ship.name : person.ship.name + ':' + localPort
		, host =  `http${s}://${domain}`
		, file = files.find(f => f.name.endsWith('.html'))
		, tests = [
			function testAppState(next) {
				apperSchemas.app
					.then(model => {
						model
						.find({route: lowerCaseRoute, isBackup: false})
						.exec(function(err, resp) {
							if(err) {
								report(err, '', false);
								return next(err);
							}
							if(!resp) {
								report('No App Found after Publishing', '', false);
								return next('No App Found after Publishing')
							}
							if(resp.length > 1) {
								report('There are multiple apps with the same route', '', false);
								return next('There are multiple apps with the same route')
							}
							const app = resp[0];
							const fileId = file._id.toString();
							appId = app._id.toString();
							report('App should be in published state', app.state, app.state === 'published' );
							next();
						})
					})
					.catch(ex => {
						report(ex, '', false);
						next(ex)
					});
			},
			function testFileState(next) {
				saver.file.then(model => {
					model
					.findOne({isBackup: true, app: appId, name: file.name})
					.exec((err, resp) => {
						if(err) {
							report(err, '', false);
							return next(err);
						}
						if(!resp) {
							report('No File Found', '', false);
							return next('No File Found')
						}
						report('File should have the app id', resp.app, resp.app.toString() === appId )
						report('File should be a backup', resp.isBackup, resp.isBackup )
						next();
					})
				})
				.catch(ex => {
					report(ex, '', false);
					next(ex)
				});
			}
		]

	return new Promise(function(resolve, reject) {
		notify(null, `Publishing`);
		request.post({
			uri: `${host}/work`
			, headers: {
				Cookie: `passcode=${person.ship.passcode};`
				, Referer: host
			}
			, json: {
				input: {
					description: ''
					, emails: ''
					, icon: ''	
					, id: file._id
					, route: route
					, screenshots: ''
					, share: 'Yes'
					, tags: ''
					, title: route
				}
				, name: publishFlow.name
				, startImmediately: true
			}
		}, function(err, resp) {
			if(err) return reject(err);
			if(!resp || !resp.body || !resp.body.socketId) return reject('missing work id');
			workId = resp.body.socketId;
			let workDone = false;
			async.until(
				() => workDone,
				(next) => { 
					workerSchemas.work.then(model => {
						model.findById(workId).exec((err, work) => {
							if(err) next(err);
							if(!work) return next('No Work Found For Publishing App')
							if(work.status !== 'completed') return setTimeout(next, 1000);
							workDone = true;
							return next();
						})
					})
				},
				(err) => {
					if(err) return reject(err);
					async.series(tests, (err) => {
						if(err) return reject(err);
						notify(null, `Published`);
						resolve();
					})
				}
			);
		});
	});
}

function navigate() {
	let results = {};
	const s = configs.REQUIREHTTP ? 's' : ''
		, domain = person.ship.name.split('.').length > 1 ? person.ship.name : person.ship.name + ':' + localPort
		, host =  `http${s}://${domain}`
		, file = files.find(f => f.name.endsWith('.html'))
		, referer = `${host}/app/${route}`
		, pathsToNavigateTo = [referer]
								.concat(
									filesToCreate
									.filter(f => !f.endsWith('.html'))
									.map(f => `${referer}/${filePrefix}${f}`)
								)
		, tests = [
			function testResponses(next) { 
				Object.keys(results).forEach(path => {
					if(path.endsWith('png')) return;
					const result = results[path];
					const isGood = result && Object.keys(fileData).map(k => fileData[k]).includes(result);
					const summary = isGood ? 'Good' : result;
					report(`Path, ${path}, should have valid contents`,  summary,  isGood );
				})
				next();
			}
			, function testResourcesState(next) { 
				saver.file.then(model => {
					model.find({
						app: appId
					}).exec((err, resp) => {
						if(err) reject(ex);
						next(); 
					})
				}).catch(ex => reject(ex));
			}
		]
	;

	return new Promise(function(resolve, reject) {
		notify(null, 'Navigating');
		async.eachSeries(pathsToNavigateTo, (path, next) => {
			request({url: path, headers: {referer: referer}}, (err, resp) => {
				if(err) return next(err);
				if(!resp) return next(`No response for ${path}`);
				results[path] = resp.body;
				next();
			})
			
		},(err) => {
			if(err) {
				return reject(err);
			}
			async.series(tests, (err) => {
				if(err) return reject(err);
				notify(null, 'Navigated');
				resolve();
			});
		});
	});	
}

function pause() {
	return new Promise(function(resolve, reject) {
		const
			stdin = process.stdin
			, stdout = process.stdout
		;
		// TODO: NAVIGATE TO EACH OF THE FILES USING REQUESTS
		stdin.resume();
		stdout.write('Enter something to continue:\n');

		stdin.once('data', function (data) {
		    //callback(data.toString().trim());
		    return resolve();
		});
		
	});	
}

function unpublish() {
	const s = configs.REQUIREHTTP ? 's' : ''
		, domain = person.ship.name.split('.').length > 1 ? person.ship.name : person.ship.name + ':' + localPort
		, host =  `http${s}://${domain}`
		, tests = [
			function testAppState(next) {
				apperSchemas.app
					.then(model => {
						model
						.find({route: lowerCaseRoute, isBackup: true})
						.exec(function(err, resp) {
							if(err) {
								report(err, '', false);
								return next(err);
							}
							if(!resp || !resp.length) {
								report('No App Found after Unpublishing', '', false);
								return next('No App Found after Unpublishing')
							}
							if(resp.length > 1) {
								report('There are multiple apps with the same route', '', false);
								return next('There are multiple apps with the same route')
							}
							const app = resp[0];
							const file = files.find(f => f.name.endsWith('.html'))
							const fileId = file._id.toString();
							appId = app._id.toString();
							report('App should be in unpublished state', app.state, app.state === 'notpublished' );
							next();
						})
					})
					.catch(ex => {
						report(ex, '', false);
						next(ex)
					});
			},
			function testFileState(next) {
				const file = files.find(f => f.name.endsWith('.html'))
				saver.file.then(model => {
					model
					.findOne({isBackup: false, app: appId, name: file.name})
					.exec((err, resp) => {
						if(err) {
							report(err, '', false);
							return next(err);
						}
						if(resp) {
							report('App still attached to file', '', false);
							return next()
						}
						report('App is not attached to file', '', true);
						next();
					})
				})
				.catch(ex => {
					report(ex, '', false);
					next(ex)
				});
			}
		]
	;
	return new Promise(function(resolve, reject) {
		notify(null, `Unpublishing`);
		const file = files.find(f => f.name.endsWith('.html'))
		request.post({
			uri: `${host}/work`
			, headers: {
				Cookie: `passcode=${person.ship.passcode};`
				, Referer: host
			}
			, json: {
				input: {
					id: file._id
				}
				, name: unpublishFlow.name
				, startImmediately: true
			}
		}, function(err, resp) {
			if(err) return reject(err);
			if(!resp || !resp.body || !resp.body.socketId) return reject('missing work id');
			workId = resp.body.socketId;
			let workDone = false;
			async.until(
				() => workDone,
				(next) => { 
					workerSchemas.work.then(model => {
						model.findById(workId).exec((err, work) => {
							if(err) next(err);
							if(!work) return next('No Work Found For Unublishing App')
							if(work.status !== 'completed') return setTimeout(next, 1000);
							workDone = true;
							return next();
						})
					})
				},
				(err) => {
					if(err) return reject(err);
					async.series(tests, (err) => {
						if(err) return reject(err);
						notify(null, `Unpublished`);
						resolve();
					})
				}
			);
		});
	});
}

function deleteApp() {
	return new Promise(function(resolve, reject) {
		notify(null, `Deleting App: ${route}`);
		const name = route;
		apperSchemas.app
			.then(model => {
				model
				.remove({name})
				.exec(function(err, resp) {
					if(err) {
						return reject(err);
					}
					notify(null, `Deleted App: ${route}`);
					resolve();
				})
			})
			.catch(ex => reject(ex));
	});
}

function deleteFiles() {
	return new Promise(function(resolve, reject) {
		notify(null, `Deleting Files`);

		const filesToDelete = filesToCreate.map(f => `${filePrefix}${f}`);
		saver.file
			.then(model => {
				async.each(filesToDelete, (name, next) => {
					model
						.remove({name: name.toLowerCase()})
						.exec(function(err) {
							if(err) {
								notify(err);
								return next(err);
							}
							return next();				
						})
				}, (err) => {
					if(err) {
						return reject(err);
					}
					notify(null, `Deleted Files: ${filesToCreate}`);
					resolve();
				})
			})
			.catch(ex => reject(ex));
	});
}



start
	.then(getPerson)
	.then(getPublishFlow)
	.then(getUnpublishFlow)
	.then(deleteFiles)
	.then(deleteApp)
	.then(createFiles)
	.then(publish)
	.then(navigate)
	.then(pause)
	.then(unpublish)
	.catch(function(ex) {
		notify(ex);
	})
	//.then(pause)
	.then(deleteFiles)
	.then(deleteApp)
	.catch(function(ex) {
		notify(ex);
		process.exit();
	})
	.then(function() {
		notify(null, 'DONE');
		console.log(JSON.stringify(testSummary, null, '\t'));
		process.exit();
	});