var image_cache = [];
var curr_image = 0;
var slideshow_running = 0;
var music;

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

function moveArrayElement(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
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
		var img = document.createElement("IMG");
		img.src = images[i];
		img.height="100";
		document.getElementById("preview").appendChild(img);
	}
}

function showHide(id) {
	if(document.getElementById(id).hidden === true)
		document.getElementById(id).hidden = false;
	else
		document.getElementById(id).hidden = true;
}

function view() {
	preview();
    window.scrollTo(0, 0);
	//lockdown the editor
	document.getElementById("editor").hidden = true;
	//unlock presentation board
	document.getElementById("board").hidden = false;
	document.getElementById("bg").src = image_cache[0];
	document.getElementById("fg").src = image_cache[0];
	slideshow_running = 1;
	//no scrolling
	document.body.style.overflow = "hidden";

	//play music
	music = document.createElement("VIDEO");
	var source = document.createElement("SOURCE");
	source.type = "audio/mp3";
	source.src = document.getElementById("song-file").value;
	music.appendChild(source);
	music.autoplay = true;
	music.controls = true;
	music.hidden = true;
	document.body.appendChild(music);
	music.play();
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

function saveProfile() {
	preview();
	document.getElementById("preview").innerHTML = "";
	var name = document.getElementById("save-profile-name").value;
	var images = document.getElementById("images").value;
	var brightness = document.getElementById("bg-dimmer").value;
	var bordercolor = document.getElementById("border-color").value;
	var borderwidth = document.getElementById("border-width").value;
	var songfile = document.getElementById("song-file").value;

	var profiles = localStorage.getItem("profiles");
	if(profiles === undefined || profiles === "") {
		localStorage.setItem("profiles", "");
		profiles = [name];
	} else {
        profiles = JSON.parse(profiles);
		if(profiles.indexOf(name) < 0)
			profiles.unshift(name); //no spaces between commas and items
        else {
            profiles = moveArrayElement(profiles, profiles.indexOf(name), 0);
        }
           
	}
    localStorage.setItem("profiles", JSON.stringify(profiles));

    var newProf = {}; //the new profiles
    newProf.name = name;
    newProf.images = images.split(",");
    newProf.brightness = brightness;
    newProf.bordercolor = bordercolor;
    newProf.borderwidth = borderwidth;
    newProf.songfile = songfile;
    
    localStorage.setItem(name + "(profile)", JSON.stringify(newProf));

    //refresh the page to clear up things
	window.location = "index.html";
}

function changeBGBrightness() {
	document.getElementById("bg-dimmer-output").innerHTML = document.getElementById("bg-dimmer").value + "%";
	document.getElementById("bg").style.opacity = parseInt(document.getElementById("bg-dimmer").value)/100;

}

function loadProfile() {
	var name = document.getElementById("load-profile-name").value;
    var profile = JSON.parse(localStorage.getItem(name + "(profile)"));
	var images = profile.images;
	var brightness = profile.brightness;
	var bordercolor = profile.bordercolor;
	var borderwidth = profile.borderwidth;
	var songfile = profile.songfile;
	//show in editor
	document.getElementById("save-profile-name").value = name;
	document.getElementById("images").value = images;
	document.getElementById("bg-dimmer").value = parseInt(brightness);
	document.getElementById("border-color").value = bordercolor;
	document.getElementById("border-width").value = borderwidth;
	document.getElementById("song-file").value = songfile;
	//change stylings to show up in the presentation
	changeBGBrightness();
	document.getElementById("fg").style.border = borderwidth + "px solid " + bordercolor;
    preview();
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

function addImage() {
    preview();
    var url = document.getElementById("newImageToAdd").value;
    document.getElementById("images").value = document.getElementById("images").value + ", " + url;
    document.getElementById("newImageToAdd").value = ""; //remove url after done, so that we can reuse the input field
    preview();
}

function removeImage() {
    preview();
    var url = document.getElementById("removeImage").value;
    var dumpingGround = document.getElementById("images").value;
    dumpingGround = dumpingGround.replace(url, "");
    dumpingGround = dumpingGround.split(","); document.getElementById("images").value = dumpingGround + ""; document.getElementById("removeImage").value = ""; //remove url after done, so that we can reuse the input field
    cleanDumpingGround();   
    preview();
}

function swapImages() {
    var img1 = document.getElementById("swap-image1").value;
    var img2 = document.getElementById("swap-image2").value;
    var dg = document.getElementById("images").value;
    dg = dg.replace(img1, img1 + "*&*");
    dg = dg.replace(img2, img1);
    dg = dg.replace(img1 + "*&*", img2);
    document.getElementById("images").value = dg;
    preview();
}

function replaceImage() {
    var i_out = document.getElementById("sub-image-out").value;
    var i_in = document.getElementById("sub-image-in").value;
    var dg = document.getElementById("images").value;
    dg = dg.replace(i_out, i_in);
    document.getElementById("images").value = dg;
    preview();

}

function squeezeImage() {
    var dg = document.getElementById("images").value;
    var newImg = document.getElementById("squeeze-image").value;
    var pos = document.getElementById("squeeze-location").value;
    if(pos == "beg" || pos == "end") {
        if(pos == "beg") dg = newImg + "," + dg;
        else dg = dg + "," + newImg;
    } else {
        var after = document.getElementById("squeeze-after").value;
        dg = dg.replace(after, after + "," + newImg);
    }
    document.getElementById("images").value = dg;
    preview();
}

$(document).ready(function() {
	$(document).scroll(function() {
		if(slideshow_running)
			document.body.style.overflow = "hidden";
		else
			document.body.style.overflow = "scroll";
	});

	$(document).keydown(function(e) {
		if(slideshow_running) {
			switch(e.which) {
				case 37: //left
					previous();
				break;
				
				case 39: //right
					next();
				break;

				case 40: //down
					showHide("board");
					showHide("editor");
					slideshow_running = 0;
					document.body.style.overflow = "scroll";
					music.pause();
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
    try {
        var profiles = JSON.parse(localStorage.getItem("profiles"));
        for(var i in profiles) {
            if(profiles[i] !== "") {
                var foo = document.createElement("OPTION");
                foo.innerHTML = profiles[i];
                foo.value = profiles[i];
                document.getElementById("load-profile-name").appendChild(foo);
            }
        }
	    //and do the same for deleting profiles
        for(var i in profiles) {
            if(profiles[i] !== "") {
                var foo = document.createElement("OPTION");
                foo.innerHTML = profiles[i];
                foo.value = profiles[i];
                document.getElementById("delete-profile-name").appendChild(foo);
            }
        }
    } catch(SyntaxError) {
        //then just do nothing
    }
	
	//load the last made profile on startup
	try { //incase there is no length to profiles (in the if statement)
		if(localStorage.getItem("profiles").length > 1)
			loadProfile();
	} catch(TypeError) {
		//do nothing
	}
    preview();
});
