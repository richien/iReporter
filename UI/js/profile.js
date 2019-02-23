let incident = document.getElementById("display-list-wrapper");
let redflagClicked = false;
let interveneClicked = false;
let response = null;
let res = [];
let edit = [];
const message = document.getElementById("flash-message");
const success = "green";
const fail = "red";

let names = `${user.firstname} ${user.lastname} ${user.othernames}`;
welcome.innerHTML = `<span>Welcome <h3 style="color:dodgerblue;">${user.username}</h3> to iReporter</span>`;

window.onload = () => {
    displayFullName();
}

function setEditListeners() {
    for(let i = 0; i < edit; i++) {
        edit[i].addEventListener("click", editCommmentForm);
    }
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
        else if (data["status"] === 401) {
            sessionStorage.clear();
            window.location.replace("signin.html");
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
        //sessionStorage.clear();
        window.location.reload();
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
                        <p id="title-text-${data.id}"><span id="status-box-${data.id}"></span>  ${data.title} </p>
                        <span id="createdby-text-${data.id}">Posted By ${capitalise(names)}</span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="row row-describe"  id="${data.id}">
                        <div class="col-12 col-s-12">
                            <p id="comment-${data.id}">${data.text}&nbsp;&nbsp;&nbsp;
                                <button class="btn-grey" id="more-link" onclick="showLess('${data.id}');"><b>LESS</b></button>
                            </p>
                            <p class="status"id="status">${data.type}</p>
                            <p class="status" id="posted">Posted on: ${data.createdOn}</p>
                            <p class="status"id="status">status: ${data.status}</p>
                            <p class="status"id="status">Location: ${data.location}</p>
                        </div>
                        <div class="row row-footer" id="update-${data.id}"></div>
                        <div id="edit-comment-${data.id}" style="display: none;">
                            <form method="POST" action="#"  id="form-edit-comment" onsubmit="return doEditComment(${data.id}, '${data.type}');">
                                <p><textarea id="input-edit-comment-${data.id}" name="edit" required>${data.text}</textarea></p>
                                <p>
                                    <button class="edit" id="btn-edit-comment-${data.id}" type="submit" value=""><img src="images/edit.png"></button>&nbsp;&nbsp;
                                    <span id="cancel-edit"><a onclick="return hideEditCommentForm(${data.id})">Cancel</a></span>
                                </p>
                            </form>                          
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
        document.getElementById(`title-${data.id}`).style.background = "aliceblue";
        document.getElementById(`title-text-${data.id}`).style.margin = "0";
        document.getElementById(`title-text-${data.id}`).style.textAlign = "left";
        document.getElementById(`createdby-text-${data.id}`).style.margin = "0";
        document.getElementById(`createdby-text-${data.id}`).style.fontWeight = "normal";
        document.getElementById(`createdby-text-${data.id}`).style.fontSize = "14px";
        document.getElementById(`comment-${data.id}`).style.fontSize = "17px";
        if(data.status === "draft") {
          let update =  `
            <div class="col-6 col-s-6">
                <li id="edit"><button class="edit" id="edit-${data.id}" onclick="return editCommmentForm(${data.id});"><img src="images/edit.png"></button></li>
            </div>
            <div class="col-6 col-s-6">
                <li id="delete"><button class="edit" id="delete-${data.id}" onclick="return deleteIncident(${data.id});"><img src="images/delete.png"></button></li>
            </div>
            `;
            document.getElementById(`${data.id}`).style.background = "aliceblue";
            document.getElementById(`update-${data.id}`).innerHTML = update;
            document.getElementById(`update-${data.id}`).style.width = "40%";
            document.getElementById(`edit-comment-${data.id}`).style.display = "none";
            document.getElementById(`edit-${data.id}`).style.background = "none";
            document.getElementById(`edit-${data.id}`).style.border = "none";
            document.getElementById(`delete-${data.id}`).style.background = "none";
            document.getElementById(`delete-${data.id}`).style.border = "none";
            document.getElementById(`status-box-${data.id}`).style.border = "0 solid";
            document.getElementById(`status-box-${data.id}`).style.padding = "0px 20px 0px 20px";
            document.getElementById(`status-box-${data.id}`).style.background = "lavender";
            document.getElementById(`status-box-${data.id}`).style.marginRight = "15px";
        }
        else if (data.status === 'resolved')
        {
            document.getElementById(`${data.id}`).style.background = "lightgreen";
            document.getElementById(`status-box-${data.id}`).style.border = "0 solid";
            document.getElementById(`status-box-${data.id}`).style.padding = "0px 20px 0px 20px";
            document.getElementById(`status-box-${data.id}`).style.background = "lightgreen";
            document.getElementById(`status-box-${data.id}`).style.marginRight = "15px";
        }
        else if (data.status === 'under-investigation')
        {
            document.getElementById(`${data.id}`).style.background = "lightorange";
            document.getElementById(`status-box-${data.id}`).style.border = "0 solid";
            document.getElementById(`status-box-${data.id}`).style.padding = "0px 20px 0px 20px";
            document.getElementById(`status-box-${data.id}`).style.background = "darkorange";
            document.getElementById(`status-box-${data.id}`).style.marginRight = "15px";
        }
        else if (data.status === 'rejected')
        {
            document.getElementById(`${data.id}`).style.background = "mistyrose";
            document.getElementById(`status-box-${data.id}`).style.border = "0 solid";
            document.getElementById(`status-box-${data.id}`).style.padding = "0px 20px 0px 20px";
            document.getElementById(`status-box-${data.id}`).style.background = "orangered";
            document.getElementById(`status-box-${data.id}`).style.marginRight = "15px";
        }
        let btnId = document.getElementById(`edit-${data.id}`);
        edit.push(btnId);
    }   
}

function editCommmentForm(id) {   
    document.getElementById(`edit-${id}`).style.display = "none";
    document.getElementById(`delete-${id}`).style.display = "none";
    document.getElementById(`edit-comment-${id}`).style.display = "block";
}
function hideEditCommentForm(id) {  
    document.getElementById(`edit-${id}`).style.display = "block";
    document.getElementById(`delete-${id}`).style.display = "block";
    document.getElementById(`edit-comment-${id}`).style.display = "none";
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
    document.getElementById("email").innerHTML = user.email;
}

