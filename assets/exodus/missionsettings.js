var editor;
// editor = $("#c_code").linedTextEditor();
$(document).ready(function(){
	$('.continueMission').addClass('disabled');
	getMissionList("#sel_mission_type");
	$("#sel_mission_type").change(function () {
		appData.mid = $(this).find('option:selected').val();
		getMissionDetails(appData.mid);
	});
});