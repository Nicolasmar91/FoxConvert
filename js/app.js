$(document).ready(function(){
var categories = [];
var units = [];
var constants = [];
var constantsCategories = [];

//[début]chargement du contenu des fichier .json du dossier "data" dans les variables globales
$.getJSON( "data/categories.json", function( data ) {
	$.each(data.categories,function(index,obj){
		categories.push(obj);
	});
});
$.getJSON( "data/units.json", function( data ) {
	$.each(data.units,function(index,obj){
		units.push(obj);
	});
});
$.getJSON( "data/constants.json", function( data ) {
	$.each(data.constants,function(index,obj){
		constants.push(obj);
	});
});
$.getJSON( "data/constantsCategories.json", function( data ) {
	$.each(data.constantsCategories,function(index,obj){
		constantsCategories.push(obj);
	});
});
//[fin] chargement




});