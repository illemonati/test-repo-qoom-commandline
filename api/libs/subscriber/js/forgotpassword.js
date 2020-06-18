const $email = document.querySelector('#email')
	, $submit = document.querySelector('button#submitEmailForFP')
	, validEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
;

let clicked = false;

function validate() {
	const isValid = validEmailPattern.test($email.value);
	if(isValid) {
		$submit.removeAttribute('disabled');
	} else {
		$submit.setAttribute('disabled', 'disabled');
	}
}

setInterval(validate, 250);

$submit.addEventListener('click', () => {
	if(!$email.value || clicked) return;
	clicked = true;
	restfull.post({ 
		path: '/subscribe/resetemail'
		, data: {email: $email.value }
	}, (err, resp) => {
		if(err) {
			clicked = false;
			return alert('There was an issue');
		}
		location.href = '/subscribe/email-sent';
	})
});
