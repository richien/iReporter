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

function doEditComment(id, type) {
    let url;
    if(type === 'red-flag') {
        url = `http://localhost:5000/api/v1/red-flags/${id}/comment`;
    }
    else {
        url = `http://localhost:5000/api/v1/interventions/${id}/comment`;
    }

    let comment = document.getElementById(`input-edit-comment-${id}`);
    let editForm = {comment: comment.value}
    //displayText(success, signInText);
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
            displayText(success, successText);
            window.location.reload();
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
    }
    




