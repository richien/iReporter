
function mapView(location, mapid) {
    let lat = location.split(",")[0].trim().slice(2);
    let lng = location.split(",")[1].trim();

    let coordinates =  {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    }

    let geocoder = new google.maps.Geocoder();
    //mapboxgl.access_token = 'pk.eyJ1IjoiZ2VvZmZ3aWxsaXMiLCJhIjoiY2pzODhsYjhrMTUxMzQ0bnU1dWJsNzhzdiJ9.6P-brlq0kRkDMevJQor4QQ';
    let latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    //let latLng = new google.maps.LatLng(0.31710034093916306, 32.594857999924216);
    //let lnglat = [32.594857999924216,0.31710034093916306]; // Kibuli, Kampala, Uganda
    
    let map = new google.maps.Map(document.getElementById(`googleMap-${mapid}`), {
        center: latLng,
        zoom: 18
    });
    // let map = new mapboxgl.Map ({
    //     container: 'mapboxMap',
    //     center: lnglat,
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     zoom: 11
    // });
    let marker = new google.maps.Marker ({
        position: latLng,
        title: 'It happen here.',
        map: map,
        draggable: false
    });
    
    // let marker = new mapboxgl.Marker()
    //     .setLngLat([32.594857999924216, 0.31710034093916306])
    //     .addTo(map);

    // let geocoder = new MapboxGeocoder({
    //     accessToken: 'pk.eyJ1IjoiZ2VvZmZ3aWxsaXMiLCJhIjoiY2pzOGd3ZHExMTdjbzQ0bzVqdmEyNGhyNCJ9.W7-VDuBTuVX9BtZ4LI-VBw'
    // })
    // map.addControl(geocoder);

    // map.on('load', function() {
    //     map.addSource('single-point', {
    //         type: 'geojson',
    //         data: {
    //             type: 'FeatureCollection',
    //             features: []
    //         }
    //     });
    //     map.addLayer({
    //         id: 'point',
    //         source: 'single-point',
    //         type: 'circle',
    //         paint: {
    //             'circle-radius': 10,
    //             'circle-color': '#447FF5'
    //         }
    //     });
    //     geocoder.on('result', function(e) {
    //         map.getSource('single-point').setData(e.result.geometry);
    //         updateMarkerAddress(e.latlng);
    //     });
    // });
    
}



// function position(pos) {
//     geocoder.geocode({
//         latLng: pos
//     }, (responses) => {
//         if (responses && responses.length > 0) {
//             updateMarkerAddress(responses[0].formatted_addr);
//         }
//         else {
//             updateMarkerAddress('Cannot determine address at this location.');
//         }
//     });
// }

// function updateMarkerPosition(latLng) {
//     document.getElementById('lat-lng').innerHTML = [
//         "Latitude: " + latLng.lat(),
//         "Longitude: " + latLng.lng()
//     ].join(', ');
// }

// function updateMarkerAddress(str) {
//     document.getElementById('address').innerHTML = str;
// }


// google.maps.event.addListener(marker, 'dragstart', () => {
//     updateMarkerAddress('Dragging...');
// });
// google.maps.event.addListener(marker, 'drag', () => {
//     updateMarkerPosition(marker.getPosition());
//     coordinates.lat = latLng.lat();
//     coordinates.lng = latLng.lng();
//     position(latLng); 
// });
// google.maps.event.addListener(marker, 'dragend', () => {
//     position(marker.getPosition());
// });
