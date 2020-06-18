const password = document.querySelector('#password')
	, $submit = document.querySelector('button#submitChangePassword')
;

let clicked = false;

function validate() {
	const ps = Array.from(new Set(password.value.split('')));
	if(password.value.length < 9 
		|| !ps.some(x => `!@#$%^&*()_+=-{}[]:;"'?/>.<,||\\\`~`.split('').includes(x))
		|| !ps.some(x => `0123456789`.split('').includes(x))
		|| !ps.some(x => `qwertyuiopasdfghjklzxcvbnm`.split('').includes(x))
		|| !ps.some(x => `qwertyuiopasdfghjklzxcvbnm`.toUpperCase().split('').includes(x))
	) {
		$submit.setAttribute('disabled', '');
		return false;
	} else {
		$submit.removeAttribute('disabled');
		return true;
	}
}

setInterval(validate, 250);

$submit.addEventListener('click', () => {
	if(!validate() || clicked) return;
	clicked = true;
	restfull.post({ 
		path: location.pathname
		, data: { password: password.value }
	}, (err, resp) => {
		if(err) {
			clicked = false;
			return alert('There was an issue');
		}
		if(resp.error) {
			clicked = false;
			return alert(resp.error);
		}
		
		location.href = '/subscribe/new-password-set';
	})
})