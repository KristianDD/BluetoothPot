var HomeViewModel = kendo.data.ObservableObject.extend({
	devicesDS: null,

	init: function(){
		var that = this;
		
		kendo.data.ObservableObject.fn.init.apply(that, arguments);
		that.devicesDS = new kendo.data.DataSource();
	},

	onShow: function () {
		var that = this;
		
		app.home.devicesDS.data([]);
		app.bluetoothService.disconnectCurrent();
		app.home.startScan();
	},

	startScan: function(){
		var that = this;
		that.devicesDS.data([]);

		app.bluetoothService.scan(that.addDevice.bind(that));
	},

	addDevice: function(bleDevice){
		app.home.devicesDS.add(bleDevice);
	},

	onClick: function (e) {
		app.bluetoothService.connect(e.dataItem.id);
	},

	onHide: function(){
		app.home.devicesDS.data([]);
	}
});

app.home = new HomeViewModel();