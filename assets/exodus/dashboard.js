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
				$('#startMissionButtonM').addClass('disabled');
				$('#resetMissionButtonM').removeClass('disabled');
				$('#saveMissionButtonM').removeClass('disabled');

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
		theApp.setupCamMap(0,0);
		// theApp.setupSatMap(0,0);
	},
	methods: {
		startMission(){
			var theApp = this;
			theApp.getNoradId();
			setTimeout(() => {}, 4000);
			$('#startMissionButton').addClass('disabled');
			$('#resetMissionButton').removeClass('disabled');
			$('#saveMissionButton').removeClass('disabled');
			$('#startMissionButtonM').addClass('disabled');
			$('#resetMissionButtonM').removeClass('disabled');
			$('#saveMissionButtonM').removeClass('disabled');
			theApp.interval = setInterval(function () {
				if(!theApp.stopQuery){
					theApp.simStep();
				}
			}.bind(this), loopBreak);
			$('#startMissionButton').blur();
			$('#startMissionButtonM').blur();
		},
		resetMission(){
			$('#reset_mission_link_modal').modal('show');
		},
		saveMission(){
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
				// theApp.setupSatMapView(theApp.satLocation.lat,theApp.satLocation.lng);
				theApp.showLocation(theApp.satLocation.lat,theApp.satLocation.lng);
				theApp.setupCamMapView(theApp.satLocation.lat,theApp.satLocation.lng);
				theApp.getTelemetry(data.mission_instance.satellite.formatted_telemetry);
				theApp.getLog(data.mission_instance.environment.log_buffer);
				theApp.reqData.mission_instance = data.mission_instance;
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
				for(i=8;i<howMany;i++){
					log.find('.row:nth-child('+i+')').remove();
				}
			}

			log.prepend('<div class="row"><div class="col-4">' + data[0][0] + '</div><div class="col-8">' + data[0][1] + '</div></div>');
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
		resetUiComponents(theApp){
			theApp.stopQuery = true;
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
			$('#startMissionButtonM').removeClass('disabled');
			$('#resetMissionButtonM').addClass('disabled');
			$('#saveMissionButtonM').addClass('disabled');
			$("#power_sect").html('');
			$("#thermal_sect").html('');
			$("#obdh_sect").html('');
			$("#adcs_sect").html('');
			$("#row_logs").html('');
			theApp.setupCamMap(0,0);
			// theApp.setupSatMap(0,0);
			$('#resetMissionButton').blur();
			$('#resetMissionButtonM').blur();
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
						theApp.datalocation.a = theApp.datalocation.a.toFixed(2);
						theApp.datalocation.e = theApp.datalocation.e.toFixed(4);
						theApp.datalocation.i = theApp.datalocation.i.toFixed(2);
						theApp.datalocation.ra = theApp.datalocation.ra.toFixed(2);
						theApp.datalocation.w = theApp.datalocation.w.toFixed(2);
						theApp.datalocation.tp = theApp.datalocation.tp.toFixed(2);
						theApp.datalocation.lat = theApp.datalocation.lat.toFixed(2);
						theApp.datalocation.lng = theApp.datalocation.lng.toFixed(2);
						theApp.datalocation.alt = theApp.datalocation.alt.toFixed(2);
					}
				}
			}).catch(error => {
				console.log(error);
			});
		},
		setupCamMap: function (lat, lng) {
			if (mapCam) {
				mapCam.off();
				mapCam.remove();
			}
			$('#camera_sect').css({height:"350%"});
			mapCam = L.map('camera_sect').setView([lat,lng], defaultMapZoom);
			L.tileLayer(mapUrl,{maxZoom: 18}).addTo(mapCam);
		},
		setupCamMapView(lat, lng){
			if(lat!=null && lng!=null){
				var topC = [lat+0.005, lng-0.005];
				var bottomC = [lat-0.005, lng+0.005];
				mapCam.fitBounds([topC,bottomC]);
			}
		},
		setupSatMap: function (lat, lng) {
			if (mapSat) {
				mapSat.off();
				mapSat.remove();
			}
			$('#earth_map_img').css({height:"80%"});
			mapSat = L.map('earth_map_img',{ zoomControl: false }).setView([lat,lng], 1);
			L.tileLayer(mapUrl,{maxZoom: 2}).addTo(mapSat);
		},
		setupSatMapView(lat, lng){
			if(lat!=null && lng!=null){
				$('#earth_map_img .leaflet-pane.leaflet-marker-pane img').remove();
				if (lat>81) {
					lat = lat -10;
				}
				if (lat<-81) {
					lat = lat +10;
				}
				satMarker = L.marker([lat, lng], {icon: sateliteIcon}).addTo(mapSat);
				mapSat.fitBounds([[lat+20, lng+20],[lat-20, lng-20]]);
				mapSat.invalidateSize();
			}
		},
		showLocation(lat, lng) {
			var theApp = this;

			var x = Math.round(mapXhalf + lng * mapConversionConstX);
			var y = Math.round(mapYhalf + lat * mapConversionConstY);

			theApp.path.push({ x, y });

			theApp.drawSatellite(x, y);
		},
		drawSatellite(x, y) {
			var ctx = document.getElementById("earth_map_img").getContext("2d");
			ctx.clearRect(0, 0, mapWidth, mapHeight);

			var xMargin = 10;
			var yMargin = 10;
			if(x<10 || x>mapWidth-15){
				xMargin = 0;
			}
			if(y<10 || y>mapHeight-15){
				yMargin = 0;
			}

			var img = new Image();
			img.onload = function () {
				ctx.drawImage(this, x-xMargin, y-yMargin, 20, 20);
			};
			img.src = "/assets/img/satellite-icon.png";
		},
		drawTrajectory(ctx) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#fff";
			ctx.beginPath();
			this.path.forEach(function (coord) {
				ctx.moveTo(coord.x, coord.y);
				ctx.lineTo(coord.x + 1, coord.y + 1);
			});
			ctx.stroke();
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
				$('#saveMissionButton').blur();
				$('#saveMissionButtonM').blur();
			}, true);
		}

	}
});


var MOdalAppReset = new Vue({
	el: '#reset_mission_link_modal',
	methods:{
		resetLink(){
			var formData = new FormData();
			formData.append('mission_instance', JSON.stringify(app.reqData.mission_instance));

			app.loadApiPost(app.api.sim_reset, formData, function(data){
				app.resetUiComponents(app);
				$('#reset_mission_link_modal').modal('hide');
			}, true);
		}

	}
});

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
	e.returnValue = '';
	if(app.stopQuery){
		if(confirm("You are about to close this window. Are you sure?")){
			return true;
		}
	}

	return false;
});