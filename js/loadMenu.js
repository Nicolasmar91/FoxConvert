$(document).ready(function(){
	$.getJSON( "data/menu.json", function( data ) {
		$.each(data.menu_fr,function(index,obj){
			if(window.location.href.indexOf(obj.href)<0)
				$("#menu ul.dropdown-menu").append('<li><a href="'+obj.href+'">'+obj.label+'</a></li>')
		});
	});
});