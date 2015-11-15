$(document).ready(function() {

  var dom_location = "";

  var fci = ["Bhopal","Betul","Itarsi","Ashok Nagar","Datia","Gwalior","Shopurkalan",
        "Meghnagar","Balaghat","Katangi","Waraseoni","Jabalpur","Katni","Seoni","Shahdol",
        "Harpalpur","Mewari","Satna","Tikamgarh","Bina","Vidisha","Ratlam","Ujjain"];
  
  var header = "<tr><th>#</th><th>State Name</th><th>FCI</th></tr>";
  var data1 = "";

  for (var i = 0; i < fci.length; i++) {
    data1 += '<tr><td>' + (i+1) + '</td>';
    data1 += '<td>' + "Madhya Pradesh" + '</td>';
    data1 += '<td>' + fci[i] + '</td></tr>';
  };
  $("#fci-table-data").html(header+data1);


  dom_location = "";
  var c = 1
  for (var key in data) {
    dom_location += '<option value="'+ key +'"> '+  key + '</option>';
    c = c+1;
  }
  $(".district-data").append(dom_location);
   $(".number_of_district").html(''+(c-1)+'');


  $('.data').css( "height",($(window).height()) + "px");
  

  
  $(".regioanl-market-all").click(function() {

      var header = "<tr><th>#</th><th>District Name</th><th>Regioanl Market</th></tr>";
      var data = "";
      var counter = 1;

       for (var key in window.data) {
          for (var i = 0; i < window.data[key]['regional_maket'].length; i++) {
            data += '<tr><td>' + (counter) + '-' + (i+1) + '</td>';
            data += '<td>' + key + '</td>';
            data += '<td>' + window.data[key]['regional_maket'][i]+ '</td></tr>';
          }
          counter++;
      }
      $('#district-table-data').html(header+data);
      //mark the location completed
      return false;
  });

  $(".regioanl-market").click(function() {

      var header = "<tr><th>#</th><th>District Name</th><th>Regioanl Market</th></tr>";
      var data = "";
      var selected_location = $('.district-data').val();
      

      if(window.data[selected_location]) {
        for (var i = 0; i < window.data[selected_location]['regional_maket'].length; i++) {
          data += '<tr><td>' + (i+1) + '</td>';
          data += '<td>' + selected_location + '</td>';
          data += '<td>' + window.data[selected_location]['regional_maket'][i]+ '</td></tr>';
        }
      }
      $('#district-table-data').html(header+data);
      //mark the location completed
      return false;
  });

  $(".population").click(function() {

      var header = "<tr><th>#</th><th>District Name</th><th>Population</th><th>Area(km²)</th><th>Cultivator</th></tr>";
      var data = "";
      
      var counter = 1;
       for(key in window.data) {
          console.log(key);
          data += '<tr><td>' + counter++ + '</td>';
          data += '<td>' + key + '</td>';
          data += '<td>' + window.data[key]['population'] + '</td>';
          data += '<td>' + window.data[key]['area'] + '</td>';
          if(window.data[key]['cultivator']) {
            data += '<td>' + window.data[key]['cultivator']+ '</td></tr>';
          }else {
             data += '<td>' + "" + '</td></tr>';
          }
      }

     
      $('#district-table-data1').html(header+data);
      //mark the location completed
      return false;
  });


  var map;
  var geocoder;
  var bounds = new google.maps.LatLngBounds();
  var markersArray = [];


  window.cache = {};
  window.cache.table = {};

  var location = ["Badnawar","Bagdi","bakaner","Bidwal","Dhamnoda","Dhar","Dharampuri","Gandhwani","Kesur","Manawar","Nagda","Rajgarh"];

  //add location to option field
  
  dom_location = "";
  for (var i = 0; i < location.length; i++) {
    dom_location += '<option value="'+ location[i] +'"> '+ location[i] + '</option>';
  };
  $(".location-data").append(dom_location);


  $('body').on('click', 'span.spacer', function() {
      $('.label').removeClass('label-danger');
      $(this).addClass('label-danger');
      var selected_location = $(this).text();
      $('#table-data').html(window.cache.table[selected_location.toLowerCase()]);
      return false;
  });

  //distance button event listner
  $(".calculate_distance").click(function() {
      var selected_location = $( ".location-data" ).val();
      var par_origin = [];
      par_origin.push(selected_location + ",MP,India")
      var par_destination = [];
      for (var i = 0; i < location.length; i++) {
        par_destination.push(location[i] + ",MP,India");
      };
      if(!window.cache.table[selected_location.toLowerCase()]) {
        console.log("not Cached");
        calculateDistances(par_origin, par_destination);
          $('.label').removeClass('label-danger');
        $("#completed_tag").append('<span class="label label-danger label-primary btn spacer">' + selected_location + '</span>');
      }
      //mark the location completed
      return false;
  });

var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';

function initialize() {
  var opts = {
    center: new google.maps.LatLng(23.25, 77.41),
    zoom: 6
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), opts);
  geocoder = new google.maps.Geocoder();
}

function calculateDistances(par_origin, par_destination) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: par_origin,
      destinations: par_destination,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) {
  var counter = 1;
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {

    
    var header = "<tr><th>#</th><th>Source</th><th>Destination</th><th>Distance</th></tr>";
    var data = "";

    
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    
    var ori;
    deleteOverlays();

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;

      addMarker(origins[i], false);
      for (var j = 0; j < results.length; j++) {
        addMarker(destinations[j], true);
        var temp_data = ""
        ori = origins[i];
        temp_data += "<tr><td>" + (j+1) + "</td>";
        temp_data += "<td>" + origins[i] + "</td>";
        temp_data += "<td>" + destinations[j] + "</td>";
        temp_data += "<td>" + results[j].distance.text + "</td></tr>";
        data += temp_data;
      }
    }
    $('#table-data').html(header+data);
    //add in cache
    window.cache.table[ori.split(",")[0].toLowerCase()] = header+data;
  }
}

function addMarker(location, isDestination) {
  var icon;
  if (isDestination) {
    icon = destinationIcon;
  } else {
    icon = originIcon;
  }
  geocoder.geocode({'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      bounds.extend(results[0].geometry.location);
      map.fitBounds(bounds);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: '
        + status);
    }
  });
}

function deleteOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

  //google.maps.event.addDomListener(window, 'load', initialize);


  

  $(window).resize(function() {
    google.maps.event.trigger(map, "resize");
  });
  $('#map-canvas').css( "height",($(window).height()) + "px");
  initialize();
  
});

