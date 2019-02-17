let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirm-password');
let firstname =  document.getElementById('firstname');
let surname =  document.getElementById('surname');
let otherNames = document.getElementById('other-names');
let username = document.getElementById('username');
let email = document.getElementById('email');
const url = 'https://irepo-api.herokuapp.com/api/v1/auth/signup';
const message = document.getElementById("flash-message")
const success = "green";
const fail = "red";


function isMatching_password() {
    if (password.value !== confirmPassword.value) {

        displayText(fail, "Passwords don't match");
        return false;
    }
    else {
        displayText(success, "Signing up ...");
        return true;
    }
}

function displayText(color, text) {
    message.style.color = color;
    message.innerHTML = "<p>" + text + "</p>"
    //message.innerHTML = '<p><div class="loader"></div></p>';
    message.scrollIntoView();
}

function signUp() {

    let isValid = isMatching_password()
    let signupForm = {
        firstname : firstname.value,
        lastname : lastname.value,
        otherNames : otherNames.value,
        username : username.value,
        email : email.value,
        password : password.value };
    
    if (isValid) {
        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type" : "application/json"
                },    
            body: JSON.stringify(signupForm)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {

                if (data["status"] !== 201) {
                    throw new Error(data["error"]);
                }
                displayText(success, data["data"][0]["message"]);
                if (typeof(Storage) !== "undefined") {
                    sessionStorage.clear();
                    sessionStorage.setItem("user_id", data["data"][0]["id"]);
                    sessionStorage.setItem("token", data["data"][0]["access_token"]);
                    window.setTimeout( function() {
                        window.location.replace("landing.html")
                    }, 1000);
                        
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
    else {
        return false;
    }
}
    




