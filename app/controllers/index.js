//TODO: Be more tolerant of offline
if (!Ti.Network.online) {
	alert(L('networkErrMsg'));
}

$.loading = Alloy.createController('loading');

function openMain() {
	$.main = Alloy.createController('main');
	$.clouds && ($.index.remove($.clouds));
	$.index.backgroundImage = '/img/general/bg-interior.png';
	$.index.add($.main.getView());
	$.main.init();
}

function showLoading() {
	$.index.add($.loading.getView());
}

function hideLoading() {
	$.index.remove($.loading.getView());
}

var offerRegistration = Ti.App.Properties.getBool('offerRegistration', true);

if (offerRegistration) {
	$.register = Alloy.createController('register');
	$.index.add($.register.getView());
	$.register.skip.on('click', function() {

		var dialog = Ti.UI.createAlertDialog({
			title: 'Are you sure?',
			buttonNames: [ 'Yes', 'No' ],
			cancel: 1
		});

		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				
				Ti.App.Properties.setBool('offerRegistration', false);

				$.index.remove($.register.getView());
				
				openMain();
			}
		});

		dialog.show();
	});

	$.register.register.on('click', function() {

		var firstName = $.register.firstName.value;
		var lastName = $.register.lastName.value;
		var email = $.register.email.value;

		if (!email) {
			alert('Email must not be empty!');
			return;
		}
		
		$.index.remove($.register.getView());
		showLoading();

		var RegisterDpd = require('Register');

		RegisterDpd.post({
			name: firstName + ' ' + lastName,
			email: email
		}, function() {

			hideLoading();

			openMain();

			Ti.App.Properties.setBool('offerRegistration', false);
			
			if (OS_IOS) {
				alert('Thanks for registration!');
			}
			else {

				var toast = Ti.UI.createNotification({
			    	message: 'Thanks for registration!',
			    	duration: Ti.UI.NOTIFICATION_DURATION_LONG
				});

				toast.show();
			}
		})
	});		
}
else {
	openMain();
}

//Open initial window
$.index.open();
