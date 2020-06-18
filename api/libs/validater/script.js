function isValidDate(d) {
	if(!d === true) return false;
	return new Date(d) !== 'Invalid Date';
}

function isObject(o) {
	return o && typeof(o) === 'object' && !Array.isArray(o);
}

function validateEmail(email) {
	try{
		return /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/.test(email);
	} catch(ex) {
		return false;
	}
}

function validatePhone(phone) {
	try{
		return /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/.test(email);
	} catch(ex) {
		return false;
	}
}