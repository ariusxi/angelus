var json, cont;
var jsonObjArray = [];
jsonObjArray.push(json);

var map;
var idInfoBoxAberto;
var infowindow="";
var infoBox = [];
var markers = [];
var oldMarkers = [];
var trajetoCoordenadas = [];
var data = [];
var map, pointarray, heatmap;
var user = '';
var geocoder;
var boxAberto=false;
var tempo = null;
var dist = 0;
var n_events = 0;

function hidemessage(div){
	setTimeout(function(){
		$(div).find('div').fadeOut();
	},3000);
}

function initialize(json, cont){
	lat=-23.57790671;
	lon=-46.72408238;
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(lat, lon);
	
	var options = {
		zoom: 12,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	
	map = new google.maps.Map(document.getElementById("mapa"), options);
	
	$.ajax({
		method: 'GET',
		url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+json.lat+','+json.lon+'',
		dataType: 'json',
		success: function(retorno){
			var address = retorno['results'][0]['formatted_address'];
			$("#address").text(address);
		}
	});
	
	carregarPontos(json,cont);
}

function defineInfobox(latlng, marker){
	html = "<center>"+
		   "<div class='imgSmall'><img src='img/default.jpg' class='imgSmall'/></div></center>"+
		   "<table>"+
				"<tr><td>Evento: </td><td>"+marker.tipo_evento+"</td></tr>"+
				"<tr><td>Latitude: </td><td>"+marker.lat+"</td></tr>"+
				"<tr><td>Longitude: </td><td>"+marker.lon+"</td></tr>"+
				"<tr><td>Data: </td><td>"+marker.data+"</td></tr>"+
				"<tr><td>Usuário: </td><td>"+marker.fullname+"</td></tr>"+
		   "</table>";
	
	infowindow = new google.maps.InfoWindow({
		content: html
	});
}

function carregarPontos(json, cont){
	var id = 'Ocorrencia';
	var lat = json.lat;
	var lon = json.lon;
	
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lon),
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		id: id,
		lat: lat,
		lon: lon
	});
	
	markers.push(marker);
	map.setCenter(new google.maps.LatLng(lat, lon));
	defineInfobox(marker.getPosition(),marker);
}