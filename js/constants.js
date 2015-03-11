$(document).ready(function(){
	var constants = [];
	var echellePos = {"EXACTE":1000000000000000000000000000, 0:1, 1:10, 2:100, 3:1000, 4:10000, 5:100000 ,6:10000000 ,7:100000000 ,8:1000000000 ,9:10000000000};
	var echelleNeg = {"EXACTE":0.00000000000000000000000001, 0:1, 1:0.1, 2:0.01, 3:0.001, 4:0.0001, 5:0.00001 ,6:0.000001 ,7:0.0000001 ,8:0.00000001 ,9:0.00000001};

	//chargement
	$.getJSON( "data/constants.json", function( data ) {
		$.each(data.constants,function(index,obj){
			constants.push(obj);
		});
	}).then(function(){
		//tri
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
			var val = obj.value;

			if(localStorage.getItem("PRECISION")!="EXACTE"){
	        	if (localStorage.getItem("EXPONENTIAL")=="true" && (val > echellePos[localStorage.getItem("PRECISION")]-1)  || val < echelleNeg[localStorage.getItem("PRECISION")]) {
	          	    val = val.toExponential(localStorage.getItem("PRECISION"));
		        } else {
		        	val = parseFloat($.number(val,localStorage.getItem("PRECISION"),".",""));
		        }
	        }
			$("#liste-const").append('<div class="list-group-item col-xs-12 col-sm-6 col-md-3"><div class="symbol">'+obj.symbol+'</div><p>'+obj.name+'</p><p class="value"><span class="blue">'+val+'</span> '+obj.unit+'</p></div>');
		});
	});
});