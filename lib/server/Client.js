var util = require("util");

/*------------------------------------------------------------------------------
  (public) Client
  
  + options - { id, retryTimeout, response, request }
  - void
  
  Set up client connected to Feedr server.
------------------------------------------------------------------------------*/
var Client = module.exports = function Client(options) {
    this._id = options.id;
    this._retryTimeout = options.retryTimeout
    this._response = options.response;
    this._request = options.request;
    
    // set up idle timeout which is used for sending continuous messages to 
    // client in order to keep the connection alive
    this._idleTimeout = null;
    this._resetTimeout();
};

Client.prototype = new process.EventEmitter();

/*------------------------------------------------------------------------------
  (public) id
  
  - get

  Getter for client identifier.
------------------------------------------------------------------------------*/
Object.defineProperty(Client.prototype, "id", {
    get: function() {
        return this._id;
    }
});

/*------------------------------------------------------------------------------
  (public) response
  
  - get

  Getter for client http response object.
------------------------------------------------------------------------------*/
Object.defineProperty(Client.prototype, "response", {
    get: function() {
        return this._id;
    },
    set: function(value) {
        this._response = value;
    }
});

/*------------------------------------------------------------------------------
  (public) send
  
  + payload
  + type (optional) - event/retry/id
  - void
  
  Send payload to client. If optional type is passed as parameter it's value 
  will be sent as prefix followed by single newline char instead of "data".
------------------------------------------------------------------------------*/
Client.prototype.send = function(payload, type) {
    if(type) {
        switch(type) {
            case "event":
                this._response.write("event: " + payload + "\n");
                break;
            case "retry":
                this._response.write("retry: " + payload + "\n");
                break;
            case "id":
                this._response.write("id: " + payload + "\n");
                break;
            default:
                break;
        }
    } else {    
        this._response.write("data: " + payload + "\n\n");
    }
    
    // reset idle timeout
    this._resetTimeout();
};

/*------------------------------------------------------------------------------
  (public) disconnect
  
  + reason
  - void
  
  Emit client disconnect event.
------------------------------------------------------------------------------*/
Client.prototype.disconnect = function(reason) {
    this.emit("disconnect", reason);
};

/*------------------------------------------------------------------------------
  (private) _resetTimeout
  
  + none
  - void
  
  Reset timeout which indicates how long has connection been idle and sends 
  message to client in order to keep connection alive.
------------------------------------------------------------------------------*/
Client.prototype._resetTimeout = function() {
    var self = this;
    
    clearTimeout(this._idleTimeout);
    
    this._idleTimeout = setTimeout(function() {
        self.send(self._retryTimeout, "retry");
    }, 25000);
};