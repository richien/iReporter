let incidents = document.querySelector('#display-incidents');
const message = document.getElementById("flash-message")
const success = "green";
const fail = "red";
const url = 'http://localhost:5000/api/v1/red-flags';

getAll_redflags()

function getAll_redflags() {
    if (typeof(Storage) !== "undefined") {
        let user = sessionStorage.getItem("user");
        let token = sessionStorage.getItem("token");   
        fetchAllRedFlags(token); 
    }                  
    else {
        displayText(fail, "Browser does not support Web Storage");
    }
}

function fetchAllRedFlags(token){
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
            displayData(data);
        }
        else if (data["status"] === 404) {
            displayText(success, data['data'][0]);
        }
        else {
            throw new Error(data["error"]);
        }
        
        
    })
    .catch(function(error){
        displayText(fail, error.message)
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

function createTable(title, type, text, status, date) {
    let table = `
    <table class="table-landing">
        <thead>
            <tr>
                <th>${title}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="row" id="row-describe">
                        <div class="col-10 col-s-10">
                            <p id="comment">${text}...<a id="more-link" href=#>More</a></p>
                            <p class="status"id="status">
                                <img src="images/redflag1.jpg" height="20px" width="20px">
                            </p>
                            <p class="status" id="posted"><b>Posted on: ${date}</b></p>
                            <p class="status"id="status"><b>Status:</b> ${status}</b></p>
                        </div>
                        <div class="col-2 col-s-2" id="col-deco"></div>
                        <div class="row" id="row-footer">
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

function displayData(result) {
    for(var i = 0; i < result.data.length; i++) {
        let title = result.data[i].title;
        let type =  result.data[i].type;
        let text = result.data[i].comment;
        let status =  result.data[i].status;
        let createdOn = result.data[i].createdOn;
        let less = text.slice(0, 250);
        let table = createTable(title, type, text, status, createdOn);
        document.getElementById("display-incidents").innerHTML += table;  
    }     
}