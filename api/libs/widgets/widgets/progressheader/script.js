var progressStatus = document.querySelector('.progress-status');
var isInFirstStep = ['choosedomain'];
var isInSecondStep = ['enteremail', 'login', 'createaccount', 'addmembers'];
var isInThirdStep = ['confirmyourplan'];
var keyword = '';

function findKeyword(url) {
	var urlAddressComponentWithoutQuery = url.split('?')[0];
	var urlAddressComponent = urlAddressComponentWithoutQuery.split('/');
	var keywordLocation = urlAddressComponent.indexOf('subscribe') + 1;
	keyword = urlAddressComponent[keywordLocation];
	return keyword;
}

function back() { 
	var d = location.search;
	if (keyword === 'choosedomain') {
		location.href=`/pricing`;
	} else if (keyword === 'enteremail') {
		d = location.search.split('&domainname')[0];
		location.href=`/subscribe/choosedomain${d}`;
	} else if (keyword === 'login') {
		d = location.search.split('&e')[0];
		location.href=`/subscribe/enteremail${d}`;
	}else if (keyword === 'createaccount') {
		d = location.search.split('&e')[0];
		location.href=`/subscribe/enteremail${d}`;
	} else if (keyword === 'addmembers') {
		d = location.search.split('&domainname')[0];
		location.href=`/subscribe/choosedomain${d}`;
	}else if (keyword === 'confirmyourplan') {
		location.href=`/home`;
	}
}

if (isInFirstStep.includes(findKeyword(location.href))) {
	progressStatus.classList.add('first');
	progressStatus.classList.remove('second', 'third');
} else if (isInSecondStep.includes(findKeyword(location.href))) {
	progressStatus.classList.add('second');
	progressStatus.classList.remove('first', 'third');
} else if (isInThirdStep.includes(findKeyword(location.href))) {
	progressStatus.classList.add('third');
	progressStatus.classList.remove('first', 'second');
	document.querySelector('.cancel-text').innerText = 'Cancel';
	document.querySelector('.cancel-button').classList.remove('ic-back');
	document.querySelector('.cancel-button').classList.add('ic-cancel');
	document.querySelector('#navibar-back').style.visibility = 'visible';
} 

document.getElementById('navibar-back').addEventListener('click', back);