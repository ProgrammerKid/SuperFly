var image_cache;
var curr_image = 0;

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

function view() {
	preview();
	//lockdown the editor
	document.getElementById("editor").hidden = true;
	//unlock presentation board
	document.getElementById("board").hidden = false;
	document.getElementById("bg").src = image_cache[0];
	document.getElementById("fg").src = image_cache[0];
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

$(document).ready(function() {
	$(document).keydown(function(e) {
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
	});
});
