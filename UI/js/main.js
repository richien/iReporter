window.onload = () => {
    if (sessionStorage.getItem("user")) {
        return;
    }
    else {
        window.location.replace("signin.html")
    }
}