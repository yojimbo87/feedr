$(document).ready(function() {
    var source = new EventSource('/events');
    
    source.onmessage = function(e) {
        $("#debug").append(e.data + '<br>');
    };
});