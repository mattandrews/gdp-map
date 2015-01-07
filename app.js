require(['bower_components/reqwest/reqwest'], function(reqwest) {

    var map,
        currentInfoWindow;

    var initializeMap = function() {
        var mapOptions = {
            center: {
                lat: 51.5072,
                lng: 0.1275
            },
            zoom: 3,
            scrollwheel: false
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        fetchJSON();
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
                content: '<div class="map-marker"><h4>' + country.name + '</h4><h5>$' + formatPrice(country.gdp) + "</h5></div>"
            });

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
                map: map,
                title: country.name
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
                currentInfoWindow = infowindow;
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                google.maps.event.trigger(this, 'click');
            });

        })
    };

    var formatPrice = function (num) {
        return Number(num.toFixed(1)).toLocaleString()
    }

    var buildTable = function (json) {
        var tableBody = document.querySelector('#js-table tbody');
        var html = '';
        json.forEach(function(country) {
            html += '<tr><td>' + country.rank + '</td><td>' + country.name + '</td><td>$' + formatPrice(country.gdp) + '</td></tr>';
        });
        tableBody.innerHTML = html;
        document.getElementById('js-table').classList.remove('is-hidden');
    }

    initializeMap();
});
