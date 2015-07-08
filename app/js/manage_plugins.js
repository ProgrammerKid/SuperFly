$(document).ready(function() {
    (function() {
        if((localStorage.getItem("existing_plugins") == undefined)) {
            localStorage.setItem("existing_plugins", "");
        } else {
            var data = localStorage.getItem("existing_plugins");
            document.getElementById("plugins-editor").value = data;
        }
    })()
});

function save() {
    var data = document.getElementById("plugins-editor").value;
    localStorage.setItem("existing_plugins", data);
}
