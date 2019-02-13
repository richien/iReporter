let adminMenu = {
    admin: document.getElementById("admin-menu"),
    signout: document.getElementById("signout")
}
let nonAdminMenu = {
    incident: document.getElementById("incident-menu"),
    profile: document.getElementById("profile-menu"),
    landing: document.getElementById("landing-menu")
}

let guestMenu = {
    signin: document.getElementById("signin-menu"),
    signup: document.getElementById("signup-menu"),
    index: document.getElementById("index-menu"),
    about: document.getElementById("about-menu") 
}


window.onload = () => {
    if (sessionStorage.getItem("user") && sessionStorage.getItem("isLoggedIn")) {
        user = JSON.parse(sessionStorage.getItem("user"));
        if (user.isAdmin) {
            displayAdminMenu();
        }
        else {
            displayNonAdminMenu();
        }
    }
    else {
        window.stop();
        window.location.replace("signin.html");
        displayGuestMenu();
    }
}

document.getElementById("signout").onclick = () => {
    sessionStorage.clear();
    window.stop();
    window.location.replace("index.html");
}

function displayAdminMenu () {
    adminMenu.admin.style.display = "block";
    adminMenu.signout.style.display = "block";
    nonAdminMenu.incident.style.display = "none";
    nonAdminMenu.profile.style.display = "none";
    nonAdminMenu.landing.style.display = "none";
    nonAdmin.signin.style.display = "none";
    nonAdmin.signup.style.display = "none";
    nonAdmin.index.style.display = "none";
    guestMenu.about.style.display = "none";
}

function displayNonAdminMenu () {
    adminMenu.admin.style.display = "none";
    adminMenu.signout.style.display = "block";
    nonAdminMenu.incident.style.display = "block";
    nonAdminMenu.profile.style.display = "block";
    nonAdminMenu.landing.style.display = "block";
    guestMenu.signin.style.display = "none";
    guestMenu.signup.style.display = "none";
    guestMenu.index.style.display = "none";
    guestMenu.about.style.display = "none";
}

function displayGuestMenu () {
    adminMenu.admin.style.display = "none";
    adminMenu.signout.style.display = "none";
    nonAdminMenu.incident.style.display = "none";
    nonAdminMenu.profile.style.display = "none";
    nonAdminMenu.landing.style.display = "none";
    guestMenu.signin.style.display = "block";
    guestMenu.signup.style.display = "block";
    guestMenu.index.style.display = "block";
    guestMenu.about.style.display = "block";
}