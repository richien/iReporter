
function displayText(color, text) {
    let message = document.getElementById("flash-message");
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function editLocation(id, title, type, location) {
  let  locationForm = `
<div class="row">
    <div class="col-12 col-s-12">
        <h1>Update location</h1>
        <div id="flash-message"></div>
        <form action="#" id="update-location-form">
            <div class="form-wrapper">      
                <div id="map-canvas">
                    <h3 class="header-text">Title</h3>
                    <p id="title-text">${title}</p>
                    <input id="incident-id" type="hidden" value="${id}">
                    <h3 class="header-text">Where did this incident occur?</h3>
                    <p class="hint">[Drag the marker to the location on the map below.]</p>
                    <h3 class="header-text">Current position</h3>
                    <div class="hint" id="lat-lng"></div>
                        <h3 class="header-text"> Closest matching address </h3>
                    <div class="hint" id="address"></div>
                    <div id="googleMap" style="width:100%;height:400px;"></div>
                    <div class="row">
                        <div class="col-12 col-s-12">
                            <!-- <div id="mapboxMap" style="width:100%;height:400px;"></div> -->
                        </div>
                    </div>
                </div>
                <p><input class="btn-coral" id="update-btn" type="submit" value="EDIT" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="cancel-btn" href="profile.html">Cancel</a></p>
                    </div>
        </form>
    </div>
</div>
    `;
    document.getElementById("main").innerHTML = locationForm;
    document.getElementById(`update-btn`).addEventListener('click', doEditLocation.bind(this, id, type));
    displayMap(location);
}

function displayMap(str) {
    let geocoder = new google.maps.Geocoder();
    let coordinates =  coordsFromString(str);
    let latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    let map = new google.maps.Map(document.getElementById("googleMap"), {
        center: latLng,
        zoom: 15
    });
    let marker = new google.maps.Marker ({
        position: latLng,
        title: 'Did it happen here?',
        map: map,
        draggable: true
    });

    google.maps.event.addListener(marker, 'dragstart', () => {
        updateMarkerAddress('Dragging...');
    });
    google.maps.event.addListener(marker, 'drag', () => {
        updateMarkerPosition(marker.getPosition(), geocoder);
        position(latLng, geocoder); 
    });
    google.maps.event.addListener(marker, 'dragend', () => {
        position(marker.getPosition(), geocoder);
    });
}

function position(pos, geocoder) {
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

function updateMarkerPosition(latLng, coordinates) {
    document.getElementById('lat-lng').innerHTML = [
        "Latitude: " + latLng.lat(),
        "Longitude: " + latLng.lng()
    ].join(', ');
    coordinates.lat = latLng.lat();
    coordinates.lng = latLng.lng();
}

function updateMarkerAddress(str) {
    document.getElementById('address').innerHTML = str;
}

function doEditLocation(id, type) {
    let latlng = document.getElementById("lat-lng").innerHTML;
    let tmp = latlng.split(" ");
    latlng = tmp[1].concat(tmp[3]);
    let coordinates = coordsFromString(latlng);
    if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
        displayText(fail, "Drag marker to select a location on the map below")
        return false;
    }

    let urlRedFlags = `http://localhost:5000/api/v1/red-flags/${id}/location`;
    let urlInterventions = `http://localhost:5000/api/v1/interventions/${id}/location`;
    let url = "";
    if ( type === 'red-flag') {
        url = urlRedFlags;
    }
    else {
        url = urlInterventions;
    }
    let token = sessionStorage.getItem("token");
    let location = {
        location : `"${latlng}"`
    };
    displayText(success, message);
    fetch(url, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :  `Bearer ${token}`
            },    
        body: JSON.stringify(location)
        })
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            if (data["status"] !== 200) {
                throw new Error(data["error"]);
            }
            displayText(success, data["data"][0]["message"]);
            window.setTimeout( function() {
                window.location.replace('profile.html');
            }, 5000);
        })
        .catch(function(error){
            displayText(fail, error.message)
            console.log(error.message)
        });
        return false; 
}



