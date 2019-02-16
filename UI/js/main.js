let adminMenu = {
    admin: document.getElementsByClassName("admin-menu"),
    signout: document.getElementsByClassName("signout"),
    showAdmin: function() { 
       for (let i = 0; i < this.admin.length; i++) {
           this.admin[i].style.display = "block";
       }
    },
    hideAdmin: function() { 
        for (let i = 0; i < this.admin.length; i++) {
            this.admin[i].style.display = "none";
        }
    },
    showSignout: function() { 
        for (let i = 0; i < this.signout.length; i++) {
            this.signout[i].style.display = "block";
        }
     },
     hideSignout: function() { 
         for (let i = 0; i < this.signout.length; i++) {
             this.signout[i].style.display = "none";
         }
     }
}
let nonAdminMenu = {
    incident: document.getElementsByClassName("incident-menu"),
    profile: document.getElementsByClassName("profile-menu"),
    landing: document.getElementsByClassName("landing-menu"),
    showIncident: function() {
        for (let i = 0; i < this.incident.length; i++) {
            this.incident[i].style.display = "block";
        }
    },
    hideIncident: function() {
        for (let i = 0; i < this.incident.length; i++) {
            this.incident[i].style.display = "none";
        }
    },
    showProfile: function() {
        for (let i = 0; i < this.profile.length; i++) {
            this.profile[i].style.display = "block";
        }
    },
    hideProfile: function() {
        for (let i = 0; i < this.profile.length; i++) {
            this.profile[i].style.display = "none";
        }
    },
    showLanding: function() {
        for (let i = 0; i < this.landing.length; i++) {
            this.landing[i].style.display = "block";
        }
    },
    hideLanding: function() {
        for (let i = 0; i < this.landing.length; i++) {
            this.landing[i].style.display = "none";
        }
    }
}

let guestMenu = {
    signin: document.getElementsByClassName("signin-menu"),
    signup: document.getElementsByClassName("signup-menu"),
    index: document.getElementsByClassName("index-menu"),
    about: document.getElementsByClassName("about-menu"), 
    showSignin: function() {
        for (let i = 0; i < this.signin.length; i++) {
            this.signin[i].style.display = "block";
        }
    },
    hideSignin: function() {
        for (let i = 0; i < this.signin.length; i++) {
            this.signin[i].style.display = "none";
        }
    },
    showSignup: function() {
        for (let i = 0; i < this.signup.length; i++) {
            this.signup[i].style.display = "block";
        }
    },
    hideSignup: function() {
        for (let i = 0; i < this.signup.length; i++) {
            this.signup[i].style.display = "none";
        }
    },
    showIndex: function() {
        for (let i = 0; i < this.index.length; i++) {
            this.index[i].style.display = "block";
        }
    },
    hideIndex: function() {
        for (let i = 0; i < this.index.length; i++) {
            this.index[i].style.display = "none";
        }
    },
    showAbout: function() {
        for (let i = 0; i < this.about.length; i++) {
            this.about[i].style.display = "block";
        }
    },
    hideAbout: function() {
        for (let i = 0; i < this.about.length; i++) {
            this.about[i].style.display = "none";
        }
    }
}

window.addEventListener('DOMContentLoaded', displayMenu, false);

function displayMenu() {
    if (sessionStorage.getItem("user") && sessionStorage.getItem("isLoggedIn")) {
        user = JSON.parse(sessionStorage.getItem("user"));
        if (user.isAdmin) {
            displayAdminMenu();
        }
        else {
            if (/admin/.test(window.location.href)) {
                window.stop();
                window.location.replace("landing.html");
                displayNonAdminMenu();
            }          
            displayNonAdminMenu();
        }
    }
    else {
        // window.stop();
        // window.location.replace("signin.html");
        displayGuestMenu();
    }
}



function displayAdminMenu () {
    adminMenu.showAdmin();
    adminMenu.showSignout();
    nonAdminMenu.hideIncident();
    nonAdminMenu.hideProfile();
    nonAdminMenu.showLanding();
    guestMenu.hideSignin();
    guestMenu.hideSignup();
    guestMenu.hideIndex();
    guestMenu.hideAbout();
}

function displayNonAdminMenu () {
    adminMenu.hideAdmin();
    adminMenu.showSignout();
    nonAdminMenu.showIncident();
    nonAdminMenu.showProfile();
    nonAdminMenu.showLanding();
    guestMenu.hideSignin();
    guestMenu.hideSignup();
    guestMenu.hideIndex();
    guestMenu.showAbout();
}

function displayGuestMenu () {
    adminMenu.hideAdmin();
    adminMenu.hideSignout();
    nonAdminMenu.hideIncident();
    nonAdminMenu.hideProfile();
    nonAdminMenu.hideLanding();
    guestMenu.showSignin();
    guestMenu.showSignup();
    guestMenu.showIndex();
    guestMenu.showAbout();
}