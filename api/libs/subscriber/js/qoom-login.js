// VALIDATE INPUTS
// var $names = document.querySelectorAll('.club-member-name input');
var $emails = document.querySelectorAll('.email-input input');
var $passwordInput = document.querySelector('.password input');
var $inputs = document.querySelectorAll('input');
validators = {
	notEmpty: function(v) {
		return !!(v && v.length);
	},
	isEmail: function(v) {
		var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return emailRegex.test(v);
	}
};
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


	
function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty')) {
		document.querySelector('#logInBtn').disabled = false;
		return true;
	} else {
		document.querySelector('#logInBtn').disabled = true;
		return false;
	}
}

function goToLogIn() {
	if(!validateInputs()) return;
	restfull.post({
		path: '/subscribe/login' + location.search
		, data: {
			authdomain: document.querySelector('#email').value
			, authpassword: document.querySelector('#password').value
		}
	}, function(err, resp){
		if(err) {
			document.getElementById('password').value = '';
			document.getElementById('password').parentNode.classList.add('error');
			document.getElementById('password').placeholder = 'Passwords did not match.';
			return;
			// return alert('There was an error with your credentials, please check them and try again.');
		}
		location.href = JSON.parse(resp).url;
	});
}

$passwordInput.setAttribute('validator', 'notEmpty');
$passwordInput.addEventListener('keyup', runValidator);

// var duplicatedEmail = false;
$emails.forEach(($email, i) => {
	$email.setAttribute('validator', 'isEmail');
	$email.addEventListener('keyup', runValidator);
		// duplicatedEmail = 
		// 	Array.from($emails).filter((e,x) => x !== i).map(e => e.value).includes(this.value);
});

setInterval(validateInputs, 1000);
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 13) {
		document.querySelector('#logInBtn').click();
	}
});

$inputs.forEach(i => {
	if(!i.value) return;
	runValidator.apply(i);
});