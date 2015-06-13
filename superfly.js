var image_cache = [];
var curr_image = 0;
var slideshow_running = 0;

function preview() {
	var images = document.getElementById("images").value;
	if(images.indexOf(",") >= 0)
		images = images.split(",");
	else
		images = [images];
	image_cache = images;
	document.getElementById("preview").innerHTML = "";
	for(i in images) {
		var img = document.createElement("IMG");
		img.src = images[i];
		img.height="100";
		document.getElementById("preview").appendChild(img);
	}
}

function fullscreen() {
    var elem = document.body;
    if (elem.requestFullscreen)
        elem.requestFullscreen();
    else if (elem.msRequestFullscreen)
        elem.msRequestFullscreen();
    else if (elem.mozRequestFullScreen)
        elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen)
        elem.webkitRequestFullscreen();

}

function showHide(id) {
	if(document.getElementById(id).hidden == true)
		document.getElementById(id).hidden = false;
	else
		document.getElementById(id).hidden = true;
}

function view() {
	preview();
	//lockdown the editor
	document.getElementById("editor").hidden = true;
	//unlock presentation board
	document.getElementById("board").hidden = false;
	document.getElementById("bg").src = image_cache[0];
	document.getElementById("fg").src = image_cache[0];
	slideshow_running = 1;
}

function changeImage(src) {
	document.getElementById("bg").src = src;
	document.getElementById("fg").src = src;
}

function next() {
	var max = image_cache.length - 1;
	if(curr_image + 1 > max) {
		curr_image = 0;
	} else {
		curr_image++;
	}
	var src = image_cache[curr_image];
	changeImage(src);
}

function previous() {
	if(curr_image - 1 < 0) {
		curr_image = image_cache.length - 1;
	} else {
		curr_image--;
	}
	var src = image_cache[curr_image];
	changeImage(src);
}

function profilesAsArray() {
	try {
		var i = localStorage.getItem("profiles");
		while(i.indexOf("`") >= 0)
			i = i.replace("`", "'");
		i = "[" + i + "]";
	} catch(TypeError) {
		i = "['']";
	}
	return eval(i);
}

function saveArrayAsProfile(i) {
	var i = i + "";
	while(i.indexOf("'") >= 0)
		i = i.replace("'", "`");
	localStorage.setItem("profiles", i);
}

function saveProfile() {
	preview();
	document.getElementById("preview").innerHTML = "";
	var name = document.getElementById("save-profile-name").value;
	var images = document.getElementById("images").value;
	var brightness = document.getElementById("bg-dimmer").value;
	
	var profiles = localStorage.getItem("profiles");
	if(profiles == undefined || profiles == "") {
		localStorage.setItem("profiles", "");
		profiles = "`" + name + "`";
	} else {
		if(profilesAsArray().indexOf(name) < 0)
			profiles = profiles + ",`" + name + "`"; //no spaces between commas and items
	}

	localStorage.setItem("profiles", profiles);

	localStorage.setItem(name+"-brightness", brightness);
	localStorage.setItem(name+"-images", images);
}

function changeBGBrightness() {
	document.getElementById("bg-dimmer-output").innerHTML = document.getElementById("bg-dimmer").value + "%";
	document.getElementById("bg").style.opacity = parseInt(document.getElementById("bg-dimmer").value)/100;

}

function loadProfile() {
	var name = document.getElementById("load-profile-name").value;
	var images = localStorage.getItem(name+"-images");
	var brightness = localStorage.getItem(name+"-brightness");

	document.getElementById("save-profile-name").value = name;
	document.getElementById("images").value = images;
	document.getElementById("bg-dimmer").value = parseInt(brightness);
	changeBGBrightness();
}

function deleteProfile() {
	var name = document.getElementById("delete-profile-name").value;
	var profiles = localStorage.getItem("profiles");
	profiles = profiles.replace("`"+name+"`", "");
	profiles = profiles.replace(",,", ",");
	localStorage.setItem("profiles", profiles);
	localStorage.removeItem(name+"-background");
	localStorage.removeItem(name+"-images");
	window.location = "index.html";
}

$(document).ready(function() {
	$(document).keydown(function(e) {
		if(slideshow_running) {
			switch(e.which) {
				case 37: //left
					previous();
				break;
				
				case 39: //right
					next();
				break;

				default:
					return 0;
			}
			e.preventDefault();
		}
	});
	
	//settings the brightness of the background
	$("#bg-dimmer").change(changeBGBrightness);


	//automatically load profiles browse things
	for(i in profilesAsArray()) {
		if(profilesAsArray()[i] != "") {
			var foo = document.createElement("OPTION");
			foo.innerHTML = profilesAsArray()[i];
			foo.value = profilesAsArray()[i];
			document.getElementById("load-profile-name").appendChild(foo);
		}
	}
	//and do the same for deleting profiles
	for(i in profilesAsArray()) {
		if(profilesAsArray()[i] != "") {
			var foo = document.createElement("OPTION");
			foo.innerHTML = profilesAsArray()[i];
			foo.value = profilesAsArray()[i];
			document.getElementById("delete-profile-name").appendChild(foo);
		}
	}

});
