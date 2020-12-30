/**
 * Map width/360 or Map height/180
 * 427/360 , 213.5/360
 */
// var mapConversionConstX = 0.8277;
// var mapConversionConstY = 0.8333;
var mapConversionConstX = 1.186111111;
var mapConversionConstY = 0.593055556;
/**
 * Map size
 */
var mapWidth = 427;
var mapHeight = 213.5;
var mapXhalf = mapWidth/2;
var mapYhalf = mapHeight/2;
/**
 * Pause between AJAX calls
 */
var loopBreak = 5000;
var baseUrl = "http://api.nova.test:8000"

/**
 * Initial camera view coordinates
 */
var initCameraBox = "-79.40598249435426,43.64671207408792,-79.37158584594728,43.66108833030815";

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
