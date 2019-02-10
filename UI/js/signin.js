let email = document.getElementById('email');
let password = document.getElementById('password')
const url = 'https://irepo-api.herokuapp.com/api/v1/auth/login';
const message = document.getElementById("flash-message")
const success = "green";
const fail = "red";
const successText = "Successfully Logged in";


function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    message.scrollIntoView();
}

function signIn() {

    let signinForm = {
        email : email.value,
        password : password.value };
    fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json"
            },    
        body: JSON.stringify(signinForm)
        })
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            if (data["status"] !== 200) {
                throw new Error(data["error"]);
            }
            displayText(success, successText);
            if (typeof(Storage) !== "undefined") {
                sessionStorage.clear();
                sessionStorage.setItem("user", data["data"][0]["user"]);
                sessionStorage.setItem("token", data["data"][0]["access_token"]);
                window.setTimeout( function() {
                    window.location.replace("landing.html")
                }, 4000);
                        
            }
            else {
                displayText(fail, "Browser does not support Web Storage");
            }
        })
        .catch(function(error){
            displayText(fail, error.message)
        });
        return false; 
    }
    




