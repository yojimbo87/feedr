var feedr = (function (document, undefined) {
    var _eventConnect,
        _source;

    _eventConnect = document.createEvent("Event");
    _eventConnect.initEvent("__feedrConnect", false, false);
        
    /*--------------------------------------------------------------------------
      (public) connect
      
      + options
      - void
      
      Connect feedr client with the server based on options.
    --------------------------------------------------------------------------*/
    function connect(options) {
        _eventConnect.data = "aaaaa"
        document.dispatchEvent(_eventConnect);

    }
    
    /*--------------------------------------------------------------------------
      (public) send
      
      + payload
      - void
      
      Send payload to server.
    --------------------------------------------------------------------------*/
    function send(payload) {
        
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