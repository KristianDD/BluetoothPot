app.home = kendo.observable({
	ds: null,
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
	},
	afterShow: function () {}
});

app.home.ds = new kendo.data.DataSource();
// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home