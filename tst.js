$(document).ready(function(){
	

if(navigator.onLine){
	var xhr = new XMLHttpRequest({mozSystem: true});
	xhr.open("GET", "data/tst.xml", true);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
			xmlDoc = $.parseXML( xhr.responseText ),
		    $xml = $( xmlDoc );
		    var dateToday = $xml.find("Cube[time]").attr("time");
		    if (dateToday!=localStorage.getItem("LAST_MAJ_DATE")){
		    	localStorage.setItem("LAST_MAJ_DATE",dateToday);
		    	$($xml.find("Cube[rate]")).each(function(){	
		    		$("#log").append("<br/>"+$(this).attr("currency")+' '+$(this).attr("rate"));
		    	    localStorage.setItem($(this).attr("currency"),$(this).attr("rate"));
		    	});
		    }
	    }
	}
	xhr.send();
}else{
	console.log("je suis off");
}

});