var image_cache = [];
var curr_image = 0;
var slideshow_running = 0;
var music;
var currProfile = localStorage.getItem("profile_queue");

function showHide(id) {
	if(document.getElementById(id).hidden === true)
		document.getElementById(id).hidden = false;
	else
		document.getElementById(id).hidden = true;
}


function saveProfile() {
	var name = localStorage.getItem("profile_queue");
	var profile = JSON.parse(localStorage.getItem(name + "(profile)"));
	var brightness = document.getElementById("bg-dimmer").value;
	var bordercolor = document.getElementById("border-color").value;
	var borderwidth = document.getElementById("border-width").value;
	var songfile = document.getElementById("song-file").value;

    var newProf = {}; //the new profile
    newProf.name = name;
    newProf.brightness = brightness;
    newProf.bordercolor = bordercolor;
    newProf.borderwidth = borderwidth;
    newProf.songfile = songfile;
    
    localStorage.setItem(name + "(profile)", JSON.stringify(newProf));

    //go back home
	window.location = "index.html";
}

function loadProfile() {
	var name = currProfile;
	currProfile = name;
    var profile = JSON.parse(localStorage.getItem(name + "(profile)"));
	var brightness = profile.brightness;
	var bordercolor = profile.bordercolor;
	var borderwidth = profile.borderwidth;
	var songfile = profile.songfile;
	
	document.getElementById("bg-dimmer").value = brightness;
	document.getElementById("border-color").value = bordercolor;
	document.getElementById("border-width").value = borderwidth;
	document.getElementById("song-file").value = songfile;
}

function deleteProfile() {
	var name = document.getElementById("delete-profile-name").value;
	var request = confirm("Are you sure you want to delete " + name + ". This action cannot be reversed");
	if(request !== true) return 0; //if user exits prompt, then it doesn't show up as false, which is why we say anything but true, then exit
    
    var profiles = JSON.parse(localStorage.getItem("profiles"));
    // start/end splice
    var splice1 = profiles.indexOf(name);
    var splice2 = splice1 + 1;
    profiles.splice(splice1, splice2);
    localStorage.setItem("profiles", JSON.stringify(profiles));

    localStorage.setItem(name + "(profile)", undefined);
}

$(document).ready(function() {
	loadProfile();
});

