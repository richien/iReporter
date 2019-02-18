let types = document.getElementsByName("type");
let btnRedflag = document.getElementById("redflag");
let btnIntervene = document.getElementById("intervene");
let title = document.getElementById('title');
let comment = document.getElementById('description');
let images = [];
let videos = [];
let url = "";
const urlRedflags = 'http://localhost:5000/api/v1/red-flags';
const urlInterventions = 'http://localhost:5000/api/v1/interventions';
const message = document.getElementById("flash-message");
const success = "green";
const fail = "red";
const signInText = "Please wait ...";

function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function createIncident() {
    if (coordinates.lat === "" || coordinates.lng === "") {
        displayText(fail, "Drag marker to select a location on the map below")
        return false;
    }
    let type = "";
    types.forEach(element => {
        if (element.checked) {
            if (element.defaultValue === 'red-flag') {
                url = urlRedflags;
            }
            else {
                url = urlInterventions;
                
            }
            type = element.defaultValue;
        }
    });
    let user = JSON.parse(sessionStorage.getItem("user"));
    let token = sessionStorage.getItem("token"); 
    let incidentForm = {
        createdby : user.id,
        type : type,
        title : title.value,
        comment : comment.value,
        location : `"${coordinates.lat}, ${coordinates.lng}"`,
        status : "draft",
        images : images,
        videos : videos };
    displayText(success, signInText);
    fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :  `Bearer ${token}`
            },    
        body: JSON.stringify(incidentForm)
        })
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            if (data["status"] !== 201) {
                throw new Error(data["error"]);
            }
            displayText(success, data["data"][0]["message"]);
            if (typeof(Storage) !== "undefined") {
                sessionStorage.setItem("incident_id", data["data"][0]["id"]);         
            }
            else {
                displayText(fail, "Browser does not support Web Storage");
            }
            window.setTimeout( function() {
                window.location.reload();
            }, 2000);
        })
        .catch(function(error){
            displayText(fail, error.message)
            console.log(error.message)
        });
        return false; 
}

    





