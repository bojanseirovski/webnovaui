/**
 * Map width/360 or Map heoight/180
 * 298/360 , 150/360
 */
var mapConversionConstX = 0.8277;
var mapConversionConstY = 0.8333;
/**
 * Map size
 */
var mapWidth = 298;
var mapHeight = 150;
/**
 * Pause between AJAX calls
 */
var loopBreak = 3000;
var baseUrl = "http://api.nova.test:8000"

var norad_url = "";
var sim_step_url = "?steps=1"; // in seconds
var sim_steps = 1;

var app = new Vue({
	el: '#dash_app',
	data: {
		norad_id: 0,
		sat_name: 0,
		path: [],
		interval: null,
		reqData:{
			mission_instance:{}
		},
		datalocation: {
			lat: 0,
			lng: 0,
			alt: 0,
			time: "N/A",
			i: 0,
			ra: 0,
			e: 0,
			a: 0,
			w: 0,
			tp: 0
		},
		api: {
			list: baseUrl + "/list/",
			location: baseUrl + "/location/" + norad_url,
			telemetry: baseUrl + "/telemetry/" + norad_url,
			log: baseUrl + "/log/" + norad_url,
			instruments: baseUrl + "/instruments/" + norad_url,
			sim_init: baseUrl+"/mse_init/"+norad_url,
			sim_step: baseUrl+"/mse_step/"+sim_step_url
		}
	},
	mounted: function () {
		var theApp = this;
		this.getNoradId();

		setTimeout(() => {}, 3000);

		this.interval = setInterval(function () {
			theApp.simStep();
		}.bind(this), loopBreak);
	},
	methods: {
		getNoradId() {
			var theApp = this;

			this.loadApiGet(this.api.list, function (data) {
				theApp.norad_id = data.satelites[0].norad_id;
				theApp.sat_name = data.satelites[0].sat_name;
				norad_url = "?norad_id=" + data.satelites[0].norad_id;
				theApp.initSim();
			});
		},
		initSim() {
			var theApp = this;
			var timeNow =  new Date().toJSON().replace(/-/g,',').replace(/T/g,',').replace(/:/g,',').replace(/Z/g,'').slice(0,19);
			this.loadApiGet(this.api.sim_init + norad_url+"&date="+timeNow, function (data) {
				theApp.reqData.mission_instance = data.mission_instance;
			 });
		},
		simStep() {
			var theApp = this;

			var formData = new FormData();
			formData.append('mission_instance', JSON.stringify(this.reqData.mission_instance));

			this.loadApiPost(this.api.sim_step, formData, function (data) { 
				satLocation = data.mission_instance.satellite.location;
				var ctx = document.getElementById("earth_map_img").getContext("2d");

				var lng = (satLocation.lng < 0) ? satLocation.lng : satLocation.lng * 2;
				var lat = (satLocation.lat > 0) ? satLocation.lat : satLocation.lat * 2;

				var x = Math.abs(Math.round(lng * mapConversionConstX));
				var y = Math.abs(Math.round(lat * mapConversionConstY));

				theApp.path.push({ x, y });

				theApp.drawSatellite(ctx, x, y);

				theApp.getTelemetry(data.mission_instance.satellite.formatted_telemetry);
			}, true);
		},
		getLog() {
			this.loadApi(this.api.log + norad_url, function (data) {
				var log = $("#log_box .row_log");

				log.html('');

				data.log.forEach((val) => {
					log.append('<div class="col-4">' + val.time + '</div><div class="col-4">' + val.severity + '</div><div class="col-4">' + val.description + '</div>');
				});
			});
		},
		getTelemetry(data) {
			var power = $("#power_sect");
			var thermal = $("#thermal_sect");
			var obdh = $("#obdh_sect");
			var adcs = $("#adcs_sect");

			power.html('');
			thermal.html('');
			obdh.html('');
			adcs.html('');

			for(var i=1; i<5; i++){
				power.append('<div class="col-8">' + data.power[i].name + '</div><div class="col-4">' + data.power[i].value + '</div>');
				adcs.append('<div class="col-8">' + data.adcs[i].name + '</div><div class="col-4">' + data.adcs[i].value + '</div>');
				obdh.append('<div class="col-8">' + data.obdh[i].name + '</div><div class="col-4">' + data.obdh[i].value + '</div>');
				thermal.append('<div class="col-8">' + data.thermal[i].name + '</div><div class="col-4">' + data.thermal[i].value + '</div>');
			}
		},
		getActions(data) {
			var power = $("#power_sect");
			var thermal = $("#thermal_sect");
			var obdh = $("#obdh_sect");
			var adcs = $("#adcs_sect");

			power.html('');
			thermal.html('');
			obdh.html('');
			adcs.html('');

			data.power.forEach((val) => {
				power.append('<div class="col-6">' + val.param + '</div><div class="col-6">' + val.value + '</div>');
			});
			data.adcs.forEach((val) => {
				adcs.append('<div class="col-6">' + val.param + '</div><div class="col-6">' + val.value + '</div>');
			});
			data.obdh.forEach((val) => {
				obdh.append('<div class="col-6">' + val.param + '</div><div class="col-6">' + val.value + '</div>');
			});
			data.thermal.forEach((val) => {
				thermal.append('<div class="col-6">' + val.param + '</div><div class="col-6">' + val.value + '</div>');
			});
		},
		drawSatellite(ctx, x, y) {
			var img = document.getElementById("satelite_icon");
			ctx.clearRect(0, 0, mapWidth, mapHeight);
			ctx.drawImage(img, x - 5, y - 5, 20, 20);
		},
		drawTrajectory(ctx) {
			this.path.forEach(function (coord) {
				ctx.beginPath();
				ctx.moveTo(coord.x, coord.y);
				ctx.lineTo(coord.x + 1, coord.y + 1);
				ctx.stroke();
			});
		},
		loadApiGet(endpoint, callback, refreshData) {
			var theApp = this;
			axios.get(endpoint, { withCredentials: true }).then((response) => {
				if (response.data.status === 'ok') {
					callback(response.data);
				}
			}).catch(error => {
				console.log(error);
			});
		},
		loadApiPost(endpoint, postData,callback, refreshData) {
			var theApp = this;
			axios.post(endpoint, postData,{ withCredentials: true }).then((response) => {
				if (response.data.status === 'ok') {
					callback(response.data);
					//	refresh location data
					if (refreshData && response.data.mission_instance.satellite.location){
						theApp.datalocation = response.data.mission_instance.satellite.location;
					}
				}
			}).catch(error => {
				console.log(error);
			});
		}
	},
	beforeDestroy: function () {
		clearInterval(this.interval);
	}
});
