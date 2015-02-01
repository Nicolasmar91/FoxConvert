var TRANSLATES=[];

$(document).ready(function(){

	$.getJSON( "data/translate.json", function( data ) {
		//check donnée settings pour prendre le bon fichier
		var translates;

		if(localStorage.getItem("LANG")=="FR"){
			translates=data.FR;
		}else{
			translates=data.EN;
		}

		$.each(translates,function(i,obj){
			TRANSLATES[obj.key]=obj.label;
			if(obj.key.indexOf("MENU_LNG")>=0){
				var selected="";
				$("#language").append('<option '+selected+' value="'+obj.code+'" >'+obj.label+'</option>');
			}
		});

		$("#language").selectpicker('refresh');

	}).then(function(){
		$.each($("[trad]"),function(){
			$(this).html(TRANSLATES[$(this).attr("trad")]);
		});
		
		//event pour actualiser les valeurs de la liste deroulante de choix des langues dans les paramètres
		$("#fakeTrigger").trigger("change");
		$("#precision").selectpicker("refresh");
		$("#tri").selectpicker("refresh");


		//on charge la dropdown ici car on a besoin des translates
		$.getJSON( "data/menu.json", function( data ) {
			$.each(data.menu,function(index,obj){
				if(window.location.href.indexOf(obj.href)<0)
					$("#menu ul.dropdown-menu").append('<li><a href="'+obj.href+'" trad="'+obj.label+'"></a></li>')
			});
		}).then(function(){
			$.each($("#menu [trad]"),function(){
				$(this).html(TRANSLATES[$(this).attr("trad")]);
			});
		});

		//on set la value selon les paramètres existants
		//on le fait ici car le <select> des langue de l'écran settings.html est pop en meme temps que le chargement du fichier de traduction (si on rajoute une langue --> ajout automatique)
		$("#language").val(localStorage.getItem("LANG")).trigger('change',"NO_RELOAD_LOCATION").selectpicker("refresh");
		
		//mettre la bonne traduction dans le placeHolder page de conversion
		$("#input").attr("placeHolder",$("#placeHolderInput").html());
	});   


});

