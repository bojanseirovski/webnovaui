// core functions
function apiPost(url, data, callback){
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data){
            if (callback){
                callback(data);
            }
        },
        dataType: 'json'
    });
}

function apiGet(url, data, callback){
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function(data){
            if (callback){
                callback(data);
            }
        },
        dataType: 'json'
    });
}

//  App environment
var appData = {
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
        sim_save: baseUrl+"/mse_save/",
		mission_list: baseUrl+"/mse_mission_list",
		mission_details: baseUrl+"/mse_mission_details"
    }
};

//  API
function getNoradId(){
    appData.stopQuery = false;
    apiGet(appData.api.list, null, function (data) {
        appData.norad_id = data.satelites[0].norad_id;
        appData.sat_name = data.satelites[0].sat_name;
        norad_url = "?norad_id=" + data.satelites[0].norad_id;
        initSim();
    });
}
function initSim(){
    var timeNow =  new Date().toJSON().replace(/-/g,',').replace(/T/g,',').replace(/:/g,',').replace(/Z/g,'').slice(0,19);
    drawSatImage();
    var hashId = appData.mid ? '?hash_id='+appData.mid : '';
    var initUrl = appData.api.sim_init + norad_url+"&date="+timeNow
    if(appData.mid){
        initUrl = appData.api.sim_init +hashId;
    }
    apiGet(initUrl, null, function (data) {
        appData.reqData.mission_instance = data.mission_instance;
        appData.mid = null;
     });
}
function simStep(earthMapImgDiv = "earth_map_img"){
    var formData = {
        'mission_instance': JSON.stringify(appData.reqData.mission_instance)
    };
    
    apiPost(appData.api.sim_step, formData, function (data) { 
        appData.satLocation = data.mission_instance.satellite.location;
        appData.datalocation = data.mission_instance.satellite.location;
        var ctx = document.getElementById(earthMapImgDiv).getContext("2d");

        var lng = (appData.satLocation.lng < 0) ? appData.satLocation.lng : appData.satLocation.lng * 2;
        var lat = (appData.satLocation.lat > 0) ? appData.satLocation.lat : appData.satLocation.lat * 2;

        var x = Math.abs(Math.round(lng * mapConversionConstX));
        var y = Math.abs(Math.round(lat * mapConversionConstY));

        appData.path.push({ x, y });
        earthMapTopBar();
        earthMapBottomBar();        
        drawSatellite(ctx, x, y);
        setupLeafletMapView(appData.satLocation.lat,appData.satLocation.lng);
        getTelemetry(data.mission_instance.satellite.formatted_telemetry);
        getLog(data.mission_instance.environment.log_buffer);
    });
}
function getTelemetry(data){
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
}
function getLog(data){
    var log = $("#row_logs");
    var howMany = log.find('.row').length;
    if(howMany>8){
        for(i=8;i<howMany;i++){
            log.find('.row:nth-child('+i+')').remove();
        }
    }

    log.prepend('<div class="row"><div class="col-4">' + data[0][0] + '</div><div class="col-8">' + data[0][1] + '</div></div>');
}
function getMissionList(selectIdDropDown = "#sel_mission_type"){
    apiGet(appData.api.mission_list, null, function(data){
        $.each(data.data, function(k, v){
            var opt = $('<option/>')
            opt.attr('value',v.mission_id);
            opt.html(v.name);
            $(selectIdDropDown).append(opt);
        });
    });
}
function getMissionDetails(mid){
    $('.continueMission').attr('href','dashboard.html?mission_id='+mid)
    apiGet(appData.api.mission_details+'?mission_id='+mid, null, function(data){
        var nameElem = $('<div>');
        var detailElem = $('<div>');

        nameElem.attr('class','col-md-6');
        nameElem.html(data.mission_name);

        detailElem.attr('class','col-md-6');
        detailElem.html(data.mission_details);
        $('.missionDetails').append(nameElem).append(detailElem);
        $('.continueMission').removeClass('disabled');
    });

}

