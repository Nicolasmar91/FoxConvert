$(document).ready(function(){
	var constants = [];

	$.getJSON( "data/constants.json", function( data ) {
		$.each(data.constants,function(index,obj){
			constants.push(obj);
		});
	}).then(function(){
		constants.sort(function (a, b) {
            var leftKey = a.name.toUpperCase();
            var rightKey = b.name.toUpperCase();

            if (leftKey.charAt(0) == rightKey.charAt(0)) {
                if (leftKey.charAt(1) < rightKey.charAt(1)) { return -1; }
                else { return 1; }
            }

            if (leftKey.charAt(0) < rightKey.charAt(0)) { return -1; }
            else { return 1; }
        });

		$.each(constants,function(i,obj){
			$("#liste-const").append('<div class="list-group-item col-xs-12 col-sm-6 col-md-3"><div class="symbol">'+obj.symbol+'</div><p>'+obj.name+'</p><p class="value"><span class="blue">'+obj.value+'</span> '+obj.unit+'</p></div>');
		});
	});
});