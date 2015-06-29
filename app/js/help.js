function help() {
    this.slideshow_images = function(){
        alert("This is where you can add/remove images, and even preview them");
    }

    this.poweruser = function() {
        alert("Poweruser is a mode where experienced user have the ability to see and edit a list of URL.\n\n Enabling is not recommended, unless you know what you are doing");
    }

    this.addToDG = function() {
        alert("To add an image, you are either:\n\n1: Drag+Drop an image, then hit add\n2: or Copy+paste an images url from the web, or the location to the image from your computer");
    }

    this.removeFromDG = function() {
        alert("To remove an image, drag and drop the image from the preview panel to the text box then hit remove.")
    }
}

var help = new help();
