let reportedrf;
let underinvrf;
let resolvedrf;
let rejectedrf;
let reportedin;
let underinvin;
let resolvedin;
let rejectedin;
let redflags;
let interventions;
let results = [];
let user = JSON.parse(sessionStorage.getItem("user"));
let token = sessionStorage.getItem("token");
const urlRedflags = `http://localhost:5000/api/v1/red-flags/${user.id}/users`;
const urlInterventions = `http://localhost:5000/api/v1/interventions/${user.id}/users`;


redflags = fetch(urlRedflags, {
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
        // results.push(data.data);
        userstats(data.data)
    }
    else {
        throw new Error(data["error"]);
    }        
})
.catch(function(error){
    console.log(error);
});

interventions = fetch(urlInterventions, {
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
        // results.push(data.data);
        userstats(data.data);
    }
    else {
        throw new Error(data["error"]);
    }        
})
.catch(function(error){
    console.log(error);
});


// results.push(redflags.entries());
// results.push(interventions.entries());
// rf = results[0]
// inv = results[1]
//userstats(results[0]);
// setTimeout(() => userstats(results[0]), 1000)

function userstats(arr) {
    reportedrf = 0;
    underinvrf = 0;
    resolvedrf = 0;
    rejectedrf = 0;
    reportedin = 0;
    underinvin = 0;
    resolvedin = 0;
    rejectedin = 0;
    for( let i = 0; i < arr.length; i++) {
        if (arr[i]["type"] === "red-flag") {
            if (arr[i]["status"] === "draft") {
                reportedrf++;
            }
            else if (arr[i]["status"] == "under-investigation") {
                underinvrf++;
            }
            else if (arr[i]["status"] == "resolved") {
                resolvedrf++;
            }
            else if (arr[i]["status"] == "rejected") {
                rejectedrf++;
            }
        } else {
            if (arr[i]["status"] === "draft") {
                reportedin++;
            }
            else if (arr[i]["status"] == "under-investigation") {
                underinvin++;
            }
            else if (arr[i]["status"] == "resolved") {
                resolvedin++;
            }
            else if (arr[i]["status"] == "rejected") {
                rejectedin++;
            }
        }
    }

}

function displayStats() {
    document.getElementById("col-reported-rf").innerHTML = reportedrf;
    document.getElementById("col-reported-in").innerHTML = reportedin;
    document.getElementById("col-resolved-rf").innerHTML = resolvedrf;
    document.getElementById("col-resolved-in").innerHTML = resolvedin;
    document.getElementById("col-underinv-rf").innerHTML = underinvrf;
    document.getElementById("col-underinv-in").innerHTML = underinvin;
    document.getElementById("col-rejected-rf").innerHTML = rejectedrf;
    document.getElementById("col-rejected-in").innerHTML = rejectedin;
}


