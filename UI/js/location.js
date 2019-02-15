let geocoder = new google.maps.Geocoder();
let latLng = new google.maps.LatLng(0.312436, 32.600864);
let coordinates =  {
    lat: "",
    lng: ""
}
let map = new google.maps.Map(document.getElementById("googleMap"), {
    center: latLng,
    zoom: 12
});
let marker = new google.maps.Marker ({
    position: latLng,
    title: 'Did it happen here?',
    map: map,
    draggable: true
});

function position(pos) {
    geocoder.geocode({
        latLng: pos
    }, (responses) => {
        if (responses && responses.length > 0) {
            updateMarkerAddress(responses[0].formatted_addr);
        }
        else {
            updateMarkerAddress('Cannot determine address at this location.');
        }
    });
}

function updateMarkerPosition(latLng) {
    document.getElementById('lat-lng').innerHTML = [
        latLng.lat(),
        latLng.lng()
    ].join(', ');
}

function updateMarkerAddress(str) {
    document.getElementById('address').innerHTML = str;
}


google.maps.event.addListener(marker, 'dragstart', () => {
    updateMarkerAddress('Dragging...');
});
google.maps.event.addListener(marker, 'drag', () => {
    updateMarkerPosition(marker.getPosition());
    coordinates.lat = latLng.lat();
    coordinates.lng = latLng.lng();
    position(latLng); 
});
google.maps.event.addListener(marker, 'dragend', () => {
    position(marker.getPosition());
});
