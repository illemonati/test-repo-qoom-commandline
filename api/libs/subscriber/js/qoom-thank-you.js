var $memberContainer = document.querySelector('#memberContainer');
var $memberIndex = document.querySelector('.member-index-number');
// var template = document.querySelector('#addMemberTemplate').innerHTML;
var count = 2;
var members = '';
var $div;

function addMember() {
	$div = document.createElement('div');
	$div.className = 'row';
	$div.innerHTML = `<div class="member-index-container">
		    			<p class="member-index-number">${count}</p>
		    		</div>
		    		<div class="member-info-container">
			            <div class="club-member-name">
			            	<div class="form-input">
				                <div class="input-items default empty">
									<i class="lni-user"></i>
				                	<input type="text" placeholder="Name" class="" required>
				                </div>
				            </div>
			            </div>
			            <div class="club-member-email">
			            	<div class="form-input">
				                <div class="input-items default empty">
				                	<i class="lni-envelope"></i>
				                	<input type="email" placeholder="Email" class="" required>
				                </div>
				            </div>
				        </div>
		            </div>`
	$memberContainer.appendChild($div);
	count++;
}
// put the number of members below 
let memberCount; 
try {
	memberCount = parseInt(location.search.split('members=')[1].split('&')[0]);
} catch(ex) {
	
}
if (isNaN(memberCount) || memberCount < 1 || memberCount > 30) alert('Invalid Member Count!');
while(count <= memberCount) {
	addMember();
}


// VALIDATE INPUTS
var $names = document.querySelectorAll('.club-member-name input');
var $emails = document.querySelectorAll('.club-member-email input');
validators = {
	notEmpty: function(v) {
		return !!(v && v.length)
	},
	isEmail: function(v) {
		var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return emailRegex.test(v);
	}
}

$names.forEach($name => {
	$name.setAttribute('validator', 'notEmpty');
	$name.addEventListener('keyup', function() {
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
var duplicatedEmail = false;
$emails.forEach(($email, i) => {
	$email.setAttribute('validator', 'isEmail');
	$email.addEventListener('keyup', function() {
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
		duplicatedEmail = 
			Array.from($emails).filter((e,x) => x !== i).map(e => e.value).includes(this.value);
	});
});

function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty') && !duplicatedEmail) {
		document.querySelector('#sendInvitation').disabled = false;
		return true;
	} else {
		document.querySelector('#sendInvitation').disabled = true;
		return false;
	}
};

function getInvites() {
    const names = Array.from(document.querySelectorAll('input[type=text]')).map(n => n.value).filter(n => n)
        , emails =Array.from(document.querySelectorAll('input[type=email]')).map(n => n.value).filter(n => n)
    ;
    return emails.reduce((o, e, i) => {
    	o[e] = names[i];
    	return o;
    }, {})
}

setInterval(validateInputs, 1000);

// ACTIONS FOR BUTTONS
function choosePriceOption() {
	location.href = '/subscribe/choosepriceoption';
}

function sendInvitations() {
	if(!validateInputs()) return;
	
	const q = parseQuery();
	restfull.post({
		path: '/subscribe/sendinvites'
		, data: Object.assign(q, { invites: getInvites() })
	}, function(err, resp) {
		if(err) return alert(err);
		alert(resp)
		location.href = JSON.parse(resp).url;
	})
}

function parseQuery() {
	const q = location.search.substr(1);
	if(!q) return {};
	return q.split('&').reduce((o, kv) => {
		const parts = kv.split('=');
		o[parts[0]] = parts[1];
		return o;
	}, {})
}

const q = parseQuery();
if(!q.clubname) {
	// location.href = '/subscribe/nameyourclub'
	//the page above doesn't exist anymore
} else if(!q.members) {
	location.href = '/subscribe/choosepriceoption?clubname=' + q.clubname
} else if(!q.plan) {
	location.href = '/subscribe/choosepriceoption?clubname=' + q.clubname
}