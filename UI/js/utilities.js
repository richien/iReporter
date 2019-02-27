function capitalise(s) {
	let arr = s.split(" ");
    let tmp=""
    for(let i=0; i<arr.length; i++) {
    	tmp += arr[i].charAt(0).toUpperCase() + arr[i].substring(1) + " "
    }
    return tmp
}

function formatDate(s) {
    let arr = s.split(" ")
    let tmp = arr.slice(0, 4)
    s = tmp.join("  ")
    return s;
}