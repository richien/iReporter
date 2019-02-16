function capitalise(s) {
	let arr = s.split(" ");
    let tmp=""
    for(let i=0; i<arr.length; i++) {
    	tmp += arr[i].charAt(0).toUpperCase() + arr[i].substring(1) + " "
    }
    return tmp
}