$(document).ready(function() {
    /*var source = new EventSource("/events");
    
    source.onmessage = function(e) {
        $("#debug").append(
            "MSG " + 
            (new Date()).toLocaleTimeString() + " " +
            e.data + "<br />"
        );
    };
    
    source.onerror = function(e) {
        $("#debug").append(
            "ERROR " + 
            (new Date()).toLocaleTimeString() + " " +
            JSON.stringify(e) + "<br />"
        );
    };*/
    
    feedr.on("connect", function(data) {
        $("#debug").append(
            "EVENT " + 
            (new Date()).toLocaleTimeString() + " " +
            data + "<br />"
        );
    });
    
    feedr.connect({});
    
    //$('#debug').load("http://rt01.developmententity.sk:8080/text");
});
