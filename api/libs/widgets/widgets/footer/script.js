var year = new Date().getFullYear();
var progressStatus = document.querySelector('.progress-status');


document.querySelector('.year').innerText = year;

if (!!progressStatus) {
	document.querySelector('footer').style.display = 'none';
}