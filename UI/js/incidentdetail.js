
const deletesuccessText = "Incident Deleted";
const commentsuccessText = "Comment Edited";
const statussuccessText = "Status Updated";


function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function doEditComment(id, type) {
    let url;
    if(type === 'red-flag') {
        url = `https://irepo-api.herokuapp.com/api/v1/red-flags/${id}/comment`;
    }
    else {
        url = `https://irepo-api.herokuapp.com/api/v1/interventions/${id}/comment`;
    }

    let comment = document.getElementById(`input-edit-comment-${id}`);
    let editForm = {comment: comment.value}
    fetch(url, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :  `Bearer ${token}`
            },    
        body: JSON.stringify(editForm)
        })
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            if (data["status"] !== 200) {
                throw new Error(data["error"]);
            }
            displayText(success, commentsuccessText);
            window.location.reload();
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
    }


function doEditStatus(id, type, status) {
    let url;
    if(type === 'red-flag') {
        url = `https://irepo-api.herokuapp.com/api/v1/red-flags/${id}/status`;
    }
    else {
        url = `https://irepo-api.herokuapp.com/api/v1/interventions/${id}/status`;
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
            displayText(success, statussuccessText);
            window.location.reload();
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
}

function deleteIncident(id, type) {
    let url;
    if(type === 'red-flag') {
        url = `https://irepo-api.herokuapp.com/api/v1/red-flags/${id}`;
    }
    else {
        url = `https://irepo-api.herokuapp.com/api/v1/interventions/${id}`;
    }

    fetch(url, {
        method: "DELETE",
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
            if (data["status"] !== 200) {
                throw new Error(data["error"]);
            }
            displayText(success, deletesuccessText);
            window.location.reload();
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
}




