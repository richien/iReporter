let incident = document.getElementById("display-list-wrapper");
let redflagClicked = false;
let interveneClicked = false;
let response = null;
let res = [];
let updatebtnlist = [];
const message = document.getElementById("flash-message");
const success = "green";
const fail = "red";
const statusui = "under-investigation";
const statusres = "resolved";
const statusrej = "rejected";

let names = `${user.firstname} ${user.lastname} ${user.othernames}`;

window.onload = () => {
    displayFullName();
}



// function setEditListeners() {
//     for(let i = 0; i < edit; i++) {
//         updatebtnlist[i].addEventListener("click", editCommmentForm);
//     }
// }

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
                <th id="title-${data.id}" onclick="showMore('${data.id}');">
                    <div>    
                        <p> ${data.title} </p>
                        <span style="font-size: 14px;">Posted By ${data.createdBy}</span>
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
                            <p class="status"id="status"><b>${data.type}</b></p>
                            <p class="status" id="posted"><b>Created</b> ${data.createdOn}</p>
                            <p class="status"id="status"><b>status</b> ${data.status}</p>
                            <p class="status"id="status"><b>Location[lat, lng]</b> [${data.location}]</p>
                        </div>
                        <div class="row row-footer" id="update-${data.id}" style="width: 70%; background: white;"></div>
                        <div id="edit-comment-${data.id}" style="display: none;">
                                                      
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
        let update =  `
            <div class="col-4 col-s-4">
                <li id="underinv"><button class="btn-orange" id="underinv-${data.id}" onclick="return doEditStatus(${data.id}, '${data.type}', '${statusui}');">Investigate</button></li>
            </div>
            <div class="col-4 col-s-4">
                <li id="resolve"><button class="btn-green" id="resolve-${data.id}" onclick="return doEditStatus(${data.id}, '${data.type}', '${statusres}');">Resolve</button></li>
            </div>
            <div class="col-4 col-s-4">
                <li id="reject"><button class="btn-red" id="reject-${data.id}" onclick="return doEditStatus(${data.id}, '${data.type}', '${statusrej}');">Reject</button></li>
            </div>
            `
            document.getElementById(`update-${data.id}`).innerHTML = update;
        if(data.status === "draft") {
            document.getElementById(`title-${data.id}`).style.background = "lavender";
            document.getElementById(`${data.id}`).style.background = "lavender";
            document.getElementById(`resolve-${data.id}`).style.display = "none";
        }
        else if (data.status === 'resolved')
        {
            document.getElementById(`title-${data.id}`).style.background = "lightgreen";
            document.getElementById(`${data.id}`).style.background = "lightgreen";
            document.getElementById(`underinv-${data.id}`).style.display = "none";
            document.getElementById(`reject-${data.id}`).style.display = "none";
            document.getElementById(`resolve-${data.id}`).style.display = "none";
        }
        else if (data.status === 'under-investigation')
        {
            document.getElementById(`title-${data.id}`).style.background = "darkorange";
            document.getElementById(`title-${data.id}`).style.color = "white";
            document.getElementById(`${data.id}`).style.background = "lightorange";
            document.getElementById(`underinv-${data.id}`).style.display = "none";
        }
        else if (data.status === 'rejected')
        {
            document.getElementById(`title-${data.id}`).style.background = "orangered";
            document.getElementById(`title-${data.id}`).style.color = "white";
            document.getElementById(`underinv-${data.id}`).style.display = "none";
            document.getElementById(`reject-${data.id}`).style.display = "none";
            document.getElementById(`resolve-${data.id}`).style.display = "none";
        }
        let btnId = document.getElementById(`edit-${data.id}`);
        updatebtnlist.push(`resolve-${data.id}`);
        updatebtnlist.push(`underinv-${data.id}`);
        updatebtnlist.push(`reject-${data.id}`);   
    }   
}

// function editCommmentForm(id) {   
//     document.getElementById("edit").style.display = "none";
//     document.getElementById("delete").style.display = "none";
//     document.getElementById(`edit-comment-${id}`).style.display = "block";
// }
// function hideEditCommentForm(id) {  
//     document.getElementById("edit").style.display = "block";
//     document.getElementById("delete").style.display = "block";
//     document.getElementById(`edit-comment-${id}`).style.display = "none";
// }

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
