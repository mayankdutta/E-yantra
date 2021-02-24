$(document).ready(function () {
  // Fetch the initial table
  refreshMap();
  setInterval(refreshMap, 3000);

  //from utkarsh
  refreshChart();
  setInterval(refreshChart, 5000); // <-- not same as of tus
  //from utkarsh
});
google.charts.load("current", {
  packages: ['corechart']
});
google.charts.setOnLoadCallback(refreshChart);

function refreshChart() {
  var jsonDataObjectChart = [];
  var graph_arr = [
    ['Order ID', 'Time Taken', {
      role: 'style'
    }]
  ];
  var bar_color = [];
  $.getJSON('https://spreadsheets.google.com/feeds/list/1pv_rYRsZArulYwLj78Y_0dxbCbCRvFPu2Iepmjmn5V0/5/public/full?alt=json', function (data) {
    for (var i = 0; i < data.feed.entry.length; ++i) {
      var json_data = {
        "OderID": data.feed.entry[i].gsx$orderid.$t,
        "TimeTaken": parseFloat(data.feed.entry[i].gsx$timetaken.$t),
        "Priority": data.feed.entry[i].gsx$priority.$t
      };
      jsonDataObjectChart.push(json_data);
    };
    // Setting color for the coloumns of graph according to priority of items
    for (let j in jsonDataObjectChart) {
      let color = '#000000';
      if (jsonDataObjectChart[j].Priority === 'HP') {
        color = '#1a85e2';
      } else if (jsonDataObjectChart[j].Priority === 'MP') {
        color = '#e98409';
      } else if (jsonDataObjectChart[j].Priority === 'LP') {
        color = '#b815a2';
      }
      bar_color.push(color)
    }

    // Converting Json Object to JavaScript Array
    // var changed to let
    for (let j in jsonDataObjectChart) {
      graph_arr.push([jsonDataObjectChart[j].OderID, jsonDataObjectChart[j].TimeTaken, bar_color[j]]);
    }
    var graphArray_Final = google.visualization.arrayToDataTable(graph_arr);

    var data = new google.visualization.DataView(graphArray_Final);

    var options = {
      title: 'Time Taken for items to be Shipped',
      hAxis: {
        title: 'Order ID'
      },
      vAxis: {
        title: 'Time Taken (s)'
      },
      legend: {
        position: "none"
      },
      backgroundColor: '#c04458'
    }
    var chart = new google.visualization.ColumnChart(document.getElementById('column_chart'));
    chart.draw(data, options);
  });
}

function refreshMap() {

  var container = L.DomUtil.get('map');

  if (container != null) {
    container._leaflet_id = null;
  }

  var map = L.map('map').setView([20.5937, 78.9629], 4);
  var jsonDataObject = [];

  $.getJSON('https://spreadsheets.google.com/feeds/list/1pv_rYRsZArulYwLj78Y_0dxbCbCRvFPu2Iepmjmn5V0/5/public/full?alt=json', function (data) {

    var trHTML = '';
    for (var i = 0; i < data.feed.entry.length; ++i) {
      var myData_map, myData_order;

      trHTML +=
        '<tr><td>' + data.feed.entry[i].gsx$teamid.$t + // adding th scope = "row" 1 here !!
        '</td><td>' + data.feed.entry[i].gsx$uniqueid.$t +
        '</td><td>' + data.feed.entry[i].gsx$orderid.$t +
        '</td><td>' + data.feed.entry[i].gsx$item.$t +
        '</td><td>' + data.feed.entry[i].gsx$priority.$t +
        '</td><td>' + data.feed.entry[i].gsx$orderquantity.$t +
        '</td><td>' + data.feed.entry[i].gsx$city.$t +
        '</td><td>' + data.feed.entry[i].gsx$longitude.$t +
        '</td><td>' + data.feed.entry[i].gsx$latitude.$t +
        '</td><td>' + data.feed.entry[i].gsx$orderdispatched.$t +
        '</td><td>' + data.feed.entry[i].gsx$ordershipped.$t +
        '</td><td>' + data.feed.entry[i].gsx$orderdateandtime.$t +
        '</td><td>' + data.feed.entry[i].gsx$dispatchtime.$t +
        '</td><td>' + data.feed.entry[i].gsx$shippingtime.$t +
        '</td><td>' + data.feed.entry[i].gsx$timetaken.$t +
        '</td></tr>';

      var json_data = {
        "City": data.feed.entry[i].gsx$city.$t,
        "OderID": data.feed.entry[i].gsx$orderid.$t,
        "Item": data.feed.entry[i].gsx$item.$t,
        "Latitude": parseFloat(data.feed.entry[i].gsx$latitude.$t),
        "Longitude": parseFloat(data.feed.entry[i].gsx$longitude.$t)
      };
      jsonDataObject.push(json_data);

      for (var j = 0; j < jsonDataObject.length; j++) {
        var marker = L.marker(L.latLng(parseFloat(jsonDataObject[j].Latitude), parseFloat(jsonDataObject[j].Longitude)));
        marker.bindPopup(jsonDataObject[j].City, {
          autoClose: false
        });
        map.addLayer(marker);
        marker.on('click', onClick_Marker)
        // Attach the corresponding JSON data to your marker:
        marker.myJsonData = jsonDataObject[j];

        function onClick_Marker(e) {
          var marker = e.target;
          popup = L.popup()
            .setLatLng(marker.getLatLng())
            .setContent("Order ID: " + marker.myJsonData.OderID + " || Item: " + marker.myJsonData.Item)
            .openOn(map);
        }

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
      }
      $('#tableContent').html(trHTML);
    }
  });
}