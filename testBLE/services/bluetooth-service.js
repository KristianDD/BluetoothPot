// ASCII only
function stringToBytes(string) {
	var array = new Uint8Array(string.length);
	for (var i = 0, l = string.length; i < l; i++) {
		array[i] = string.charCodeAt(i);
	}
	return array.buffer;
}

// ASCII only
function bytesToString(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
} 

var BluetoothService = kendo.Observable.extend({
	_currentDevice: null,
	_dataBuffer: "",
	consts: {
		dataLog: "dataLog",
		settingsData: "settingsData"
	},
	
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

	startNotification: function(){
		var that = this;

		ble.startNotification(that._currentDevice, "ffe0", "ffe1", $.proxy(that.onData, that), function(){});
	},

	onData: function(buffer) {
		// Decode the ArrayBuffer into a typed Array based on the data you expect
		var that = this,
			data = bytesToString(buffer),
			endOfMessageIndex = data.indexOf("!"),
			indexEnd = data.length - 1;

		if(endOfMessageIndex >= 0){
			that._dataBuffer = that._dataBuffer + data.substring(0, endOfMessageIndex);
			if(that._dataBuffer.startsWith("data@")){
				that.parseData(that._dataBuffer);
			} else if(that._dataBuffer.startsWith("settings@")){
				that.parseSettings(that._dataBuffer);
			}

			that._dataBuffer = data.substring(endOfMessageIndex, indexEnd);
		} else {
			that._dataBuffer = that._dataBuffer + data;
		}
	},

	parseData: function(data){
		var that = this,
			entry,
			dataEntries,
			dataObjects = [];

		data = data.replace("data@", "");
		data = data.replace("!", "");
		dataEntries = data.split(",");

		for(var i = 0, len = dataEntries.length; i < len; i++ ){
			entry = dataEntries[i].split("#");
			dataObjects[i] = {
				soilHumidity: ((1023 - entry[0])/1023)*100,
				time: new Date(entry[1])
			}
		}
		
		that.trigger("data", {dataObjects: dataObjects, dataType: that.consts.dataLog});
	},

	parseSettings: function(data){
		var that = this,
			soilHumidity,
			waterAmount,
			settings = [];

		data = data.replace("settings@", "");
		settings = data.split("#");
		waterAmount = parseInt(settings[0]);
		soilHumidity = parseInt(settings[1]);

		that.trigger("data", {waterAmount: waterAmount, soilHumidity: soilHumidity, dataType: that.consts.settingsData});
	},

	disconnectCurrent: function(){
		if(this._currentDevice){
			ble.disconnect(this._currentDevice, function(){
				app.mobileApp.navigate("components/home/view.html");
			}, function(){});
		}
	},

	sendMessage: function(message){
			message = message + "!";
			ble.write(this._currentDevice, "ffe0", "ffe1", stringToBytes(message), function(){
			}, function(){
				alert("Sending command failed.");
			});
	}
});