var currProfile;

function cleanDumpingGround() {
    var dg = document.getElementById("images").value; //dumping ground contents
    while(dg.indexOf(" ") >= 0)
        dg = dg.replace(" ", "");
    while(dg.indexOf(",,") >= 0)
        dg = dg.replace(",,", ",");

    if(dg.charAt(0) == ",")
        dg = dg.substr(1, dg.length);

    document.getElementById("images").value = dg;
}

function preview() {
    cleanDumpingGround();
	var images = document.getElementById("images").value;
	if(images.indexOf(",") >= 0)
		images = images.split(",");
	else
		images = [images];
	image_cache = images;
	document.getElementById("preview").innerHTML = "";
	for(var i in images) {
		if(i !== undefined && i !== null) {
			var img = document.createElement("IMG");
			img.src = images[i];
			img.height="100";
			document.getElementById("preview").appendChild(img);
		}
	}
}

function saveProfile() {
	preview();
	var name = currProfile;
	var images = document.getElementById("images").value;
	var profile = JSON.parse(localStorage.getItem(name + "(profile)"));
	profile.images = images.split(",");
	localStorage.getItem(name + "(profile)", JSON.stringify(images));
}

function swapImages() {
    var img1 = document.getElementById("img1").value;
    var img2 = document.getElementById("img2").value;
    var dg = document.getElementById("images").value;
    dg = dg.replace(img1, img1 + "*&*");
    dg = dg.replace(img2, img1);
    dg = dg.replace(img1 + "*&*", img2);
    document.getElementById("images").value = dg;
    preview();
}

function replaceImage() {
    var i_out = document.getElementById("img1").value;
    var i_in = document.getElementById("img2").value;
    var dg = document.getElementById("images").value;
    dg = dg.replace(i_out, i_in);
    document.getElementById("images").value = dg;
    preview();

}

function squeezeImage() {
    var dg = document.getElementById("images").value;
    var newImg = document.getElementById("img1").value;
    var pos = document.getElementById("squeeze-location").value;
    if(pos == "beg" || pos == "end") {
        if(pos == "beg") dg = newImg + "," + dg;
        else dg = dg + "," + newImg;
    } else {
        var after = document.getElementById("img2").value;
        dg = dg.replace(after, after + "," + newImg);
    }
    document.getElementById("images").value = dg;
    preview();
}

function applyBulldoze() {
    var action = document.getElementById("action").value;
    if(action == "swap")
        swapImages();
    else if(action == "replace")
        replaceImage();
    else if(action == "sqeeze")
        squeezeImage();
    
    saveProfile();
}

$(document).ready(function() {
    $("#action").change(function() {
        var option = document.getElementById("action").value;
        if(option == "swap" || option == "replace") {
            document.getElementById("option-dependent-text").innerHTML = "with";
        } else {
            document.getElementById("option-dependent-text").innerHTML = "after";
            document.getElementById("img2").placeholder = "Leave blank for beginning";
        }
    });
    
    //load up the defaults that come with the profile
    currProfile = localStorage.getItem("profile_queue");
    var profile = JSON.parse(localStorage.getItem(currProfile + "(profile)"));
    var images = profile.images;
    document.getElementById("images").value = images + "";
    preview();
});
