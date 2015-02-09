$(document).ready(function(){

	//------- DECLARATION DE VARIABLE ET FONCTIONS -------
	var initialH1Size = 2.5 * 10; //2.5 rem - 1 rem = 10px
	var initialOutputSize = 7 * 10; //7rem
	var initialMinimizeSize = 3 * 10; //7rem
	var categories = [];
	var units = [];
	var constants = [];
	var constantsCategories = [];
	var listLetter = [];
	var echelleNeg = {"EXACTE":0.00000000000000000000000001, 0:1, 1:0.1, 2:0.01, 3:0.001, 4:0.0001, 5:0.00001 ,6:0.000001 ,7:0.0000001 ,8:0.00000001 ,9:0.00000001};
	var echellePos = {"EXACTE":1000000000000000000000000000, 0:1, 1:10, 2:100, 3:1000, 4:10000, 5:100000 ,6:10000000 ,7:100000000 ,8:1000000000 ,9:10000000000};
	//var listDisplayLetter = [];
	var distanceToScrollWhenKBisShow=0;
	var decalageHeader = $('nav[data-type="scrollbar"]').position().top;
	var hauteurBloc=$('a[href="#anchor_A"]').parent().height();
	var initialPos = $("nav[data-type=\"scrollbar\"]").position().top;
	var screenIsScrolled = false; //sert a savoir s'il faut recalculer les position des "lettres"
	var isMonnaie=false;
	var currentCtg = 0;

	function calcLetterPos(){
		$.each($('a[href^="#anchor_"]'),function(){
			listLetter.push({letter : $(this).html(), 
							 top:$(this).position().top,
							 a:$(this)});
		});
	}

	function loadUnits(id){
		if(id==25)
			isMonnaie=true;
		var selected="";
		$("#unitsIn, #unitsOut").html("");
		$.each(units,function(key,data){
			selected="";
			if(data.category==id){
				//si on est dans la catégorie monnaie
				if(data.category==25&&data.id!=data.ref){
					if(data.coef=='EUR')
						selected="selected";
					$("#unitsIn, #unitsOut").append('<option '+selected+' value="'+localStorage.getItem(data.coef)+'" data-subtext="'+data.symbol+'">'+data.name+'</option>');
				}else{ 
					//si on est dans le cas classique
					if(data.coef==1)
						selected="selected";
					$("#unitsIn, #unitsOut").append('<option '+selected+' value="'+data.coef+'" data-subtext="'+data.symbol+'">'+data.name+'</option>');
				}
			}
		});
		$("#unitsIn, #unitsOut").selectpicker("refresh");
	}

	function majDisplay(){
		 //affichge du resultat
        $("#resultat .minimize").css('font-size', initialMinimizeSize+"px");
        $("#resultat").css('line-height', initialOutputSize+"px");
		$("#output").css('font-size', initialOutputSize+"px");

        //on adapte la taille en fonction du nombre de decimal	
        var i=1;
		while($("#resultat").outerWidth()<=$("#output").innerWidth()){
			$("#output").css('font-size', (initialOutputSize - i)+"px");
     	    $("#resultat").css('line-height', (initialOutputSize - i)+"px");

			if($("#resultat .minimize").css("font-size").substr(0,2)>18){
				$("#resultat .minimize").css('font-size', (initialMinimizeSize - i)+"px");
			}
			i++;
		}

		//$("#resultat").css("margin-right",15+$("#resultat .minimize").width()/2);

        $("#unitsOut").selectpicker("render");
    	$("#resultat span.minimize").html($("button[data-id=unitsOut] .text-muted").html());

	}

	function doCalc(){
		if($.isNumeric($("#input").val())){
			if(isMonnaie){
				//cas monnaie

				//convert to euro
				var nmb = new Number(($("#input").val() * $("#unitsIn").val()) / $("#unitsOut").val());
		        var precision =localStorage.getItem("PRECISION");
		        if(precision > 9 || precision == "EXACTE") precision = 9;
			    $("#output").html(parseFloat($.number(nmb,precision,".","")));

		    	$("#resultat span.minimize").html($("button[data-id=unitsOut] .text-muted").html());
				majDisplay();

			}else{
				//cas classique
		        var nmb = new Number(($("#input").val() * $("#unitsIn").val()) / $("#unitsOut").val());
		        
		        if(localStorage.getItem("PRECISION")=="EXACTE"){
		        	$("#output").html(nmb);
		        }else{
		        	if (localStorage.getItem("EXPONENTIAL")=="true" && (nmb > echellePos[localStorage.getItem("PRECISION")]-1 || nmb < echelleNeg[localStorage.getItem("PRECISION")])) {
		          	    $("#output").html(nmb.toExponential(localStorage.getItem("PRECISION")));
			        } else {
			        	$("#output").html(parseFloat($.number(nmb,localStorage.getItem("PRECISION"),".","")));
			        }
		        }

		    	$("#resultat span.minimize").html($("button[data-id=unitsOut] .text-muted").html());
				majDisplay();
			}

		}

		if($(this).val()==""){
			$("#output").html("");
			$("#resultat span.minimize").html("");
		}  
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
						if(localStorage.getItem('SORT')=="name"){
                            var leftKey = a.name.toUpperCase();
                            var rightKey = b.name.toUpperCase();

                            if (leftKey.charAt(0) == rightKey.charAt(0)) {
                                if (leftKey.charAt(1) < rightKey.charAt(1)) { return -1; }
                                else { return 1; }
                            }

                            if (leftKey.charAt(0) < rightKey.charAt(0)) { return -1; }
                            else { return 1; }
						}else{
                            if (a.coef < b.coef) { return -1; }
                            else { return 1; }									
                        }
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

	//on lance le chargement des taux de change
	//http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html
	if(navigator.onLine){
		var xhr = new XMLHttpRequest({mozSystem: true});
		xhr.open("GET", "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", true);
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

		//on réinitialise les precedent calcul/affichages
		$("#input").val("");
		$("#output").html("");
		$("#resultat .minimize").html("");

		//on replace la fenetre en haut
		$("#content").scrollTop(0);
		isMonnaie=false;
	});

	$("#input").numeric();

	$("#input").keyup(doCalc);

	$("#unitsOut, #unitsIn").change(doCalc);

	//quand le clavier apparait on scroll pour afficher le resultat au dessus du clavier
	$(window).resize(function(){
		if(distanceToScrollWhenKBisShow==0)
			distanceToScrollWhenKBisShow = $("br.beforeValToconvert").offset().top;
		
		$("#conversion").scrollTop(distanceToScrollWhenKBisShow);
	});

	//on cache le span qui sert à stocker la traduction du placeholder
	$("#placeHolderInput").hide();

	//initialisation des parametre de reglage utilisateur
	if(localStorage.length==0){
		//valeur par defaut
		localStorage.setItem("EXPONENTIAL","false");
		localStorage.setItem("PRECISION",6);
		localStorage.setItem("LANG","FR");
		localStorage.setItem("SORT","name");
		localStorage.setItem("LAST_MAJ_DATE","1900-01-01");
	}


	
});