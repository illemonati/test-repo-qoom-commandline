// VALIDATE INPUTS
var $inputs = document.querySelectorAll('.input-items input');
var $emails = document.querySelectorAll('.email input');
var $passworderr = document.querySelector('.password.errormessage');

validators = {
	notEmpty: function(v) {
		return !!(v && v.length)
	},
	isEmail: function(v) {
		var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return emailRegex.test(v);
	}
}

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

$inputs.forEach($input => {
	$input.setAttribute('validator', 'notEmpty');
	$input.addEventListener('keyup', runValidator);
});
$emails.forEach(($email, i) => {
	$email.setAttribute('validator', 'isEmail');
	$email.addEventListener('keyup', runValidator);
});
	
function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty')) {
		document.querySelector('#createAccountBtn').disabled = false;
	} else {
		document.querySelector('#createAccountBtn').disabled = true;
	}
}
setInterval(validateInputs, 1000);
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 13) {
		document.querySelector('#createAccountBtn').click();
	}
});

$inputs.forEach($input => {
	if(!$input.value) return;
	runValidator.apply($input)
})

function createAccount() {
	const password = document.querySelector('#password').value;
	const ps = Array.from(new Set(password.split('')));
	if(password.length < 9 
		|| !ps.some(x => `!@#$%^&*()_+=-{}[]:;"'?/>.<,||\\\`~`.split('').includes(x))
		|| !ps.some(x => `0123456789`.split('').includes(x))
		|| !ps.some(x => `qwertyuiopasdfghjklzxcvbnm`.split('').includes(x))
		|| !ps.some(x => `qwertyuiopasdfghjklzxcvbnm`.toUpperCase().split('').includes(x))
	) {
		$passworderr.style.display = 'block';
		return;
	} else {
		$passworderr.style.display = 'none';
	}
	
	var progressCircle = document.querySelector('#progressBtn');
	var $inputs = document.querySelectorAll('input');
	$inputs.forEach(i => i.disabled = true)
	progressCircle.style.display = 'block';

	var createText = document.querySelector('#createAccountBtn');
	createText.style.display = 'none';

	restfull.post({
		path: '/subscribe/createaccount' + location.search
		, data: {
			first: document.querySelector('#firstName').value
			, last: document.querySelector('#lastName').value
			, email: document.querySelector('#email').value
			, password: document.querySelector('#password').value
			, authdomain: document.querySelector('#email').value
			, authpassword: document.querySelector('#password').value
		}
	}, function(err, resp) {
		console.log(err || resp);
		if(err) return alert("An issue is preventing you from creating an account. Please try again later.");
		location.href = JSON.parse(resp).url;
	})
}