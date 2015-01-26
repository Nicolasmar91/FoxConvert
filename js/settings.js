$(document).ready(function(){

	$('.toggle').toggles({
	  drag: true, // allow dragging the toggle between positions
	  click: true, // allow clicking on the toggle
	  text: {
	    on: '<span class="glyphicon glyphicon-ok"></span>', // text for the ON position
	    off: '' // and off
	  },
	  on: true, // is the toggle ON on init
	  animate: 250, // animation time
	  transition: 'swing', // animation transition,
	  checkbox: null, // the checkbox to toggle (for use in forms)
	  clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
	  width: 40, // width used if not set in css
	  height: 20, // height if not set in css
	  type: 'compact' // if this is set to 'select' then the select style toggle will be used
	});

	$.getJSON( "data/translate.json", function( data ) {
		$.each(data.menu_fr,function(index,obj){
			if(window.location.href.indexOf(obj.href)<0)
				$("#menu ul.dropdown-menu").append('<li><a href="'+obj.href+'">'+obj.label+'</a></li>')
		});
	});

});