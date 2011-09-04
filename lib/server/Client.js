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
  
  + message
  + type
  - void
  
  Emit client disconnect event.
------------------------------------------------------------------------------*/
Client.prototype.send = function(message/*, type*/) {
    this._response.write("data: " + message + "\n\n");
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