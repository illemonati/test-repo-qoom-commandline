			/*
			The question now is if I get an approval from stripe
			I should then start the desired process.
			The desired process should be in the config file since 
			I dont trust the client. So basically I read from the config file
			what to do when a certain referrer makes the request.
			Need to also:
			1. Verify that that product bought matches the request (look at how much the credit card was processed for)
			-> Actually I just need to send the product name, for that is what I am going to be charging
			2. How to create an user: Utilize email or do I have everything on their space.
			If I have everything on their space then I just need provide a link
			to their page and a special key that they cannot forget.
			Their email is no longer their identity but their page is.
			Next step: https://stripe.com/docs/subscriptions/quickstart 
			but use their email.
			So the flow is:
			1. Create a customer with their domain name
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("");

const customer = stripe.customers.create({
  email: 'SUBDOMAIN@QOOM.SPACE, <-- Hopefully this isnt required
  url: subdomain.qoom.space
});
			2. Charge the card
			3. Create system
			4. Have them navigate to their page.
			5. Have a way for them to email their information if they'd like
			 */


var Stripe = require('stripe')
	, Configs = require('../../../../config.js')
	, logger = require('../../logger/app.js')
	, async = require('async')
;

function transact(options, notify, cb) {
	notify = notify || logger.notify;
	let {metadata, amount, currency, description, token} = options;

	function checkOptions(next) {
		let errors = [];
		if(!metadata) errors.push('No Metadata Provided');
		if([undefined, null, ''].includes(amount) || isNaN(amount)) errors.push(`No Amount Provided`);
		metadata = JSON.parse(JSON.stringify(metadata));
		delete metadata.token;
		if(!description) errors.push('No Description Provided');
		if(!token || !token.id) errors.push('No Token Provided');
		currency = currency || 'usd';
		if(errors.length) return next(errors.join(', '));
		next(null);
	}

	function swipeCard(next) {
		var key = Configs().transacter.stripe.key
			, stripe = Stripe(key)
			, customer = stripe.customers.create({
				metadata: metadata, source: token.id
			});
		;
		customer.then(function(cust) {
			const charge = stripe.charges.create({
				amount: amount*100
				, currency: currency
				, description: description
				, customer: cust.id
			});
			charge
				.then(function(transactionData) {
					const source = transactionData.source || {};
					next(null, {
						raw: transactionData
						, last4: source.last4
						, brand:  source.brand
					})
				})
				.catch(next)
		}).catch(next);
	}

	async.waterfall([
		checkOptions
		, swipeCard
	], (err, output) => {
		cb(err, output)
	});
}


function subscribe(options, notify, cb) {
	const key = Configs().transacter.stripe.key
		, stripe = Stripe(key)
		, { person, plan } = options
	;

	let output, customer;

	function check(next) {
		if(!person) return next('No person provided');
		if(!plan) return next('No plan provided');

		customer = person && person.data && person.data.stripe && person.data.stripe.customer;
		if(!customer) return next('No customer provided');

		if(!customer.id) return next('No customer id provided');

		next();
	}

	function doit(next) {
		var subscription = stripe.subscriptions.create({
			customer: customer.id,
			items: [{ plan }]
		});
		subscription.then(function(resp) {
			output = resp;
			next();
		}).catch(ex => next(ex));
	}

	async.waterfall([
		check, doit
	], (err) => {
		if(err) return cb(err);
		cb(null, output);
	})
}

function createCustomer(options, notify, cb) {
	notify = notify || function() {};
	const { person, token } = options;
	let hasCustId = false, metadata;

	function check(next) {
		if(!person) return next('No person provided');
		hasCustId = !!(person && person.data && person.data.stripe && person.data.stripe.customer);

		if(!options.metadata) return next('No metadata provided');
		metadata = JSON.parse(JSON.stringify(metadata));
		delete  metadata.token;
		next();
	}

	function create(next) {
		if(hasCustId) return next();
		const key = Configs().transacter.stripe.key
			, stripe = Stripe(key)
			, customer = stripe.customers.create({
				metadata: metadata, source: token.id
			});
		;
		customer.then(function(cust) {
			person.data.stripe.customer = cust
		}).catch(next);
	}

	async.waterfall([
		check
		, create
	], (err) => {
		if(err) return cb(err);
		cb(null, person)
	})
}

module.exports = {
	transact, subscribe, createCustomer
}