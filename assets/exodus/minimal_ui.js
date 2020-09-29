$(document).ready(function(){
  /* Initialize */
  /* Bind event handlers */
  namespace_ui.initialize();
//  namespace_ui.evolve();
});

/* constants */
var API_ROOT = "http://localhost:8000";
var LIST_SATS = "/list";
var INIT_MSE = "/mse_init?"
var STEP_MSE = "/mse_step/?"
var START_DATE="2019,01,10,12,34,0";

var namespace_ui = (function (){
    /* private data */
    var norad_id;
    var mission_instance;
    /* private methods */
    function initialize_simulator()
    {
      var start_date = START_DATE;
      var api_call_list = API_ROOT + LIST_SATS;
      var api_call_init = API_ROOT + INIT_MSE;
      $.getJSON(api_call_list, function(data)
      {
        if (data["status"] == "ok")
        {
          norad_id = data["satelites"][0]["norad_id"];
          api_call_init =  api_call_init + "norad_id="+ norad_id + "&date="+START_DATE;
          $.getJSON(api_call_init, function(data){
            mission_instance = data;
            console.log(mission_instance);
            step_simulation();
          });
        }
      });
    }

    function step_simulation()
    {
      var steps="3";
      var api_call_step = API_ROOT + STEP_MSE+"steps="+steps;
      $.post(api_call_step, {"mission_instance":JSON.stringify(mission_instance["mission_instance"])}, function(data)
      {
        mission_instance = JSON.parse(data);
        console.log(mission_instance);
      });
    }

    /* public interface */
    return {
      initialize: function()
      {
        initialize_simulator();
      },
      evolve: function()
      {
        step_simulation();
      }
    }
}) ();
