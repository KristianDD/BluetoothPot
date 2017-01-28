var HomeViewModel = kendo.data.ObservableObject.extend({
	ds: null,

	init: function(){
		var that = this;
		
		kendo.data.ObservableObject.fn.init.apply(that, arguments);
		that.ds = new kendo.data.DataSource();
	},

	onShow: function () {
		var that = this;
		
		app.home.ds.data([]);
		app.bluetoothService.disconnectCurrent();
		app.home.startScan();
	},

	startScan: function(){
		var that = this;
		that.ds.data([]);

		app.bluetoothService.scan(that.addDevice.bind(that));
	},

	addDevice: function(bleDevice){
		app.home.ds.add(bleDevice);
	},

	onClick: function (e) {
		app.bluetoothService.connect(e.dataItem.id);
	},

	onHide: function(){
		app.home.ds.data([]);
	}
});

app.home = new HomeViewModel();