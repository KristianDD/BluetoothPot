var BluetoothService = kendo.Observable.extend({
	_currentDevice: null,
	scan: function(foundCallback) {
		ble.scan(["ffe0"], 10, function(bleDevice){
			foundCallback(bleDevice);
		});
	},

	connect: function(deviceId){
		var that = this,
			def = $.Deferred();

		ble.connect(deviceId, function(data){
			def.resolve();
			app.mobileApp.navigate("components/potView/view.html?id=" + deviceId);
			that._currentDevice = deviceId;
		}, function(){
			if(!that._currentDevice || that._currentDevice === deviceId){
				app.mobileApp.navigate("components/home/view.html");
			}
		});

		return def.promise();
	},

	disconnectCurrent: function(){
		if(this._currentDevice){
			ble.disconnect(this._currentDevice, function(){}, function(){});
		}
	}
});