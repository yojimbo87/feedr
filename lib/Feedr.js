var util = require("util"), 
	http = require("http"),
	url = require("url"),
    Client = require("./Client");
    
/*------------------------------------------------------------------------------
  (public) Feedr
  
  + options
  - void
  
  Set up Feedr server.
------------------------------------------------------------------------------*/
var Feedr = module.exports = function Feedr(options) {
    // name of the event source to which are clients connecting
    this._eventSourceName = options.eventSourceName || "feedr_event_source";
	// http server
	this._server = options.server;
	// clients which are actually connected to the Feedr server
    this._clients = {};
    //
    this._clientsCount = 0;
    //
    this._clientsCountEver = 0;
};

Feedr.prototype = new process.EventEmitter();

/*------------------------------------------------------------------------------
  (public) clientsCount
  
  - get

  Getter for actual clients count.
------------------------------------------------------------------------------*/
Object.defineProperty(Feedr.prototype, "clientsCount", {
    get: function() {
        return this._clientsCount;
    }
});

/*------------------------------------------------------------------------------
  (public) init
  
  + none
  - void
  
  Initialize Feedr server.
------------------------------------------------------------------------------*/
Feedr.prototype.init = function() {
	var self = this;

	this._server.addListener("request", function(req, res) {
        var path = url.parse(req.url).pathname,
            client;
    
        if(req.headers.accept && req.headers.accept === "text/event-stream") {

            switch(path) {
                case "/" + self._eventSourceName:
                    self._clientsCount++;
                
                    client = new Client({
                        id: ++self._clientsCountEver,
                        response: res
                    });
                    
                    self._clients[client.id] = client;
                    
                    res.writeHead(200, {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive"
                    });
                    
                    res.write("data: " + "connected" + "\n\n");
                    
                    self.emit("connect", client);
                    break;
                default:
                    break;
            }
        }
    });
    
    this._server.addListener("clientError", function() {
        util.log("!!!client error!!!");
    });
};

/*------------------------------------------------------------------------------
  (public) send
  
  + clientID
  + message
  + type - optional - data (default), id, event, retry
  - void
  
  Send message to given client.
------------------------------------------------------------------------------*/
Feedr.prototype.send = function(clientID, message, type) {
	var client = this._clients[clientID];
    
    if(client && client.response) {
        client.response.write("data: " + message + "\n\n");
    }
};