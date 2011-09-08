var feedr = (function (document, undefined) {
    var _eventConnect,
        _hostname,
        _postRequestName,
        _eventSourceName,
        _source;
    
    // custom connect event setup
    _eventConnect = document.createEvent("Event");
    _eventConnect.initEvent("__feedrConnect", false, false);
        
        
        
    /*--------------------------------------------------------------------------
      (public) connect
      
      + options- {hostname, postRequestName, eventSourceName}
      - void
      
      Connect feedr client with the server based on options.
    --------------------------------------------------------------------------*/
    function connect(options) {
        _hostname = options.hostname || "localhost";
        _postRequestName = options.postRequestName || "feedr_post_request";
        _eventSourceName = options.eventSourceName || "feedr_event_source";
    
        
    
        // invoke connect event
        _eventConnect.data = "aaaaa"
        document.dispatchEvent(_eventConnect);

    }
    
    /*--------------------------------------------------------------------------
      (public) send
      
      + payload - JS object
      - void
      
      Send payload to server.
    --------------------------------------------------------------------------*/
    function send(payload) {
        var xmlHttp = new XMLHttpRequest();
        
        xmlHttp.open("POST", _hostname + _postRequestName, true);
        xmlHttp.setRequestHeader(
            "Content-type", 
            "application/javascript"
        );
        
        xmlHttp.send(JSON.stringify(payload));
    }
    
    /*--------------------------------------------------------------------------
      (public) on
      
      + eventName
      - callback
      
      Starts listening to specified events and invoking callbacks.
    --------------------------------------------------------------------------*/
    function on(eventName, callback) {
        switch(eventName) {
            case "connect":
                document.addEventListener("__feedrConnect", function(e) {
                    callback(e.data);
                }, false);
                break;
            case "":
                break;
            default:
                break;
        }
    }
    
    return {
        connect: connect,
        send: send,
		on: on
	}
}(document));