$(document).ready(function(){

	//------- DECLARATION DE VARIABLE ET FONCTIONS -------
	var initialH1Size = 2.5 * 10; //2.5 rem - 1 rem = 10px
	var categories = [];
	var units = [];
	var constants = [];
	var constantsCategories = [];
	var listLetter = [];
	//var listDisplayLetter = [];
	var decalageHeader = $('nav[data-type="scrollbar"]').position().top;
	var hauteurBloc=$('a[href="#anchor_A"]').parent().height();
	var initialPos = $("nav[data-type=\"scrollbar\"]").position().top;
	var screenIsScrolled = false; //sert a savoir s'il faut recalculer les position des "lettres"

	var currentCtg = 0;

	function calcLetterPos(){
		$.each($('a[href^="#anchor_"]'),function(){
			listLetter.push({letter : $(this).html(), 
							 top:$(this).position().top,
							 a:$(this)});
		});
	}

	function loadUnits(id){
		var selected="";
		$("#unitsIn, #unitsOut").html("");
		$.each(units,function(key,data){
			selected="";
			if(data.category==id){
				if(data.coef==1)
					selected="selected";
				$("#unitsIn, #unitsOut").append('<option '+selected+' value="'+data.coef+'" symbol="'+data.symbol+'" idUnit="'+data.id+'" data-subtext="'+data.symbol+'">'+data.name+'</option>');
			}
		});
		$("#unitsIn, #unitsOut").selectpicker("refresh");
	}
	//----------------------------------------------------


	//--------------- CODE PAGE D'ACCUEIL ----------------
	calcLetterPos();
	//[start]chargement du contenu des fichier .json du dossier "data" dans les variables globales
	$.getJSON( "data/categories.json", function( data ) {
		$.each(data.categories,function(index,obj){
			categories.push(obj);
		});
	}).then(function(dataReturn,text,status){	
		$.getJSON( "data/units.json", function( data ) {
			$.each(data.units,function(index,obj){
				units.push(obj);
			});
		}).then(function(dataReturn,text,status){
			$.getJSON( "data/constants.json", function( data ) {
				$.each(data.constants,function(index,obj){
					constants.push(obj);
				});
			}).then(function(dataReturn,text,status){
				$.getJSON( "data/constantsCategories.json", function( data ) {
					$.each(data.constantsCategories,function(index,obj){
						constantsCategories.push(obj);
					});
				}).then(function(dataReturn,text,status){
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
					units.sort(function (a, b) {
									//trier selon les preference settings, coef ou name
	                                    if (a.coef < b.coef) { return -1; }
	                                    else { return 1; }
	                                });
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
					constantsCategories.sort(function (a, b) {
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
						if(letter!=obj.name.substr(0,1).toUpperCase()){
							letter=obj.name.substr(0,1).toUpperCase();
							idAnchor='id="anchor_'+letter+'"';

							//liste des lettre du scroll
							$('a[href="#anchor_'+letter+'"]').removeClass("disabled");
							/*
							listDisplayLetter.push({letter : letter, 
													top:$('a[href="#anchor_'+letter+'"]').parent().position().top,
													a:$('a[href="#anchor_'+letter+'"]')});
							*/

							//rendre la letre cliquable avec une ancre prenant en compte la taille du header
							$('a[href="#anchor_'+letter+'"]').click(function(e){
								e.preventDefault();
								window.location = $(this).attr('href');
								$(window).scrollTop($(window).scrollTop()-$("header").height());
							});
						}else{
							idAnchor="";
						}

						//ajout de la catégorie
						$("#liste").append("<a "+idAnchor+"  category=\""+obj.id+"\"  class=\"list-group-item\">"+obj.name+"</a>");
					});
					$('[data-toggle="popover"]').popover({trigger: 'manual'}); 

					//evenement permetant de passé dans la catégorie selectionnée
					$('#liste a').click(function(){
						currentCtg = $(this).attr("category");
						loadUnits(currentCtg);
						$("#secondaryTitle").html($(this).html());
						$("#navBack").show();
						$("#navHeader").addClass("navHover bgDark");
						$("#content").fadeOut(100,function(){
							$("#secondaryTitle").fadeIn(50);
							$("#conversion").show();	
						});
						$("#mainTitle").hide();
						$("#titleArea").addClass("sep");
						$("#secondaryTitle").html($(this).html());
						$("#secondaryTitle").fadeIn(50);
						var i=1;
						while(/*$("#secondaryTitle").outerHeight()>=$("#titleArea").innerHeight() &&*/ $("#secondaryTitle").outerWidth()>=$("#titleArea").innerWidth()-16){
							$("#secondaryTitle").css('font-size', initialH1Size - i);
							i++;
						}
					});
				});
			});
		});
	});
	//[end] chargement


	 $('a[href^="#anchor_"]').bind('touchstart', function(e) {
		$("#content").css({overflow:"hidden"});
	});
	$('a[href^="#anchor_"]').bind('touchend', function(e) {
		$("#content").css({overflow:"auto"});
		$('a[href^="#anchor_"]').popover("hide");
	});

	//on ajoute l'evenement touchmove pour les appareils mobiles
	$('a[href^="#anchor_"]').bind('touchmove', function(e) {
	    var pointY = e.originalEvent.touches[0].clientY;
	    //on parcourt les lettre et on click() celle ou se trouve le "doigt"
	    $.each(listLetter,function(i,obj){
	    	if(pointY > obj.top + decalageHeader && pointY < (obj.top + hauteurBloc + decalageHeader)){
	    		obj.a.click();
	    		obj.a.popover("show");
	    	}else{
	    		obj.a.popover("hide");
	    	}
	    });
	});

	//ce code modifie l'affichage de la popover de base, pour eviter qu'elle soit "actualiser" lors d'un scroll 
	//sur la meme lettre, declanchant l'evenement touchemove
	$('a[href^="#anchor_"]').on('show.bs.popover', function (e) {
		if($(e.currentTarget).attr("aria-describedby"))
			e.preventDefault();
	})
	//---------------------------------------------



	//---------------- conversion -----------------
	$("#navHeader").click(function(){
		$("#content").fadeIn(150);
		$("#mainTitle").show();
		$("#titleArea").removeClass("sep");
		$("#secondaryTitle").hide();
		$("#mainTitle").fadeIn(50);
		$("#conversion").hide();
		$("#navBack").hide();
		$("#navHeader").removeClass("navHover bgDark");

		//on replace la fenetre en haut
		$("#content").scrollTop(0);
	});

	$("#input").numeric();

	$("#input").keyup(function(){
		if($.isNumeric($(this).val())){
	        var nmb = new Number(($(this).val() * $("#unitsIn").val()) / $("#unitsOut").val());

	        if (nmb > 100000 || nmb < 0.00001) {
	            $("#output").html(nmb.toExponential());
	        } else {
	            $("#output").html(nmb);
	        }
	    	$("#resultat span.minimize").html($("button[data-id=unitsOut] .text-muted").html());
		}  
	});

	$("#unitsOut, #unitsIn").change(function(){
		if($.isNumeric($("#input").val())){
	        var nmb = new Number(($("#input").val() * $("#unitsIn").val()) / $("#unitsOut").val());

	        if (nmb > 100000 || nmb < 0.00001) {
	            $("#output").html(nmb.toExponential());
	        } else {
	            $("#output").html(nmb);
	        }
	        $("#unitsOut").selectpicker("render");
	    	$("#resultat span.minimize").html($("button[data-id=unitsOut] .text-muted").html());
		}  
	});
});