'use strict';

(function() {
	var app = {
		data: {},
		bluetoothService: new BluetoothService()
	};

	var bootstrap = function() {
		$(function() {
			app.mobileApp = new kendo.mobile.Application(document.body, {
					transition: 'slide',
					skin: 'nova',
					initial: 'components/home/view.html'
				});
		});
	};

	if (window.cordova) {
		document.addEventListener('deviceready', function() {
			if (navigator && navigator.splashscreen) {
				navigator.splashscreen.hide();
			}
			bootstrap();
		}, false);
	} else {
		bootstrap();
	}

	window.app = app;

}());