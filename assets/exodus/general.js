/**
 * Map width/360 or Map height/180
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
var loopBreak = 4000;
var baseUrl = "http://api.nova.test:8000"

/**
 * Initial camera view coordinates
 */
var initCameraBox = "-79.40598249435426,43.64671207408792,-79.37158584594728,43.66108833030815";

var norad_url = "";
var sim_step_url = "?steps=1"; // in seconds
var sim_steps = 1;

try{
var router = new VueRouter({
	mode: 'history',
	routes: []
});
} catch(e){
	
}