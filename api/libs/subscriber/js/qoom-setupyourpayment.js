// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = Stripe('{{stripeToken}}');
var elements = stripe.elements();
// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    // Add your base input styles here. For example:
    fontSize: '16px',
    color: '#32325d',
  },
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');


card.addEventListener('change', ({error}) => {
const displayError = document.getElementById('card-errors');
	if (error) {
		displayError.textContent = error.message;
	} else {
		displayError.textContent = '';
	}
});

var submitted = false;

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
	event.preventDefault();
	if (submitted) return; 
	
	submitted = true;
	stripe.createToken(card).then(function(result) {
		if (result.error) {
			// Inform the customer that there was an error.
			var errorElement = document.getElementById('card-errors');
			errorElement.textContent = result.error.message;
		} else {
			// Send the token to your server.
			stripeTokenHandler(result.token);
		}
	});
});


function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  var m = location.search.substr(1).match(/entity=([0-9a-f]*)/);
  if(!m) {
  	return alert('No entity given')
  }
  
  var selected = document.querySelector('.selected');
 
  restfull.post({ path: '/work'
		, data: { 
			input: { 
				payment: token
				, plan: selected.id
				, entity: m[1]
			}
		, name: 'qoom_subscription' 
		} 
	}, function(err, response) {
		if (err) {
			console.log(err);
			return;
		}
		location.href = '/subscribe/thankyou'
	});

};

	
function validateInputs() {
	if (!document.querySelector('.StripeElement--invalid') && !document.querySelector('.StripeElement--empty') && document.querySelector('.StripeElement--complete')) {
		document.querySelector('#confirmSubscriptionBtn').disabled = false;
	} else {
		document.querySelector('#confirmSubscriptionBtn').disabled = true;
	}
};
setInterval(validateInputs, 1000);

function goToCreateAccount() {
	location.href = '/subscribe/createaccount'; 
};

//CODE FOR STYLE FOR SELECTED BUTTON 
var $buttons = document.querySelectorAll('.select-button button');
$buttons.forEach($button => {
	$button.addEventListener('click', function(){
		$buttons.forEach($button => {
			$button.parentNode.parentNode.classList.remove('selected');	
		})
		$button.parentNode.parentNode.classList.add('selected');
	})
});