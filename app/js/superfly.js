var image_cache = new Array();
var curr_image = 0;
var slideshow_running = 0;
var music;
var currProfile;

function openRC() {
    window.location = "editRC.html";
}

function cleanArray(array) {
    var tmp = [];
    for(var i in array) {
        if(array[i] !== null && array[i] !== undefined)
            tmp.push(array[i]);
    }
    return tmp;
}

function moveArrayElement(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

function hideAllMenuItems() {
    document.getElementById("profileOptions").hidden = "true";
    document.getElementById("add-remove-images").hidden = "true";
}

function openSettings() {
    saveProfile();
	localStorage.setItem("profile_queue", currProfile);
	window.location = "settings.html";
}

/*function openBulldozer() {
    saveProfile();
	localStorage.setItem("profile_queue", currProfile);
	window.location = "bulldozer.html";
}*/

function preview() {
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

function showHide(id) {
	if(document.getElementById(id).hidden === true)
		document.getElementById(id).hidden = false;
	else
		document.getElementById(id).hidden = true;
}

function view() {
	var profile = JSON.parse(localStorage.getItem(currProfile + "(profile)"));
	var slideshow_images = document.getElementsByClassName("slideshow-image");
    image_cache = [];
    for(var i in slideshow_images) {
        image_cache.push(slideshow_images[i].src);
    }
    image_cache = cleanArray(image_cache);
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
    
    //border styling fix:
    var bordercolor = profile.bordercolor;
    var borderwidth = profile.borderwidth;
    document.getElementById("fg").style.border = borderwidth + "px solid " + bordercolor;

	//play music
    if(profile.songfile !== undefined && profile.songfile !== null) {
        music = document.createElement("VIDEO");
        var source = document.createElement("SOURCE");
        source.type = "audio/mp3";
        source.src = profile.songfile;
        music.appendChild(source);
        music.autoplay = true;
        music.controls = true;
        music.hidden = true;
        document.body.appendChild(music);
        music.play();
    }
    //hide top bar
    document.getElementsByClassName("menu-bar")[0].hidden = true;
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
	var name = document.getElementById("save-profile-name").value;
    var images = [];
    var imageObjs = document.getElementsByClassName("slideshow-image");
    for(var i in imageObjs) {
        var src = imageObjs[i].src;
        images.push(src);
    }
    var tmp = [];
    for(var i in images) {
        if(images[i] != null && images[i] != undefined)
            tmp.push(images[i]);
    }
    images = tmp;

	var profiles = localStorage.getItem("profiles");
	if(profiles === undefined || profiles === null || profiles === "") {
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
	var thisProf = JSON.parse(localStorage.getItem(name + "(profile)"));
    var newProf = {}; //the new profiles
    newProf.name = name;
    newProf.images = images;
    try {
		newProf.brightness = thisProf.brightness;
		newProf.bordercolor = thisProf.bordercolor;
		newProf.borderwidth = thisProf.borderwidth;
		newProf.songfile = thisProf.songfile;
	} catch(TypeError) {
		//if the settings have not been defined yet
		//just do nothing here
	}
    
    localStorage.setItem(name + "(profile)", JSON.stringify(newProf));
}

function changeBGBrightness() {
	var profile = JSON.parse(localStorage.getItem(currProfile + "(profile)"));
	document.getElementById("bg").style.opacity = (parseInt(profile.brightness)/100) + "";

}

function loadProfile() {
	var name = document.getElementById("load-profile-name").value;
	currProfile = name;
    var profile = JSON.parse(localStorage.getItem(name + "(profile)"));
	var images = profile.images;
	var bordercolor = profile.bordercolor;
	var borderwidth = profile.borderwidth;
	var songfile = profile.songfile;
    console.log(images);
    for(var i in images) {
        document.getElementById("newImageToAdd").value = images[i];
        addImage();
    }
    document.getElementById("newImageToAdd").value = "";

	document.getElementById("save-profile-name").value = name; //make it easier for the user to save
	//change stylings to show up in the presentation
	changeBGBrightness();
	document.getElementById("fg").style.border = borderwidth + "px solid " + bordercolor;
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
    var src = document.getElementById("newImageToAdd").value;
    var img = document.createElement("IMG");
    img.className = "slideshow-image";
    img.src = src;
    document.getElementById("preview").appendChild(img);
}

function removeImage() {
    var url = document.getElementById("removeImage").value;
    var dumpingGround = document.getElementById("images").value;
    dumpingGround = dumpingGround.replace(url, "");
    dumpingGround = dumpingGround.split(","); document.getElementById("images").value = dumpingGround + ""; document.getElementById("removeImage").value = ""; //remove url after done, so that we can reuse the input field
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
                    document.getElementsByClassName("menu-bar")[0].hidden = false;
					slideshow_running = 0;
					document.body.style.overflowY = "scroll";
					music.pause();
				break;

                case 27: //esc(ape)
                    showHide("board");
                    showHide("editor");
                    document.getElementsByClassName("menu-bar")[0].hidden = false;
                    slideshow_running = 0;
                    document.body.style.overflowY = "scroll";
                    music.pause();

                case 32: //space(bar)
                    next();
                    break;

                case 8: //backspace
                    previous();
                    break;

                case 46: //delete (in case the user is on a mac) or has a keyboard that uses delte instead of backspace (such as some chromebooks)
                    previous();
                    break;

				default:
					return 0;
			}
			e.preventDefault();
		}
        else {
            switch(e.which) {
                case 116: //F5 (the present button for MS powerpoint)
                    view();
                    break;
                case 107: //plus button (SHIFT + =)
                    document.getElementById("newImageToAdd").focus();
                    break;
                case 109: //minus button (or dash/hyphen)
                    document.getElementById("removeImage").focus();

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
        loadProfile();
    } catch(SyntaxError) {
        //then just do nothing
    }
	
	currProfile = document.getElementById("load-profile-name").value
	
});
