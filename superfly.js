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
	document.getElementById("editor").innerHTML = "";

	//create presentation board
	var canvas = document.createElement("DIV");

}
