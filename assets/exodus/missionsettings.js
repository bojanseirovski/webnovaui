var editor;
var missionApp = new Vue({
	router,
	el: '#mission_app',
	data: {
		mid: '',
		api: {
			mission_list: baseUrl+"/mse_mission_list",
			mission_details: baseUrl+"/mse_mission_details"
		}
	},
	mounted: function () {
		$('.continueMission').addClass('disabled');
		var theApp = this;
		theApp.getMissionList();
		$("#sel_mission_type").change(function () {
			theApp.mid = $(this).find('option:selected').val();
			theApp.getMissionDetails(theApp.mid);
		});
		// editor = $("#c_code").linedTextEditor();
	},
	methods: {
		getMissionList(){
			var theApp = this;
			theApp.loadApiGet(theApp.api.mission_list, function(data){
				$.each(data.data, function(k, v){
					var opt = $('<option/>')
					opt.attr('value',v.mission_id);
					opt.html(v.name);
					$("#sel_mission_type").append(opt);
				});
			});
		},
		getMissionDetails(mid){
			var theApp = this;
			theApp.mid = mid;
			$('.continueMission').attr('href','dashboard.html?mission_id='+mid)
			theApp.loadApiGet(theApp.api.mission_details+'?mission_id='+mid, function(data){
				var nameElem = $('<div>');
				var detailElem = $('<div>');
				var nameElemV = $('<div>');
				var detailElemV = $('<div>');
	
				nameElem.attr('class','col-6 text_yellow');
				nameElem.html('Name');
				nameElemV.attr('class','col-6');
				nameElemV.html(data.mission_name);
				$('.missionDetails').append(nameElem).append(nameElemV);

				detailElem.attr('class','col-6 text_yellow');
				detailElem.html('Details');
				detailElemV.attr('class','col-6');
				detailElemV.html(data.mission_details);
				$('.missionDetails').append(detailElem).append(detailElemV);

				$('.continueMission').removeClass('disabled');
			});

		},
		gotoStartMission(){
			$('html, body').animate({
				scrollTop: $("#start_the_mission").offset().top
			}, 1000);
		},
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