// $(".mission_type").hide();
var editor;
var app = new Vue({
	router,
	el: '#mission_app',
	data: {
		norad_id: 0,
		sat_name: 0,
		path: [],
		interval: null,
		stopQuery: false,
		mid: null,
		satEnvironment: null,
		satLocation:null,
		reqData:{
			mission_instance:{}
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
		$("#sel_mission_type").change(function () {
			var missionType = $(this).find('option:selected').val();
			switch (missionType) {
				case "1":
					$(".mission_type").hide();
					$("#earth_mission").show();
					break;
				case "2":
					$(".mission_type").hide();
					$("#sdr_mission").show();
					break;
				case "3":
					$(".mission_type").hide();
					$("#fire_mission").show();
					break;
				case "4":
					$(".mission_type").hide();
					$("#custom_mission").show();
					break;
				default:
					$(".mission_type").hide();
					break;
			}
		});
		editor = $("#c_code").linedTextEditor();;
	},
	methods: {
		loadApiGet(endpoint, callback) {
			var theApp = this;
			axios.get(endpoint, { withCredentials: true }).then((response) => {
				if (response.data.status === 'ok') {
					callback(response.data);
				}
			}).catch(error => {
				console.log(error);
			});
		},
		loadApiPost(endpoint, postData, callback) {
			var theApp = this;
			axios.post(endpoint, postData,{ withCredentials: true }).then((response) => {
				if (response.data.status === 'ok') {
					if (callback) {
						callback(response.data);
					}
				}
			}).catch(error => {
				console.log(error);
			});
		}
	}
});