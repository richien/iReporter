const url = 'http://localhost:5000/api/v1/users';
const message = document.getElementById("flash-message");
const loader = document.getElementById("loader");
const success = "green";
const fail = "red";
let res = [];
let tblBody = document.getElementById("users-tbody"); 
let theader = document.getElementById("users-theader");
let sticky = theader.offsetTop;

window.onscroll = function() {stickyHeader();}
window.document.addEventListener('DOMContentLoaded', getUsers);

function stickyHeader() {
    if (window.pageYOffset > sticky) {
        theader.classList.add("sticky");
    }
    else {
        theader.classList.remove("sticky");
    }
}

function getUsers() {
    if (typeof(Storage) !== "undefined") {
        let token = sessionStorage.getItem("token"); 
        loader.style.display = "block";
        fetchUsers(token, url); 
        loader.style.display = "none"; 
    }                  
    else {
        displayText(fail, "Browser does not support Web Storage");
    }
}


function fetchUsers(token, url){
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
        else if (data["status"] === 401) {
            sessionStorage.clear();
            window.location.replace("signin.html");
        }
        if (data["status"] === 400) {
            throw new Error(data["error"]);
        }
        return data;       
    })
    .catch(function(error){
        displayText(fail, error.message);
        console.log(error);
        // sessionStorage.clear();
        // window.location.replace("signin.html");
    });
}

function createTableHeader() {
    let thead = `
    <th>User ID</th>
    <th>Name</th>
    <th>Username</th>
    <th>Email</th>
    <th>Role</th>
    <th>Phone number</th>
    <th>Registered</th>
    <th></th>
    `;
    return thead;
}

function createTableRow(data) {
    let fullname = data.firstname + " " + data.othernames + " " + data.lastname;
    let row = `   
    <tr>
        <td>${data.id}</td>
        <td>${capitalise(fullname)}</td>
        <td>${data.username}</td>
        <td>${data.email}</td>
        <td>${data.role}</td>
        <td>${data.phonenumber}</td>
        <td>${formatDate(data.registered)}</td>
        <td>
            <button class="btn-green" id="make-admin-${data.id}">Make Admin</button>
        </td>
    </tr>`; 
    return row;
}

function displayData(dataArray) {
    document.getElementById("users-theader").innerHTML = createTableHeader();
    for(let i = 0; i < dataArray.length; i++) {
        data = dataArray[i].data();
        let row = createTableRow(data);
        tblBody.innerHTML += row;
        if (data.isAdmin === true) {
            document.getElementById(`make-admin-${data.id}`).style.visibility = "hidden";
        }
    }
}

function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function storeResponse(data) {
    let results = [];
    for(let i = 0; i < data.data.length; i++) {
        id = data.data[i].id;
        firstname = data.data[i].firstname;
        lastname =  data.data[i].lastname;
        othernames = data.data[i].othernames;
        email =  data.data[i].email;
        phonenumber = data.data[i].phonenumber; 
        username = data.data[i].username;
        registered = data.data[i].registered;
        isAdmin = data.data[i].isAdmin;
        
        response = new ResponseObj(
            id, firstname, lastname, othernames, 
            email, phonenumber, username, registered, isAdmin);
        results.push(response)
    }
    return results;
}

class ResponseObj {
    constructor(id, firstname, lastname, othernames, 
        email, phonenumber, username, registered, isAdmin) {

        this._id =  id; 
        this._firstname = firstname;
        this._lastname = lastname;
        this._othernames = othernames;
        this._email = email;
        this._phonenumber = phonenumber;
        this._username = username;
        this._registered = registered;
        this._isAdmin = isAdmin;
    }
    data() {
        let role = "";
        if ( this._isAdmin ) {
            role = "Admin";
        }
        else {
            role = "User"
        }
        let obj = {
            id: this._id,
            firstname: this._firstname,
            lastname: this._lastname,
            othernames: this._othernames,
            email: this._email,
            phonenumber: this._phonenumber,
            username: this._username,
            registered: this._registered,
            isAdmin: this._isAdmin,
            role: role
        }
        return obj;
    }
}
