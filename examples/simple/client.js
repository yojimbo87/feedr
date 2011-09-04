$(document).ready(function() {
    var source = new EventSource("/events");
    
    source.onmessage = function(e) {
        $("#debug").append(
            "MSG " + 
            (new Date()).toLocaleTimeString() + " " +
            e.data + "<br>"
        );
    };
});