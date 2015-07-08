$(document).ready(function() {
    try {
        var data = localStorage.getItem("existing_plugins");
        data = data.split("\n");
        for(var i in data) {
            if(data[i].indexOf(".js") >= 0) {
                var pl = document.createElement("SCRIPT");
                pl.src = data[i];
            } else {
                var pl = document.createElement("LINK");
                pl.rel = "stylesheet";
                pl.type= "text/css";
                pl.href= data[i];
            }
            document.head.appendChild(pl);
        }
    } catch(TypeError) {
        console.log("No plugins are being used by the user");
    }
});
