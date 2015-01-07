require(['bower_components/reqwest/reqwest'], function(reqwest) {

    var map,
        currentInfoWindow;

    var initializeMap = function() {
        var mapOptions = {
            center: {
                lat: 51.5072,
                lng: 0.1275
            },
            zoom: 3
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };

    var fetchJSON = function() {
        reqwest({
            url: './GDP.json',
            type: 'json',
            method: 'get',
            error: function(err) {
                alert(err);
            },
            success: function(resp) {
                setupMarkers(resp);
                buildTable(resp);
            }
        })
    };

    var setupMarkers = function(json) {
        json.forEach(function(country) {

            var infowindow = new google.maps.InfoWindow({
                content: '<div class="map-marker"><h4>' + country.name + '</h4><h5>$' + country.gdp + "</h5></div>"
            });

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
                map: map,
                title: country.name
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                currentInfoWindow = infowindow;
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
                google.maps.event.trigger(this, 'click');
            });

        })
    };

    var buildTable = function (json) {
        var tableBody = document.querySelector('#js-table tbody');
        var html = '';
        json.forEach(function(country) {
            html += '<tr><td>' + country.name + '</td><td>$' + country.gdp + '</td></tr>';
        });
        tableBody.innerHTML = html;
        document.getElementById('js-table').classList.remove('is-hidden');
    }

    initializeMap();
    fetchJSON();
})
