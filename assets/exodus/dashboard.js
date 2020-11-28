var app = new Vue({
	router,
	el: '#dash_app',
	data: {
		norad_id: 0,
		sat_name: 0,
		path: [],
		interval: null,
		stopQuery: false,
		mid: null,
		missionId: 0,
		satEnvironment: null,
		satLocation:null,
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
			tp: 0,
			cameraBox: ''
		},
		api: {
			list: baseUrl + "/list/",
			location: baseUrl + "/location/" + norad_url,
			telemetry: baseUrl + "/telemetry/" + norad_url,
			log: baseUrl + "/log/" + norad_url,
			instruments: baseUrl + "/instruments/" + norad_url,
			sim_init: baseUrl+"/mse_init/"+norad_url,
			sim_step: baseUrl+"/mse_step/"+sim_step_url,
			sim_reset: baseUrl+"/mse_reset/",
			sim_save: baseUrl+"/mse_save/"
		}
	},
	mounted: function () {
		var theApp = this;
		theApp.datalocation.cameraBox = initCameraBox;
		// hash mission ID
		if(theApp._route.query && theApp._route.query.mid && theApp._route.query.mid.length>5){
			theApp.mid = theApp._route.query.mid;
			if(!theApp.stopQuery){
				$('#startMissionButton').addClass('disabled');
				$('#resetMissionButton').removeClass('disabled');
				$('#saveMissionButton').removeClass('disabled');
				theApp.initSim();
				theApp.interval = setInterval(function () {
					theApp.simStep();
				}.bind(theApp), loopBreak);
			}
		}
		// mission ID from first screen
		if(theApp._route.query && theApp._route.query.mission_id && theApp._route.query.mission_id.length>0){
			theApp.missionId = theApp._route.query.mission_id;
		}
		theApp.setupLeafletMap(0,0);
	},
	methods: {
		startMission(){
			var theApp = this;
			theApp.getNoradId();
			theApp.drawSatImage();
			setTimeout(() => {}, 3000);
			$('#startMissionButton').addClass('disabled');
			$('#resetMissionButton').removeClass('disabled');
			$('#saveMissionButton').removeClass('disabled');
			theApp.interval = setInterval(function () {
				if(!theApp.stopQuery){
					theApp.simStep();
				}
			}.bind(this), loopBreak);
		},
		resetMission(){
			var theApp = this;
			var formData = new FormData();
			formData.append('mission_instance', JSON.stringify(this.reqData.mission_instance));

			this.loadApiPost(this.api.sim_reset, formData, function(data){
				theApp.resetUiComponents(theApp);
			}, true);
		},
		saveMission(){
			var theApp = this;

			$('#send_hash_link_modal').modal('show');
		},
		getNoradId() {
			var theApp = this;
			theApp.stopQuery = false;
			theApp.loadApiGet(theApp.api.list, function (data) {
				theApp.norad_id = data.satelites[0].norad_id;
				theApp.sat_name = data.satelites[0].sat_name;
				norad_url = "?norad_id=" + data.satelites[0].norad_id;
				theApp.initSim();
			});
		},
		initSim() {
			var theApp = this;
			var timeNow =  new Date().toJSON().replace(/-/g,',').replace(/T/g,',').replace(/:/g,',').replace(/Z/g,'').slice(0,19);
			theApp.drawSatImage();
			var hashId = theApp.mid ? '?hash_id='+theApp.mid : '';
			var initUrl = theApp.api.sim_init + norad_url+"&date="+timeNow
			if(theApp.mid){
				initUrl = theApp.api.sim_init +hashId;
			}
			theApp.loadApiGet(initUrl, function (data) {
				theApp.reqData.mission_instance = data.mission_instance;
				theApp.mid = null;
			 });
		},
		simStep() {
			var theApp = this;

			var formData = new FormData();
			formData.append('mission_instance', JSON.stringify(theApp.reqData.mission_instance));

			theApp.loadApiPost(theApp.api.sim_step, formData, function (data) { 
				theApp.satLocation = data.mission_instance.satellite.location;
				var ctx = document.getElementById("earth_map_img").getContext("2d");

				var lng = (theApp.satLocation.lng < 0) ? theApp.satLocation.lng : theApp.satLocation.lng * 2;
				var lat = (theApp.satLocation.lat > 0) ? theApp.satLocation.lat : theApp.satLocation.lat * 2;

				var x = Math.abs(Math.round(lng * mapConversionConstX));
				var y = Math.abs(Math.round(lat * mapConversionConstY));

				theApp.path.push({ x, y });

				theApp.drawSatellite(ctx, x, y);
				theApp.setupLeafletMapView(theApp.satLocation.lat,theApp.satLocation.lng);
				theApp.getTelemetry(data.mission_instance.satellite.formatted_telemetry);
				theApp.getLog(data.mission_instance.environment.log_buffer);
			}, true);
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
		getLog(data) {
			var log = $("#row_logs");
			var howMany = log.find('.row').length;
			if(howMany>8){
				for(i=6;i<howMany;i++){
					log.find('.row:nth-child('+i+')').remove();
				}
			}

			log.prepend('<div class="row"><div class="col-4">' + data[0][0] + '</div><div class="col-4">&nbsp;</div><div class="col-4">' + data[0][1] + '</div></div>');
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
		drawSatImage(){
			var theApp = this;
			if(!theApp.satLocation){
				return;
			}
			var lat = theApp.satLocation.lat;
			var lng = theApp.satLocation.lng;

			var latSign = lat>0 ? 1 : -1;
			var lngSign = lng>0 ? 1 : -1;

			var topLat = lat - (latSign* 0.01);
			var bottomLat = lat + (latSign* 0.01);

			var topLng = lng - (lngSign* 0.01);
			var bottomLng = lng + (lngSign* 0.01);

			theApp.datalocation.cameraBox = ''+topLat+','+topLng+','+bottomLat+','+bottomLng;
		},
		resetUiComponents(theApp){
			theApp.stopQuery = true;
			var ctx = document.getElementById("earth_map_img").getContext("2d");
			ctx.clearRect(0, 0, mapWidth, mapHeight);
			theApp.datalocation = {
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
			};
			theApp.satEnvironment = null;
			$('#startMissionButton').removeClass('disabled');
			$('#resetMissionButton').addClass('disabled');
			$('#saveMissionButton').addClass('disabled');
			$("#power_sect").html('');
			$("#thermal_sect").html('');
			$("#obdh_sect").html('');
			$("#adcs_sect").html('');
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
		loadApiPost(endpoint, postData, callback, refreshData) {
			var theApp = this;
			axios.post(endpoint, postData,{ withCredentials: true }).then((response) => {
				if (response.data.status === 'ok') {
					if (callback) {
						callback(response.data);
					}
					theApp.satEnvironment = response.data.mission_instance.environment;
					//	refresh location data
					if (refreshData && response.data.mission_instance.satellite.location){
						theApp.datalocation = response.data.mission_instance.satellite.location;
					}
				}
			}).catch(error => {
				console.log(error);
			});
		},
		setupLeafletMap: function (lat, lng) {
			$('#camera_sect').css({height:"400%"});
			map = L.map('camera_sect').setView([lat,lng], defaultMapZoom);
			L.tileLayer(mapUrl,{maxZoom: 18}).addTo(map);
		},
		setupLeafletMapView(lat, lng){
			if(lat!=null && lng!=null){
				var topC = [lat+0.005, lng-0.005];
				var bottomC = [lat-0.005, lng+0.005];
				map.fitBounds([topC,bottomC]);
			}
		}
	},
	beforeDestroy: function () {
		clearInterval(this.interval);
	}
});

var menuButtonsApp = new Vue({
	el: '#sideapp',
	methods:{
		startMissionButton(){
			app.startMission();
		},
		resetMissionButton(){
			app.resetMission();
		},
		saveMissionButton(){
			app.saveMission();
		}

	}
});


var MOdalApp = new Vue({
	el: '#send_hash_link_modal',
	methods:{
		sendLink(){
			var formData = new FormData();

			var rname = $('#recipient-name').val();
			var remail = $('#recipient-email').val();
			if(rname.length===0 || remail.length ===0){
				return;
			}
			app.reqData.mission_instance.remail= remail;
			app.reqData.mission_instance.rname = rname;
			formData.append('mission_instance', JSON.stringify(app.reqData.mission_instance));
			app.loadApiPost(app.api.sim_save, formData, function(data){
				app.resetUiComponents(app);
				$('#send_hash_link_modal').modal('hide');
			}, true);
		}

	}
});
