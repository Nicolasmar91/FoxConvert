$(document).ready(function(){

	$('.toggle').toggles({
	  drag: true, // allow dragging the toggle between positions
	  click: true, // allow clicking on the toggle
	  text: {
	    on: '<span class="glyphicon glyphicon-ok"></span>', // text for the ON position
	    off: '' // and off
	  },
	  on: localStorage.getItem("EXPONENTIAL")=="true", // is the toggle ON on init
	  animate: 250, // animation time
	  transition: 'swing', // animation transition,
	  clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
	  width: 60, // width used if not set in css
	  height: 20, // height if not set in css
	  type: 'compact' // if this is set to 'select' then the select style toggle will be used
	});

	$("#language").change(function(e,data){
		if(data!="NO_RELOAD_LOCATION"){
			localStorage.setItem("LANG",$(this).val());
			location.reload();
		}
	});

	//on set la value selon les paramètres existants
	$("#precision").val(localStorage.getItem("PRECISION")).trigger('change',"NO_RESET_VALUE").selectpicker("refresh");

	$("#precision").change(function(e,data){
		if(data!="NO_RESET_VALUE"){
			localStorage.setItem("PRECISION",$(this).val());
		}
	});

	$('.toggle').on('toggle', function (e, active) {
	    if (active) {
	    	localStorage.setItem("EXPONENTIAL","true");
	    }else{
	    	localStorage.setItem("EXPONENTIAL","false");
	  	}
	});


});