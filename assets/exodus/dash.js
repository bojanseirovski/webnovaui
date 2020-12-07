//  check for URL params
var mid = getUrlParameter('mid');
var mission_id = getUrlParameter('mission_id');

//  init dashboard
$(document).ready(function(){
    $("#earth_map_top_bar").hide();
    $("#earth_map_bottom_bar").hide();
    appData.datalocation.cameraBox = initCameraBox;
    drawSatImage();
    setupLeafletMap(0, 0)

    //  left nav
    $("#startMissionButton").on("click", function(){
        getNoradId();
        drawSatImage();
        setTimeout(() => {}, 3000);
        $('#startMissionButton').addClass('disabled');
        $('#resetMissionButton').removeClass('disabled');
        $('#saveMissionButton').removeClass('disabled');
        appData.interval = setInterval(function () {
            if(!appData.stopQuery){
                simStep("earth_map_img");
            }
        }, loopBreak);
    });

    //  modals
    $("#resetMissionButton").on("click", function(){
        $('#reset_mission_link_modal').modal('show');
    });

    $("#saveMissionButton").on("click", function(){
        $('#send_hash_link_modal').modal('show');
    });

    $("#send_hash_link_btn").on("click", function(){
        sendLink();
    });

    $(".resetLink").on("click", function(){
        resetLink();
    });
});