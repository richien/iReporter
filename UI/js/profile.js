let incident = document.getElementById("display-list-wrapper");
let redflagClicked = false;
let interveneClicked = false;
let response = null;
let res = [];
const message = document.getElementById("flash-message");
const success = "green";
const fail = "red";

// let user = JSON.parse(sessionStorage.getItem("user"));
// const urlRedflags = `http://localhost:5000/api/v1/red-flags/${user.id}/users`;
// const urlInterventions = `http://localhost:5000/api/v1/interventions/${user.id}/users`;
let names = `${user.firstname} ${user.lastname} ${user.othernames}`;

window.onload = () => {
    displayFullName();
}


function getAll_redflags() {
    if (typeof(Storage) !== "undefined") {
        let token = sessionStorage.getItem("token"); 
        if (redflagClicked !== true) {  
            displayText(success, "")
            incident.innerHTML = "";
            fetchAllIncidents(token, urlRedflags); 
            redflagClicked = true;
            interveneClicked = false;
        }
        else {
            return;
        }
    }                  
    else {
        displayText(fail, "Browser does not support Web Storage");
    }
}

function getAll_interventions() {
    if (typeof(Storage) !== "undefined") {
        let token = sessionStorage.getItem("token"); 
        if (interveneClicked !== true) {  
            displayText(success, "")
            incident.innerHTML = "";
            fetchAllIncidents(token, urlInterventions); 
            interveneClicked = true;
            redflagClicked = false;
        }
        else {
            return;
        }
    }                  
    else {
        displayText(fail, "Browser does not support Web Storage");
    }
}

function fetchAllIncidents(token, url){
    fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :  `Bearer ${token}`
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data["status"] === 200) {
            res = storeResponse(data);
            displayData(res);
        }
        else if (data["status"] === 404) {
            displayText(success, data['data'][0]);
        }
        else {
            throw new Error(data["error"]);
        }        
    })
    .catch(function(error){
        displayText(fail, error.message);
        console.log(error);
        // sessionStorage.clear();
        // window.location.replace("signin.html");
    });
}

function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function createTable(data) {
    let table = `   
    <table class="table-landing">
        <thead>
            <tr>
                <th id="title" onclick="showMore('${data.id}');">
                    <div>    
                        <p> ${data.title} </p>
                        <span style="font-size: 14px;">Posted By ${capitalise(names)}</span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="row row-describe"  id="${data.id}">
                        <div class="col-12 col-s-12">
                            <p id="comment">${data.text}&nbsp;&nbsp;&nbsp;
                                <button class="btn-grey" id="more-link" onclick="showLess('${data.id}');"><b>LESS</b></button>
                            </p>
                            <p class="status"id="status">${data.type}</p>
                            <p class="status" id="posted">Posted on: ${data.createdOn}</p>
                            <p class="status"id="status">status: ${data.status}</p>
                            <p class="status"id="status">Location: ${data.location}</p>
                        </div>
                        <div class="row row-footer" id="update-${data.id}">
                                
                        </div>
                    </div>
                </td>  
            </tr>
        </tbody>                      
    </table> `
    return table;
}

function displayData(dataArray) {
    for(let i = 0; i < dataArray.length; i++) {
        data = dataArray[i].data();
        let table = createTable(data);
        incident.innerHTML += table;
        if(data.status === "draft") {
          let update =  `
            <div class="col-6 col-s-6">
                <li id="edit"><a href="incidentdetail.html"><img src="images/edit.png"></a></li>
            </div>
            <div class="col-6 col-s-6">
                <li id="delete"><a href=""><img src="images/delete.png"></a></li>
            </div>
            `
            document.getElementById(`update-${data.id}`).innerHTML = update;

        }
    }    
}

function storeResponse(data) {
    let results = [];
    for(let i = 0; i < data.data.length; i++) {
        id = data.data[i].id;
        title = data.data[i].title;
        type =  data.data[i].type;
        text = data.data[i].comment;
        status =  data.data[i].status;
        createdOn = data.data[i].createdOn; 
        address = data.data[i].location;
        createdBy = data.data[i].createdby;
        
        response = new ResponseObj(id, title, type, text, status, createdOn, address, createdBy);
        results.push(response)
    }
    return results;
}

class ResponseObj {
    constructor(id, title, type, text, status, createdOn, address, createdBy) {
        this._id =  id; 
        this._title = title;
        this._type = type;
        this._text = text;
        this._status = status;
        this._createdOn = createdOn;
        this._location = address;
        this._createdBy = createdBy;
    }
    data() {
        let obj = {
            id: this._id,
            title: this._title,
            type: this._type,
            text: this._text,
            status: this._status,
            createdOn: this._createdOn,
            location: this._location,
            createdBy: this._createdBy
        }
        return obj;
    }
}

function showMore(id) {
    document.getElementById(id).style.display = "block";
}

function showLess(id) {
    document.getElementById(id).style.display = "none";
    message.scrollIntoView();
}

function displayFullName() {
    let fullname = capitalise(names);
    document.getElementById("fullname").innerHTML = fullname;
    document.getElementById("fullname").style.fontSize = "16px";
    document.getElementById("fullname").style.fontWeight = "bold";
    document.getElementById("fullname").style.color = "coral";
    document.getElementById("email").innerHTML = user.email;
}

