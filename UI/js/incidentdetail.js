// let comment = document.getElementById('input-edit-comment');
// const message = document.getElementById("flash-message");
// const success = "green";
// const fail = "red";
const successText = "Comment Edited";
// //const signInText = "Logging in..."
// // let user = JSON.parse(sessionStorage.getItem("user"));
// let token = sessionStorage.getItem("token");


function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function doEditStatus(id, type, status) {
    let url;
    if(type === 'red-flag') {
        url = `http://localhost:5000/api/v1/red-flags/${id}/status`;
    }
    else {
        url = `http://localhost:5000/api/v1/interventions/${id}/status`;
    }

    let newstatus = {status: status}
    fetch(url, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :  `Bearer ${token}`
            },    
        body: JSON.stringify(newstatus)
        })
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            if (data["status"] !== 200) {
                throw new Error(data["error"]);
            }
            displayText(success, successText);
            window.location.reload();
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
    }
    




