$(document).ready(function(){
	$.getJSON( "data/menu.json", function( data ) {
		$.each(data.menu_fr,function(index,obj){
			console.log(window.location.href);
			if(window.location.href.indexOf(obj.href)<0)
				$("ul.dropdown-menu").append('<li><a href="'+obj.href+'">'+obj.label+'</a></li>')
		});
	});
});