function sendLink(){

    var rname = $('#recipient-name').val();
    var remail = $('#recipient-email').val();
    if(rname.length===0 || remail.length ===0){
        return;
    }
    appData.reqData.mission_instance.remail= remail;
    appData.reqData.mission_instance.rname = rname;
    var formData = {
        'mission_instance': JSON.stringify(appData.reqData.mission_instance)
    };

    apiPost(appData.api.sim_save, formData, function(data){
        resetUiComponents();
        $('#send_hash_link_modal').modal('hide');
    });
}
function resetLink(){
    var formData = {
        'mission_instance': JSON.stringify(appData.reqData.mission_instance)
    };

    apiPost(appData.api.sim_reset, formData, function(data){
        resetUiComponents();
        $('#reset_mission_link_modal').modal('hide');
    });
}
function resetUiComponents(){
    appData.stopQuery = true;
    var ctx = document.getElementById("earth_map_img").getContext("2d");
    ctx.clearRect(0, 0, mapWidth, mapHeight);
    appData.datalocation = {
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
    appData.satEnvironment = null;
    $('#startMissionButton').removeClass('disabled');
    $('#resetMissionButton').addClass('disabled');
    $('#saveMissionButton').addClass('disabled');
    $("#power_sect").html('');
    $("#thermal_sect").html('');
    $("#obdh_sect").html('');
    $("#adcs_sect").html('');
    clearInterval(appData.interval);
}

//  Map
function setupLeafletMap(lat, lng, mapDiv = "camera_sect") {
	$('#'+mapDiv).css({height:"350%"});
	map = L.map(mapDiv).setView([lat,lng], defaultMapZoom);
	L.tileLayer(mapUrl,{maxZoom: 18}).addTo(map);
}
function setupLeafletMapView(lat, lng){
	if(lat!=null && lng!=null){
		var topC = [lat+0.005, lng-0.005];
		var bottomC = [lat-0.005, lng+0.005];
		map.fitBounds([topC,bottomC]);
	}
}

//  sattelite canvas
function drawSatellite(ctx, x, y, sattelite_icon = "satelite_icon") {
    var img = document.getElementById(sattelite_icon);
    ctx.clearRect(0, 0, mapWidth, mapHeight);
    ctx.drawImage(img, x - 5, y - 5, 20, 20);
}
function drawTrajectory(ctx) {
    appData.path.forEach(function (coord) {
        ctx.beginPath();
        ctx.moveTo(coord.x, coord.y);
        ctx.lineTo(coord.x + 1, coord.y + 1);
        ctx.stroke();
    });
}
function drawSatImage(){
    if(!appData.satLocation){
        return;
    }
    var lat = appData.satLocation.lat;
    var lng = appData.satLocation.lng;

    var latSign = lat>0 ? 1 : -1;
    var lngSign = lng>0 ? 1 : -1;

    var topLat = lat - (latSign* 0.01);
    var bottomLat = lat + (latSign* 0.01);

    var topLng = lng - (lngSign* 0.01);
    var bottomLng = lng + (lngSign* 0.01);

    appData.datalocation.cameraBox = ''+topLat+','+topLng+','+bottomLat+','+bottomLng;
}

//  html helpers
function earthMapTopBar(elDiv = "earth_map_top_bar"){
    $("#"+elDiv).show();
    $("#"+elDiv).children().each(function(){
        var paramName = $(this).attr("id").toString();
        var paramSearchStr = /{{ \w+\.\w+ }}/g;
        var satLocation = toArray(appData.datalocation);

        var paramValue = satLocation[""+paramName+""];
        
        if( paramName === "lat" || paramName === "lng" || paramName === "alt" ){
            paramValue = satLocation[""+paramName+""].toFixed(6);
        }

        var paramContent = $("#"+elDiv+" #"+paramName).html();
        $("#"+elDiv+" #"+paramName).html(paramContent.replace(paramSearchStr, paramValue));
    });
}
function earthMapBottomBar(elDiv = "earth_map_bottom_bar"){
    $("#"+elDiv).show();
    $("#"+elDiv).children().each(function(){
        var paramName = $(this).attr("id").replace("_bar","").toString();
        var paramSearchStr = /{{ \w+\.\w+ }}/g;
        var satLocation = toArray(appData.datalocation);

        var paramValue = satLocation[""+paramName+""];
        if( paramName === "tp" ){
            paramValue = satLocation[""+paramName+""].toFixed(6);
        }

        var paramContent = $(this).html().replace(paramSearchStr, paramValue);
        $("#"+elDiv+" #"+$(this).attr("id")).html(paramContent);
    });
}

//  helpers
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function toArray(obj){
    var theArray = [];
    for (const key in obj) {
        theArray[key] = obj[key];
    }
    return theArray;
}