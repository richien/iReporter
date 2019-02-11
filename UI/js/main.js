window.onload = () => {
    if (sessionStorage.getItem("user")) {
        getAll_redflags()
    }
    else {
        window.location.replace("signin.html")
    }
}