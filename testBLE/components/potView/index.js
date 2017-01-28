'use strict';

var PotViewModel = kendo.data.ObservableObject.extend({
	_consts:{
		turnOn: "turnOn",
		setWaterAmmount: "set_setting:setWaterAmmount",
		setSoilHumidity: "set_setting:setSoilHumidity",
		getData: "getData",
		getSettings: "getSettings"
	},
	id: "",
	chartSource: null,
	waterAmount: "3000",
	soilHumidity: "20",

	init: function(){
		var that = this;

		kendo.data.ObservableObject.fn.init.apply(that, arguments);
		
		that.chartSource = new kendo.data.DataSource();
		app.bluetoothService.bind("data", that.onData.bind(that));
	},

	onShow: function (e) {
		app.pot.set("id", e.view.params.id);
		app.bluetoothService.startNotification();
		window.setTimeout(app.bluetoothService.sendMessage.bind(app.bluetoothService, app.pot._consts.getSettings), 100);
	},
	
	disconnect: function(){
		app.bluetoothService.disconnectCurrent();
	},

	onData: function(data){
		var that = this;

		if(data.dataType === app.bluetoothService.consts.dataLog){
			this.get("chartSource").data(data.dataObjects);
		} else if(data.dataType === app.bluetoothService.consts.settingsData){
			that.set("waterAmount", data.waterAmount);
			that.set("soilHumidity", data.soilHumidity);
			app.bluetoothService.sendMessage(that._consts.getData);
		}
	},

	onTurnOn: function () {
		var that = this;
		
		app.bluetoothService.sendMessage(that._consts.turnOn);
	},

	onWaterChange: function(e){
		var that = this;
		
		app.bluetoothService.sendMessage(that._consts.setWaterAmmount + "=" + that.get("waterAmount"));
	},

	onSoilChange: function(e){
		var that = this;
		
		app.bluetoothService.sendMessage(that._consts.setSoilHumidity + "=" + that.get("soilHumidity"));
	}
});

app.pot = new PotViewModel();