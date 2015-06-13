var image_cache;
function preview() {
	var images = document.getElementById("images").value;
	images = images.split(",");
	image_cache = images;
	document.getElementById("preview").innerHTML = "";
	for(i in images) {
		var img = document.createElement("IMG");
		img.src = images[i];
		img.height="100";
		document.getElementById("preview").appendChild(img);
	}
}

function view() {
	preview();
	//lockdown the editor
	document.getElementById("editor").hidden = true;
	//unlock presentation board
	document.getElementById("board").hidden = false;
	document.getElementById("bg").src = image_cache[1];
	document.getElementById("fg").src = image_cache[1];
}
