'use strict';

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

app.pot = kendo.observable({
	dataBuffer: "",
	_consts:{
		turnOn: "turnOn",
		setWaterAmmount: "setWaterAmmount",
		setSoilHumidity: "setSoilHumidity",
		getData: "getData"
	},
	id: "",
	waterAmount: "250",
	soilHumidity: "250", 
	onShow: function (e) {
		app.pot.id = e.view.params.id;
		ble.startNotification(app.pot.id, "ffe0", "ffe1", $.proxy(app.pot.onData), function(){});
	},

	init: function(){
	},

	onData: function(buffer) {
		// Decode the ArrayBuffer into a typed Array based on the data you expect
		var that = this,
			data = bytesToString(buffer),
			endOfMessageIndex = data.indexOf("!");
		if(endOfMessageIndex >= 0){
			that.dataBuffer = that.dataBuffer + data.substring(indexStart[endOfMessageIndex, indexEnd])
			alert(dataBuffer);
		} else {
			that.dataBuffer = that.dataBuffer + data;
		}
		alert(data);
	},

	afterShow: function () {},
	onTurnOn: function () {
		var that = this;
		
		that.sendMessage(that._consts.turnOn);
	},
	onGetData: function(){
		var that = this;
		
		that.sendMessage(that._consts.getData);
	},
	onWaterChange: function(e){
		var that = this;
		
		that.sendMessage(that._consts.setWaterAmmount + "=" + that.get("waterAmount"));
	},
	onSoilChange: function(e){
		var that = this;
		
		that.sendMessage(that._consts.setSoilHumidity + "=" + that.get("soilHumidity"));
	},
	sendMessage: function(message){
			message = message + "!";
			ble.write(this.id, "ffe0", "ffe1", stringToBytes(message), function(){
				alert("send ok");
			}, function(){
				alert("send fail");
			});
	}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home