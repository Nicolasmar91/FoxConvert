$(document).ready(function(){
var categories = [];
var units = [];
var constants = [];
var constantsCategories = [];

//[start]chargement du contenu des fichier .json du dossier "data" dans les variables globales
$.getJSON( "data/categories.json", function( data ) {
	$.each(data.categories,function(index,obj){
		categories.push(obj);
	});
}).then(function(dateReturn,text,status){	
	$.getJSON( "data/units.json", function( data ) {
		$.each(data.units,function(index,obj){
			units.push(obj);
		});
	}).then(function(dateReturn,text,status){
		$.getJSON( "data/constants.json", function( data ) {
			$.each(data.constants,function(index,obj){
				constants.push(obj);
			});
		}).then(function(dateReturn,text,status){
			$.getJSON( "data/constantsCategories.json", function( data ) {
				$.each(data.constantsCategories,function(index,obj){
					constantsCategories.push(obj);
				});
			}).then(function(dateReturn,text,status){
				categories.sort(function (a, b) {
                                    var leftKey = a.name.toUpperCase();
                                    var rightKey = b.name.toUpperCase();

                                    if (leftKey.charAt(0) == rightKey.charAt(0)) {
                                        if (leftKey.charAt(1) < rightKey.charAt(1)) { return -1; }
                                        else { return 1; }
                                    }

                                    if (leftKey.charAt(0) < rightKey.charAt(0)) { return -1; }
                                    else { return 1; }
                                });
				var letter="";
				var idAnchor="";
				$.each(categories,function(i,obj){
					console.log(letter+" - "+obj.name.substr(0,1).toUpperCase())
					if(letter!=obj.name.substr(0,1).toUpperCase()){
						letter=obj.name.substr(0,1).toUpperCase();
						idAnchor="id=\"anchor_"+letter+"\"";
						$("a[href=\"#anchor_"+letter+"\"]").removeClass("disabled");
						$("a[href=\"#anchor_"+letter+"\"]").click(function(e){
							e.preventDefault();
							window.location = $(this).attr('href');
							$(window).scrollTop($(window).scrollTop()-$("header").height());
						});
					}else{
						idAnchor="";
					}
					$("#liste").append("<a "+idAnchor+" href=\"#"+obj.name.substr(0,1)+"\" class=\"list-group-item\">"+obj.name+"</a>");
				});
			});
		});
	});
});
//[end] chargement


//[start] move of scroll bar
var initialPos = $("nav[data-type=\"scrollbar\"]").position().top;
$(window).scroll(function() {
	if($(window).scrollTop()<=$("#sousTitre").outerHeight(true)){
		$("nav[data-type=\"scrollbar\"]").css({ top: (initialPos-$(window).scrollTop()) });
	}else{
		$("nav[data-type=\"scrollbar\"]").css({ top: ($("header").height())});
	}	
});
//[end]



});