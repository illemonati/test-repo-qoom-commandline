var stripe = Stripe('{{stripeToken}}');
var elements = stripe.elements();

var style = {
base: {
	fontSize: '16px',
	color: '#32325d',
	},
};


var card = elements.create('card', {style: style});
card.mount('#card-element');

card.addEventListener('change', ({error}) => {
const displayError = document.getElementById('card-errors');
if (error) {
		displayError.textContent = error.message;
	} else {
		displayError.textContent = '';
	}
});

var submitted = false;

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');

// VALIDATE INPUTS
var $inputs = document.querySelectorAll('.input-items input');
var $selects = document.querySelectorAll('.input-items select');
var $emails = document.querySelectorAll('.email input');
var domainToPurchase = document.querySelector('#domainname').value;
var $checkbox = document.querySelector('#checkbox1');
var $autorenewdates = document.querySelectorAll('.autorenewdate');
var $autorenewdays = document.querySelectorAll('.autorenewday');
var domainPrice = parseFloat(document.querySelector('.domain-price').innerText);
var monthlyPrice = parseFloat(document.querySelector('.monthly-price').innerText);
var annualPrice = parseFloat(document.querySelector('.annual-price').innerText);
var $totalDueWithMonthlyPrices = document.querySelectorAll('.total-amount.monthly-info');
var $totalDueWithAnnualPrices = document.querySelectorAll('.total-amount.annual-info');
var $confirmSubscriptionBtn = document.querySelector('#confirmSubscriptionBtn');
var $termsandconditions = document.querySelector('#tacs');
var tacTemplate = $termsandconditions.innerHTML; 
var tacData = {{TACDATA}};
var togglePaymentCycleBtn = document.querySelector('input[name=toggleSwitch]');

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var today = new Date();
var todayMonth = `${months[today.getMonth()]}`;
var todayDate = `${today.getDate()}<sup>${today.getDate() === 1 ? 'st' : today.getDate() === 2 ? 'nd' : today.getDate() === 3 ? 'rd' : 'th'}</sup>`;

function runValidator() {
	this.parentNode.classList.remove('empty');
	var vd = this.getAttribute('validator');
	if (!vd) return;
	var vfn = validators[vd];
	if(!vfn(this.value)) {
		this.parentNode.classList.remove('default');
		this.parentNode.classList.add('error');
	} else {
		this.parentNode.classList.remove('error');
		this.parentNode.classList.add('default');
	}
}

function stripeTokenHandler(token) {
	// Insert the token ID into the form so it gets submitted to the server
	var form = document.getElementById('payment-form');
	var hiddenInput = document.createElement('input');
	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', 'stripeToken');
	hiddenInput.setAttribute('value', token.id);
	form.appendChild(hiddenInput);
	
	var eid = '{{entityId}}' 
	var m =  location.search.substr(1).match(/entity=([0-9a-f]*)/);
	if(!m && !eid) {
	  return alert('No entity given')
	}
	
	var selected = document.querySelector('.selected');
	var agreementKeys = Array.from($termsandconditions.querySelectorAll(':checked')).map(e => e.id).filter(v => v !== 'checkbox1');
	
	restfull.post({ path: '/work'
		, data: { 
			input: { 
				payment: token
				, plan: subscriberPlans[togglePaymentCycleBtn.checked ? 'yearly' : 'monthly']
				, entity: eid || m[1]
				, domainToPurchase
				, agreementKeys
				, contactinfo: Array.from($inputs)
					.concat(Array.from($selects))
					.reduce((o,f) => {
						o[f.id] = f.value; 
						return o;
				}, {})
			}
		, name: 'qoom_subscription' 
			} 
		}, function(err, response) {
			if (err) {
				console.log(err);
				return;
			}
			location.href = '/subscribe/signup-completed' + location.search
		});
}

