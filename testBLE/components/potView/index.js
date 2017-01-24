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
	chartSource: new kendo.data.DataSource(),
	_consts:{
		turnOn: "turnOn",
		setWaterAmmount: "setting:setWaterAmmount",
		setSoilHumidity: "setting:setSoilHumidity",
		getData: "getData",
		getSettings: "getSettings"
	},
	id: "",
	waterAmount: "3000",
	soilHumidity: "20", 
	onShow: function (e) {
		app.pot.id = e.view.params.id;
		ble.startNotification(app.pot.id, "ffe0", "ffe1", $.proxy(app.pot.onData, app.pot), function(){});
		window.setTimeout(app.pot.sendMessage.bind(app.pot, [app.pot._consts.getSettings]), 100);
	},

	init: function(){
	},

	onData: function(buffer) {
		// Decode the ArrayBuffer into a typed Array based on the data you expect
		var that = this,
			data = bytesToString(buffer),
			endOfMessageIndex = data.indexOf("!"),
			indexEnd = data.length - 1;

		if(endOfMessageIndex >= 0){
			that.dataBuffer = that.dataBuffer + data.substring(0, endOfMessageIndex);
			if(that.dataBuffer.startsWith("data@")){
				that.parseData(that.dataBuffer);
			} else if(that.dataBuffer.startsWith("settings@")){
				that.parseSettings(that.dataBuffer);
			}

			that.dataBuffer = data.substring(endOfMessageIndex, indexEnd);
		} else {
			that.dataBuffer = that.dataBuffer + data;
		}
	},

	parseData: function(data){
		var entry,
			dataEntries,
			dataObjects = [];

		data = data.replace("data@", "");
		data = data.replace("!", "");
		dataEntries = data.split(",");

		for(var i = 0, len = dataEntries.length; i < len; i++ ){
			entry = dataEntries[i].split("#");
			dataObjects[i] = {
				soilHumidity: entry[0],
				time: new Date(entry[1])
			}
		}
		
		this.get("chartSource").data(dataObjects);
	},

	parseSettings: function(data){
		var that = this,
			settings = [];

		data = data.replace("settings@", "");
		settings = data.split("#");
		that.set("waterAmount", parseInt(settings[0]));
		that.set("soilHumidity", parseInt(settings[1]));
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