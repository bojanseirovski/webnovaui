/**
 * Map width/360 or Map height/180
 * 427/360 , 213.5/180
 */

var mapConversionConstX = 1.186111111;
var mapConversionConstY = 1.186111111;
/**
 * Map size
 */
var mapWidth = 427;
var mapHeight = 213.5;

/**
 * Pause between AJAX calls
 */
var loopBreak = 5000;
var baseUrl = "http://webnova-dev.exodusorbitals.com:8000"

/**
 * Initial camera view coordinates
 */
var initCameraBox = "-79.40598249435426,43.64671207408792,-79.37158584594728,43.66108833030815";

var currentMissionCookie = "webnova_current_mission";
var currentEnvCookie = "webnova_current_env";
var currentSatCookie = "webnova_current_sat";

var norad_url = "";
var sim_step_time = 5;
var sim_step_url = "?steps="+sim_step_time; // in seconds
var sim_steps = 5;

try{
	var router = new VueRouter({
		mode: 'history',
		routes: []
	});
} catch(e){

}

//need to initialize canvas dimensions, otherwise it will default to 300x150
try{
    var ctx = document.getElementById("earth_map_img").getContext("2d");
    ctx.canvas.width  = mapWidth;
    ctx.canvas.height = mapHeight;
} catch(e){

}

var mapCam;
var mapSat;
var defaultMapZoom = 3;
var mapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var satMarker;
var sateliteIcon;
try{
    sateliteIcon = L.icon({
        iconUrl: '/assets/img/satellite-icon.png',
        iconSize: [35, 35],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });
} catch(e){

}

function setCookieValue(name = "exodusapp", value = "", expiry = null){
    expiry = expiry ? expiry : "Fri, 31 Dec 2030 23:59:59";
    document.cookie = name + "=" + value + "; expires=" + expiry + "; path=/;SameSite=Lax";
}

function getCookieValue(name = "exodusapp"){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}