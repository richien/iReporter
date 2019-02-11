let incident = document.getElementById("display-incidents");
let redflagClicked = false;
let interveneClicked = false;
const message = document.getElementById("flash-message");
const success = "green";
const fail = "red";
const urlRedflags = 'http://localhost:5000/api/v1/red-flags';
const urlInterventions = 'http://localhost:5000/api/v1/interventions';

function getAll_redflags() {
    if (typeof(Storage) !== "undefined") {
        let user = sessionStorage.getItem("user");
        let token = sessionStorage.getItem("token"); 
        if (redflagClicked !== true) {  
            document.getElementById("display-incidents").innerHTML = "";
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
        let user = sessionStorage.getItem("user");
        let token = sessionStorage.getItem("token"); 
        if (interveneClicked !== true) {  
            document.getElementById("display-incidents").innerHTML = "";
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
            let results = storeResponse(data);
            displayData(results);
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
        // sessionStorage.clear();
        // window.location.replace("signin.html");
    });
}

function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function displayError(error) {
    var p = document.createElement('p');
		p.appendChild(
			document.createTextNode('Error: ' + error.message)
		);
		document.body.insertBefore(p, incidents);
}

function createTable(data) {
    let table = `   
    <table class="table-landing">
        <thead>
            <tr>
                <th id="title" onclick="showMore('${data.id}');">${data.title}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="row row-describe"  id="${data.id}">
                        <div class="col-10 col-s-10">
                            <p id="comment">${data.text}&nbsp;&nbsp;&nbsp;
                                <button id="more-link" onclick="showLess('${data.id}');"><b>LESS</b></button>
                            </p>
                            <p class="status"id="status">
                                <img src="images/redflag1.jpg" height="20px" width="20px">
                            </p>
                            <p class="status" id="posted"><b>Posted on: ${data.createdOn}</b></p>
                            <p class="status"id="status"><b>Status:</b> ${data.status}</b></p>
                        </div>
                        <div class="col-2 col-s-2" id="col-deco"></div>
                        <div class="row row-footer">
                            <div class="col-6 col-s-6">
                                <li id="edit"><a href="incidentdetail.html"><img src="images/edit.png"></a></li>
                            </div>
                            <div class="col-6 col-s-6">
                                <li id="delete"><a href=""><img src="images/delete.png"></a></li>
                            </div>    
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
        
        response = new ResponseObj(id, title, type, text, status, createdOn);
        results.push(response)
    }
    return results;
}

class ResponseObj {
    constructor(id, title, type, text, status, createdOn) {
        this._id =  id; 
        this._title = title;
        this._type = type;
        this._text = text;
        this._status = status;
        this._createdOn = createdOn;
    }
    data() {
        let obj = {
            id : this._id,
            title : this._title,
            type : this._type,
            text : this._text,
            status : this._status,
            createdOn : this._createdOn
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


