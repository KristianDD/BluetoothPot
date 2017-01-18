app.home = kendo.observable({
	ds: null,
	onShow: function () {
		var that = this;
		
		app.home.ds.data([]);
		ble.scan([], 10, function(bleDevice){
			app.home.ds.add(bleDevice);
		});
	},
	onClick: function (e) {
		ble.connect(e.dataItem.id, function(data){
			app.mobileApp.navigate("components/potView/view.html?id=" + data.id);
		}, function(){
			alert("Disconnected");
			app.mobileApp.navigate("components/home/view.html");
		});
	},
	afterShow: function () {}
});

app.home.ds = new kendo.data.DataSource();
// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home