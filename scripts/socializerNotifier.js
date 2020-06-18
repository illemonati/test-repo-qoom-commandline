/*
	
	socializerNotifier.js

	This script will determine if there are any unread messages
	and send that person an email if there are any

*/

var mongodb = require('mongodb')
	, url = require('url')
	, path = require('path')
	, fs = require('fs')
	, async = require('async')
	, Configs = require('../config.js')
	, saver = require('../api/apps/saver/app.js')
	, emailer = require('../api/apps/emailer/app.js')
	, register = require('../api/apps/register/schemas.js')
	, educater = require('../api/apps/educater/schemas.js')
	, socializer = require('../api/apps/socializer/schemas.js')
	, socializerApp = require('../api/apps/socializer/app.js')
;

var start = new Promise(function(resolve, reject) {
		resolve();
	})
	, MongoClient = mongodb.MongoClient
	, configs = Configs()
	, registerDb = configs.MONGODB_URI
	, attachments = []
	, notify = function(err, message) {
 		console.log(err || message);
 	}
 	, personId = process.argv[2]
 	, person
 	, channels
 	, chats
 	//, personIds: ['5bdc8c5ff3abbb0004804d57', '5b807e681f9ea75e56667eb2']
;

function findPerson() {
	return new Promise((resolve, reject) => {
		notify(null, {message: 'Finding Person'});
		const findOptions = {
			filter: {
				_id: personId
			}
			, schemaName: 'person'
			, collectionName: 'Person'
			, schema: register.person
			, dbUri: registerDb
		};
		saver.schemaFind(findOptions, notify, (err, _people) => {
			if(err) {
				return reject(err);
			}
			person = _people[0];
			if(!person) {
				return reject('No person found');
			}
			notify(null, {message: `Found ${person.name}`});
			resolve();
		});
	});
}

function findChannels() {
	return new Promise((resolve, reject) => {
		notify(null, {message: 'Finding Channels'});
		const findOptions = {
			filter: {
				members: {$in: [personId]}
				, backupId: null }
			, schemaName: 'channel'
			, collectionName: 'Channel'
			, schema: socializer.channel
			, dbUri: registerDb
		};
		saver.schemaFind(findOptions, notify, (err, _channels) => {
			if(err) {
				return reject(err);
			}
			channels = _channels;
			notify(null, {message: `Found ${channels.length} channels`})
			resolve();
		});
	});
}

function findUnreadMessages(){
	return new Promise((resolve, reject) => {
		notify(null, {message: 'Finding Unread Messages'});
		const findOptions = {
			filter: {
				backupId: null
				, channel: {$in: channels.map(c => c._id) }
				, readBy: {$nin: [personId] }
			}
			, schemaName: 'chat'
			, collectionName: 'Chat'
			, schema: socializer.chat
			, dbUri: registerDb
			, select: '_id channel'
		}

		saver.schemaFind(findOptions, notify, (err, _chats) => {
			if(err) {
				return cb(err);
			}
			chats = _chats;
			notify(null, {message: `Found ${chats.length} unread chats`})
			resolve();			
		});
	})
}

function sendEmail(){
	return new Promise((resolve, reject) => {
		if(!chats || !chats.length) {
			notify(null, {message: 'Not sending email: No unread messages'});
			return resolve();
		}
		notify(null, {message: 'Sending Email'});
		let message = 'Here is a summary of your unread chats:\n\t';
		const chatSummary = chats
			.reduce((o,chat) => {
				o[chat.channel] = o[chat.channel] || 0;
				o[chat.channel]++;
				return o;				
			}, {});

		message += Object.keys(chatSummary)
			.map(channelId => {
				channelTitle = channels.find(channel => channel._id.toString() === channelId.toString()).title
				return `${channelTitle}: ${chatSummary[channelId]}`;
			})
			.join('\n\t');
		emailer.send({
			requestDomain: 'mrlera.wisen'
			, email: {
				text: message
				, to: [person.email]
				, subject: 'You have unread Wisen Space Socializer chats'
			} 
			, 
		}, notify, (err) => {
			if(err) {
				return reject(err);
			}
			notify(null, {message: 'Email Sent'})
			resolve();
		})
	});
}

if(!personId) {
	notify(null, {message: "NO PERSON GIVEN"})
	return;
}

start
	.then(findPerson)
	.then(findChannels)
	.then(findUnreadMessages)
	.then(sendEmail)
	.then(function() {
		notify(null, {message: 'DONE'});
		process.exit();
	})
	.catch(function(ex) {
		notify(ex);
		process.exit();
	});