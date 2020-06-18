// VALIDATE INPUTS
var $inputs = document.querySelectorAll('.input-items input');
var $emails = document.querySelectorAll('#email');
var checkEmailBtn = document.querySelector('#checkEmailBtn');

function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty')) {
		document.querySelector('#checkEmailBtn').disabled = false;
	} else {
		document.querySelector('#checkEmailBtn').disabled = true;
	}
};

function checkEmail() {
	var emailInput = checkEmailBtn.innerText;
	restfull.post({
		path: '/subscribe/enteremail'
		, data: {
			email: $emails[0].value
		}
	}, (err, resp) => {
		if (err) return alert(err);
		try {
			resp = JSON.parse(resp);
			location.href = resp.url + location.search + '&e=' + resp.emailid;
		} catch(ex) {
			alert(ex)
		}
	})
}

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
	$input.addEventListener('keyup', function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			checkEmailBtn.click();
		}
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
	});
});
$inputs.forEach($input => {
	if(!$input.value) return;
})
$emails.forEach(($email, i) => {
	$email.setAttribute('validator', 'isEmail');
	$email.addEventListener('keyup', function() {
		if (event.keyCode === 13) {
			event.preventDefault();
			checkEmailBtn.click();
		}
		this.parentNode.classList.remove('empty');
		var vd = this.getAttribute('validator');
		if (!vd) return;
		var vfn = validators[vd];
		if(!vfn(this.value)){
			this.parentNode.classList.remove('default');
			this.parentNode.classList.add('error');
		} else {
			this.parentNode.classList.remove('error');
			this.parentNode.classList.add('default');
		}
		
	});
});
	

setInterval(validateInputs, 1000);

checkEmailBtn.addEventListener('click', checkEmail);