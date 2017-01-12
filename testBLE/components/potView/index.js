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
	_consts:{
		turnOn: "turnOn",
		setWaterAmmount: "setWaterAmmount",
		setSoilHumidity: "setSoilHumidity"
	},
	id: "",
	waterAmount: "250",
	soilHumidity: "250", 
	onShow: function (e) {
		app.pot.id = e.view.params.id;
	},
	afterShow: function () {},
	onTurnOn: function () {
		var that = this;
		
		that.sendMessage(that._consts.turnOn);
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