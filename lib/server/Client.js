var util = require("util");

/*------------------------------------------------------------------------------
  (public) Client
  
  + options
  - void
  
  Set up client connected to Feedr server.
------------------------------------------------------------------------------*/
var Client = module.exports = function Client(options) {
    this._id = options.id;
    this._response = options.response;
    this._request = options.request;
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