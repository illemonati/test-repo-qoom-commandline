var toggler = document.querySelector('.hamburgerIcon');
var menubarBackground = document.querySelector('.menubar-background');
var menubar = document.querySelector('.menubar');
var accountSettingsContainer = document.getElementById('account-settings-container');
var subscriptionContainer = document.getElementById('subscription-container');
var accountSettingBtn = document.querySelector('.my-account-control-accountsetting');
var logOutBtn = document.querySelector('#log-out-btn');
var $domainsContainer = document.querySelector('.domains');
var $domainIcons = document.querySelectorAll('.domain-icon');
var myDomainNames = document.querySelectorAll('.item-name');
var subscription = document.querySelector('#subscription');

function openSubMenu(evt, subMenu) {
	var myDomainSubMenus = document.querySelectorAll('.domian-submenu .menu-item');
	myDomainSubMenus.forEach(sm => sm.classList.remove("selected"));
	document.getElementById(`'${subMenu}'`).classList.add("selected");
	location.href=`/account/{{_id}}/${subMenu}`;
}

function checkSubscriptionReady() {
	if(subscription.style.display !== 'none') return;
	restfull.get({path: '/subscribe/ready?rnd=' + Math.random()}, (err, resp) => {
		if(err || !resp) return;
		try {
			if(resp.ready || JSON.parse(resp).ready) {
				subscription.style.display = 'block';
				return;
			}
		} catch(ex) {
			
		} finally {
			setTimeout(checkSubscriptionReady, 5000);
		}
		
	});
}

toggler.addEventListener('click', () => {
	menubar.classList.toggle('open');
	menubarBackground.classList.toggle('open');
});

menubarBackground.addEventListener('click', () => {
	menubar.classList.toggle('open');
	menubarBackground.classList.toggle('open');
});

logOutBtn.addEventListener('click', () => {
	restfull.post({
		path: '/subscribe/logout'
	}, function(err, resp){
		if(err) return alert(err);
		location.href = '../../subscribe/login';
	});
});

checkSubscriptionReady();