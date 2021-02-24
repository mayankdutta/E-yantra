/////////////Ajax Requests////////////
$(document).ready(function () {
    // Fetch the initial Map
    refreshMap();

    // Fetch every 5 second
    setInterval(refreshMap, 5000);
});

$("#map").width($(window).width() / 2);
// map.invalidateSize();

function refreshMap() {
    var container = L.DomUtil.get('map');

    if (container != null) {
        container._leaflet_id = null;
    }

    var map = L.map('map').setView([20.5937, 78.9629], 4);
    var jsonDataObject = [];

    $.getJSON('https://spreadsheets.google.com/feeds/list/1U_OSiJJUvwhN7Lw775azxeNfwE_IhuSfvQM4lzHJt54/5/public/full?alt=json', function (data) {
        for (var i = 0; i < data.feed.entry.length; ++i) {

            var json_data = {
                "City": data.feed.entry[i].gsx$city.$t,
                "OderID": data.feed.entry[i].gsx$orderid.$t,
                "Item": data.feed.entry[i].gsx$item.$t,
                "Latitude": parseFloat(data.feed.entry[i].gsx$latitude.$t),
                "Longitude": parseFloat(data.feed.entry[i].gsx$longitude.$t),
                "DispatchStatus": data.feed.entry[i].gsx$dispatchstatus.$t,
                "ShippedStatus": data.feed.entry[i].gsx$shippedstatus.$t
            };
            jsonDataObject.push(json_data);

            for (var j = 0; j < jsonDataObject.length; j++) {
                var marker = L.marker(L.latLng(parseFloat(jsonDataObject[j].Latitude), parseFloat(jsonDataObject[j].Longitude)));
                var oIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });


                if (jsonDataObject[j].DispatchStatus == "YES") {
                    var oIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                }

                if (jsonDataObject[j].ShippedStatus == "YES") {
                    var oIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                }

                // L.marker([51.5, -0.09], {icon: oIcon}).addTo(map);
                marker.setIcon(oIcon);

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
                        .setContent("Order ID: " + marker.myJsonData.OderID + " || Item: " + marker.myJsonData.Item +
                            " || DispatchStatus :" + marker.myJsonData.DispatchStatus)
                        .openOn(map);
                }

                // var customColor = "blue";


                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);


            }
        }
    });
}

$(document).ready(function () {
    // Fetch the initial table
    refreshTable();

    // Fetch every 1 second
    setInterval(refreshTable, 1000);
});

function refreshTable() {

    // var trHTML = '';     

    $.getJSON('https://spreadsheets.google.com/feeds/list/1U_OSiJJUvwhN7Lw775azxeNfwE_IhuSfvQM4lzHJt54/5/public/full?alt=json', function (data) {

        var trHTML = '';

        for (var i = 0; i < data.feed.entry.length; ++i) {
            var myData_map, myData_order;

            trHTML += '<tr><td>' + data.feed.entry[i].gsx$orderid.$t +
                '</td><td>' + data.feed.entry[i].gsx$city.$t +
                '</td><td>' + data.feed.entry[i].gsx$item.$t +
                '</td><td>' + data.feed.entry[i].gsx$cost.$t +
                '</td><td>' + data.feed.entry[i].gsx$orderdateandtime.$t +
                '</td><td>' + data.feed.entry[i].gsx$dispatchstatus.$t +
                '</td><td>' + data.feed.entry[i].gsx$dispatchdateandtime.$t +
                '</td><td>' + data.feed.entry[i].gsx$shippedstatus.$t +
                '</td><td>' + data.feed.entry[i].gsx$shippeddateandtime.$t +
                '</td></tr>';

        }

        console.log(trHTML);
        $('#tableContent').html(trHTML);
        var trHTML = '';

    });
}

$(document).ready(function () {
    // Fetch the initial Chart
    refreshChart();
    // Fetch every 5 second
    setInterval(refreshChart, 5000);
});
google.charts.load("current", {
    packages: ['corechart']
});
google.charts.setOnLoadCallback(refreshChart);

function refreshChart() {
    var jsonDataObject = [];
    var graph_arr = [
        ['Order ID', 'Time Taken', {
            role: 'style'
        }]
    ];
    var bar_color = [];
    $.getJSON('https://spreadsheets.google.com/feeds/list/1U_OSiJJUvwhN7Lw775azxeNfwE_IhuSfvQM4lzHJt54/5/public/full?alt=json', function (data) {
        for (var i = 0; i < data.feed.entry.length; ++i) {
            var json_data = {
                "OderID": data.feed.entry[i].gsx$orderid.$t,
                "TimeTaken": parseFloat(data.feed.entry[i].gsx$timetakenins.$t),
                "Priority": data.feed.entry[i].gsx$priority.$t
            };
            jsonDataObject.push(json_data);
        };
        // Setting color for the coloumns of graph according to priority of items
        for (var j in jsonDataObject) {
            if (jsonDataObject[j].Priority == 'HP') {
                var color = '#FF0000';
            } else if (jsonDataObject[j].Priority == 'MP') {
                var color = '#FFFF00';
            } else if (jsonDataObject[j].Priority == 'LP') {
                var color = '#00FF00';
            }
            bar_color.push(color)
        }

        // Converting Json Object to JavaScript Array
        for (var j in jsonDataObject) {
            graph_arr.push([jsonDataObject[j].OderID, jsonDataObject[j].TimeTaken, bar_color[j]]);
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
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('column_chart'));
        chart.draw(data, options);
    });
}
