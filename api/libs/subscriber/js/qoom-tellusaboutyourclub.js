var $priceContainer = document.querySelector('.hide');
var $seePriceBtn = document.querySelector('.find-price-button button');
var prices = [
	{ member: 1, price: 53.99 },
	{ member: 2, price: 32.99 },
	{ member: 3, price: 24.99 },
	{ member: 4, price: 21.99 },
	{ member: 5, price: 19.99 },
	{ member: 6, price: 17.99 },
	{ member: 7, price: 16.99 },
	{ member: 8, price: 15.99 },
	{ member: 9, price: 15.99 },
	{ member: 10, price: 14.99 }
	];

$seePriceBtn.addEventListener('click', show);

function show() {
	var membershipFee = document.querySelector('[data="membershipFee"]');
	var memberInput = parseInt(document.querySelector('#clubmemberamount').value);
	var price = prices.find(p => p.member === memberInput);
	if(!price) swal('Input is invalid.');
	membershipFee.innerHTML = `${price.price}`;
	$priceContainer.classList.remove('hide');
}

// Validate Data
var $inputs = document.querySelectorAll('.input-items input');
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
	$input.addEventListener('keyup', function() {
	var vd = this.getAttribute('validator');
	if (!vd) return;
	var vfn = validators[vd];
	if(!vfn(this.value)) {
		this.parentNode.classList.remove('default');
		this.parentNode.classList.add('error');
		} else {
			this.parentNode.classList.remove('error');
			this.parentNode.classList.remove('empty');
			this.parentNode.classList.add('default');
		}
	});
});

function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty')) {
		document.querySelector('.find-price-button button').disabled = false;
	} else {
		document.querySelector('.find-price-button button').disabled = true;
	}
};

setInterval(validateInputs, 1000);

// for Buttons
function selectPlan() {
	location.href = '/subscribe/selectplan'
}

function goToCreateAccount() {
	const t = document.getElementById('clubname').value
	const m = document.getElementById('clubmemberamount').value

	location.href = `/subscribe/createaccount?clubname=${t}&membercount=${m}`
}