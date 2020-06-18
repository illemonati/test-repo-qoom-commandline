var addNew = document.querySelector('#addMember')
	, addNewModal = document.querySelector('#addNewModal')
	, editModal = document.querySelector('#editModal')
	, cancelBtn = document.querySelector('#cancelBtn')
	, submitBtn = document.querySelector('#submitBtn')
	, modalBG = document.querySelector('.modal-background')
	, $firstName = addNewModal.querySelector('.firstName')
	, $lastName = addNewModal.querySelector('.lastName')
	, $email = addNewModal.querySelector('.email')
	, $subdomainURL = addNewModal.querySelector('.subdomainURL')
	, $continueBtn = document.querySelector('#continueBtn')
	, $memberTableBody = document.querySelector('#memberTable > tbody')
	, $editModalBtn = document.querySelector('#editModal #editBtn')
	, rowTemplate = document.querySelector('#addmembertemplate').innerHTML
	, newEntries = {}
	, qs = location.search.substr(1).split('&').reduce((o, i) => {
		var p = i.split('=');
		o[p[0]] = p[1];
		return o;
	}, {})
	, domain = qs.domainname
	, entity = qs.entity
	, rows = [{
		url: 'www', first: 'Qoom', last: 'Group Plan', email, domain
	}]
	, activerow = 0
;

function hasSubdomains() {
	if (rows.length > 1) {
		$continueBtn.disabled = false;
		document.querySelector('#doItLater').style.display = 'none';
	} else {
		$continueBtn .disabled = true;
		document.querySelector('#doItLater').style.display = 'block';
	}
}

function clearNewModel() {
	$firstName.value = '';
	$lastName.value = '';
	$email.value = '';
	$subdomainURL.value = '';
}

function openEditModal(firstName, lastName, email, url) {
	editModal.style.display = 'block';
	document.getElementById('firstName').value = firstName;
	document.getElementById('lastName').value = lastName;
	document.getElementById('email').value = email;
	document.getElementById('subdomain').value = url;
}

function closeEditModal() {
	editModal.style.display = 'none';
}

function editNewMember(){
	var row = {
		first: document.getElementById('firstName').value
		, last: document.getElementById('lastName').value
		, email: document.getElementById('email').value
		, url: document.getElementById('subdomain').value.toLowerCase().replace(/\W/g, '')
		, domain
	}

	var ri = activerow;
	rows[ri] = row;
	bindRows();
	closeEditModal();
}

function openAddNewModal() {
	addNewModal.style.display = 'block';
}

function closeAddNewModal() {
	addNewModal.style.display = 'none';
	clearNewModel();
}

function addNewMember() {
	var row = {
		first: $firstName.value.trim()
		, last: $lastName.value.trim()
		, email: $email.value.trim()
		, url: $subdomainURL.value.toLowerCase().replace(/\W/g, '')
		, domain
	}
	if(!row.url || !row.first) return; // || !row.last || !row.email) return;
	rows.push(row);
	bindRows();
	closeEditModal();
	closeAddNewModal();
}

function limitSubdomainAmount() {
	if (rows.length >= 5) {
		addNew.style.pointerEvents = 'none';
		addNew.style.filter = 'grayscale(100%)';
	} else {
		addNew.style.pointerEvents = 'auto';
		addNew.style.filter = 'none';
	}
}

function submit() {
	rows[0].email = document.querySelector('#domain-email').innerText; 
	restfull.patch({
		path: `/entity/${entity}/addmembers`
		, data: {
			members: rows
		}
	}, (err, resp) => {
		if(err) return alert('There was an error');
		location.href = '/subscribe/confirmyourplan' + location.search;
	});
}

function flattenObject(obj, flatObj, prefix) {
	flatObj = flatObj || {};
	prefix = prefix || '';
	if(obj === null || Array.isArray(obj) || ['undefined', 'string', 'number', 'boolean'].includes(typeof(obj))) {
		flatObj[prefix] = obj;
		return flatObj;
	}
	try {
		obj = JSON.parse(JSON.stringify(obj));
		return Object.keys(obj).reduce((o, k) => {
			let val = obj[k];
			let flatKey = prefix ? `${prefix}.${k}` : k;
			if(val && typeof(val) === 'object') {
				return flattenObject(val, o, flatKey);
			} else {
				o[flatKey] = val;
				return o;
			}
		}, flatObj)
	} catch(ex) {
		flatObj[prefix] = obj;
		return flatObj;
	}
}

function bindDataToTemplate(template, data) {
	let boundTemplate = '';
	try {
		let flattenData = flattenObject(data);
		boundTemplate =  Object.keys(flattenData).reduce((text,k) => {
			let val = flattenData[k] + '';
			text = text.replace(new RegExp(`{{${k}}}`, 'gi'), val);
			return text;
		}, template + '');

		return boundTemplate;
	} catch(ex) {
		return boundTemplate;
	}
}

function bindRows() {

	$memberTableBody.innerHTML = '';
	
	var rowhash = rows.reduce((o, r) => {
		o[r.url] = o[r.url] || r;
		return o;
	}, {});
	
	Array.from(new Set(rows.map(r => r.url) )).forEach((k, ri) => {
		rowhash[k].display = ri ? 'visibile' : 'hidden';
		const row = rowhash[k]
			, tr = document.createElement('tr')
			, tds = bindDataToTemplate(rowTemplate, row)
		;
		tr.innerHTML = tds;
		
		var elem = tr.querySelector('.edit');
		if(elem) elem.addEventListener('click', (e) => {
			activerow = ri
			openEditModal(row.first, row.last, row.email, row.url);
		});
		elem = tr.querySelector('.delete');
		if(elem) elem.addEventListener('click', () => {
			activerow = 0;
			row.delete = true;
			rows = rows.filter(row => !row.delete);
			bindRows();
		});
		$memberTableBody.appendChild(tr);
	})
	
}

//if(!entity) location.href = '/';

setInterval(hasSubdomains, 100);
setInterval(limitSubdomainAmount, 100);

$continueBtn.addEventListener('click', submit);
$editModalBtn.addEventListener('click', editNewMember);

bindRows();