function validateInputs() {
	if (!document.querySelector('.StripeElement--invalid') 
	&& !document.querySelector('.StripeElement--empty') 
	&& !!document.querySelector('.StripeElement--complete')
	&& !document.querySelector('.error')
	&& !document.querySelector('.empty')
	&& !$termsandconditions.querySelector('input:not(:checked)') ) {
		$confirmSubscriptionBtn.disabled = false;
	} else {
		$confirmSubscriptionBtn.disabled = true;
	}
	Array.from(document.querySelectorAll('input[data-pattern]')).forEach($el => {
		const pattern = new RegExp($el.getAttribute('data-pattern').trim());
		if(!$el.value || pattern.test($el.value)) return;
		
		$el.setAttribute('placeholder', /[\u3131-\uD79D]/ugi.test($el.value) ? '영어로 적어주세오' : 'No special characters');
		$el.classList.add('englishonly');
		$el.value = '';
	})
} 

function togglePaymentCycle() {
	if (togglePaymentCycleBtn.checked) {
		document.querySelectorAll('.monthly-info').forEach(i => {i.style.display = 'none'});
		document.querySelectorAll('.final-details-container .monthly-info').forEach(i => {i.style.display = 'none'});
		document.querySelectorAll('.annual-info').forEach(i => {i.style.display = 'table-row'});
		document.querySelectorAll('.final-details-container .annual-info').forEach(i => {i.style.display = 'inline'});
	} else {
		document.querySelectorAll('.annual-info').forEach(i => {i.style.display = 'none'});
		document.querySelectorAll('.final-details-container .annual-info').forEach(i => {i.style.display = 'none'});
		document.querySelectorAll('.monthly-info').forEach(i => {i.style.display = 'table-row'});
		document.querySelectorAll('.final-details-container .monthly-info').forEach(i => {i.style.display = 'inline'});
	}
}

$totalDueWithMonthlyPrices.forEach(p => p.innerHTML = `${(domainPrice + monthlyPrice).toFixed(2)}`);
$totalDueWithAnnualPrices.forEach(p => p.innerHTML = `${(domainPrice + annualPrice).toFixed(2)}`);

$autorenewdates.forEach(d => d.innerHTML = `${todayMonth} ${todayDate}`);
$autorenewdays.forEach(d => d.innerHTML = `${todayDate}`);
$termsandconditions.innerHTML = [tacTemplate].concat(tacData.map(tac => {
	return `<li>
				<input type="checkbox" id="${tac.agreementKey}">
				<label for="checkbox1">I agree to the <a href="/domain/agreement/${domainToPurchase.split('.').reverse()[0]}/${tac.agreementKey}">${tac.title}</a>.</label>
		</li>`;
})).join('\n')


validators = {
	notEmpty: function(v) {
		return !!(v && v.length)
	},
	isEmail: function(v) {
		var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return emailRegex.test(v);
	}
}

$inputs.forEach($input => {
	$input.setAttribute('validator', 'notEmpty');
	$input.addEventListener('keyup', runValidator);
});

$emails.forEach(($email, i) => {
	$email.setAttribute('validator', 'isEmail');
	$email.addEventListener('keyup', runValidator);
});

$confirmSubscriptionBtn.addEventListener('click', function(event) {
	event.preventDefault();
	if (submitted) return; 
	
	submitted = true;
	stripe.createToken(card).then(function(result) {
		if (result.error) {
			// Inform the customer that there was an error.
			var errorElement = document.getElementById('card-errors');
			errorElement.textContent = result.error.message;
		} else {
			// Send the token to your server.
			stripeTokenHandler(result.token);
		}
	});
});

setInterval(validateInputs, 250);


document.addEventListener('keyup', function(e) {
	if (e.keyCode === 13) {
		document.querySelector('#confirmSubscriptionBtn').click();
	}
});

document.body.onload = togglePaymentCycle;
document.body.onload = $inputs.forEach($input => {
	if(!$input.value) return;
	runValidator.apply($input)
})
togglePaymentCycleBtn.addEventListener('click', togglePaymentCycle);