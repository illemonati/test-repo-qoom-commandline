var $domainNameInput = document.querySelector('#domainName');

validators = {
	notEmpty: function(v) {
		return !!(v && v.length);
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
		document.querySelector('#findDomainBtn').disabled = false;
	} else {
		document.querySelector('#findDomainBtn').disabled = true;
	}
}

function selectDomain() {
	var sd = this.parentElement.parentElement.firstElementChild.innerText;
	location.href = "/subscribe/enteremail" + "?domainname=" + sd;
}

function findDomains() {
	//disable the button so the user cannot click twice
	document.querySelector('.domain-lists-container').innerHTML = '';
	var d = document.querySelector('#domainName');
	
	var progressCircle = document.querySelector('#progressBtn');
	var domainName = d.value.toLowerCase();
	var nameOnly = domainName.split('.')[0] + '.';
	d.disabled = true;
	progressCircle.style.display = 'block';
	
	
	restfull.get({
		path: `/domain/suggest?domain=${encodeURIComponent(domainName)}`
	}, (err, resp) => {
		if(err) return alert('There was an error')
		var domains = JSON.parse(resp);

		function findExactMatch(domain) {
			return domain.domain === domainName;
		}
		  
		var exactMatch = domains.filter(findExactMatch);
		domains = domains.filter((domain) => !exactMatch.includes(domain));
		
		function findMatchingNameOnly(domain) {
			return domain.domain.startsWith(nameOnly);
		}
		
		var matchingNameOnly = domains.filter(findMatchingNameOnly);
		domains = domains.filter((domain) => !matchingNameOnly.includes(domain));
		var restOfResults = domains;

		var matchingData = [
				{title: 'Exact Match', className: 'exact-matching-container', arr: exactMatch }
				, 	{title: `Endings for "${domainName.split('.')[0]}"`, className: 'matching-name-only-container', arr: matchingNameOnly }
				, 	{title: 'Suggested Names', className: 'rest-of-results-container', arr: restOfResults }
			]

		let domainListsContainer = document.querySelector('.domain-lists-container');
		
		matchingData.forEach(m => {
			if (domainName.split('.').length === 1 && m.arr.length < 1 ) return;
			let matchingContainer = document.createElement('div');
			matchingContainer.classList.add(m.className);
			matchingContainer.innerHTML = `
    					<div class="table-title">${m.title}</div>
			        	<div class="table-style table-responsive style-three">
			        		<table class="table">
			        			<tbody class="table-tbody">	
			        			</tbody>
			        		</table>	        		
			        	</div>`
			domainListsContainer.appendChild(matchingContainer);
			trContainer = document.querySelector(`.${m.className} .table-tbody`);
			if (m.arr.length >= 1) {
				m.arr.forEach(r => {
					tr = document.createElement('tr');
					var sp = location.search.substr(1);
					tr.innerHTML = `
							  <td class='available-domain'>${r.domain}</td>
							  <td class='domain-price'>$ ${r.price}</td>
	    					  <td class='select-button'><button class='qoom-main-btn qoom-button-outline qoom-button-small' onclick='location.href="/subscribe/enteremail?${sp}&domainname=${r.domain}"'>SELECT</button></td>`;
					trContainer.appendChild(tr);
				});
			} else if (domainName.split('.').length === 2 && m.arr.length < 1) {
				tr = document.createElement('tr');
				tr.innerHTML = `
					<td>"${domainName}" is unavailable.</td>`;
				trContainer.appendChild(tr);
			}
		});
		d.disabled = false;
		progressCircle.style.display = 'none';
	});
}

$domainNameInput.addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById('findDomainBtn').click();
	}
})

$domainNameInput.setAttribute('validator', 'notEmpty');
$domainNameInput.addEventListener('keyup', runValidator);
if($domainNameInput.value) runValidator.apply($domainNameInput); 

setInterval(validateInputs, 100);