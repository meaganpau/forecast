// //Get browser coordinates
// //Feed coordinates to weather app
// //Weather app to provide city
// //Grab weather for city
// //Put weather, city and icon on page
$(function (){

$('.loading').fadeIn(1000);
var tempF;
var tempC;
var weather;
var location;
var icon;
var latitude;
var longitude;
var source   = $("#template").html();
var template = Handlebars.compile(source);
var options = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;
  latitude = crd.latitude;
  longitude = crd.longitude;
  getLocation(latitude, longitude);
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function getWeather(lat, long) {
	$.ajax({
		url: `https://api.darksky.net/forecast/ee32e1590b35e8ca6ea75f87824bfc4c/${lat},${long}?units=si`,
		method: 'GET',
		dataType: 'JSONP'
	})
	.then (function (forecast){
		tempC = `${Math.round(forecast.currently.temperature)}°C`;
		weather = forecast.currently.summary;
		icon = forecast.currently.icon;
		displayWeather();
	})
};

function getLocation(lat, long) {
	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true',
		method: 'GET',
		dataType: 'json'
	})
	.then((resp) => {
		getWeather(latitude, longitude);
	    var addressComponents = resp.results[0].address_components;
	    for(i=0;i<addressComponents.length;i++){
	    	var types = addressComponents[i].types;
	        if(types=="locality,political"){
	            var city = addressComponents[i].long_name ? addressComponents[i].long_name : null; ; // this should be your city, depending on where you are
	            if (city) {
	           		location = city;
	          		break;
	            }
	        }
	    }
	});
}

function displayWeather() {
	var context = {weather, tempC, icon, location};
	var html    = template(context);
    $('.loading').fadeOut(1000);
	$(html).hide().appendTo('#weather').delay(1000).fadeIn(1000);
    var skycons = new Skycons({"color": "black", "resizeClear": true});
    skycons.add('icon', icon);
    skycons.play();
	$('canvas').delay(1000).fadeIn(1000);
}

/// application begin
navigator.geolocation.getCurrentPosition(success, error, options);

}); //End of document ready
