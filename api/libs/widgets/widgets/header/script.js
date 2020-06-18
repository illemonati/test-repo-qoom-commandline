const subscriberData = ||subscriberData||;
var loggedInContainer = document.querySelector('.navbar-loggedin');
var myaccountSubmenu = document.querySelector('.navbar-loggedin .sub-menu');
var navbarBtns = document.querySelectorAll('.navbar-btn');
var logOutBtn = document.querySelector('#logOutBtn');
var userNameInitial = document.querySelector('.loggedin-username').innerText.slice(0,1);
var userAvatarContainer = document.querySelector('.loggedin-avatar-img');
var keyword = '';
var logInBtn = document.querySelector('.nav-item.navbar-btn.five');
var navbarToggler = document.querySelector('.navbar-toggler');
var navbarSubmenu = document.querySelector('.navbar-collapse.sub-menu-bar');


if (!subscriberData._id) {
	loggedInContainer.style.display = 'none'; 
	navbarBtns.forEach(b => {
		b.style.display = 'inline-block';
		b.style.opacity = '1';
	});
} else if (!!subscriberData._id) {
	loggedInContainer.style.display = 'inline-block';
	navbarBtns.forEach(b => {
		b.style.display = 'none';
		b.style.opacity = '0';
	});
	userAvatarContainer.innerText = userNameInitial;
	loggedInContainer.addEventListener('click', function(){
		if (myaccountSubmenu.classList.contains('open')) {
			myaccountSubmenu.classList.remove('open'); 
		} else {
			navbarToggler.classList.remove('active');
			navbarToggler.setAttribute('aria-expanded', 'false');
			navbarToggler.classList.add('collapsed');
			navbarSubmenu.classList.remove('show');
			myaccountSubmenu.classList.add('open');
		}
	})
	navbarToggler.addEventListener('click', function() {
		if (myaccountSubmenu.classList.contains('open')) {
			myaccountSubmenu.classList.remove('open');
		} 
	})
	logOutBtn.addEventListener('click', () => {
		restfull.post({
			path: '/subscribe/logout'
		}, function(err, resp){
			if(err) return alert(err);
			location.href = '../../subscribe/login';
		})
	})
}