var util = require("util"), 
	http = require("http"),
	url = require("url"),
    qs = require("querystring"),
    Client = require("./Client");
    
/*------------------------------------------------------------------------------
  (public) Feedr
  
  + options - { server, eventSourceName, postRequestName, retryTimeout }
  - void
  
  Set up Feedr server.
------------------------------------------------------------------------------*/
var Feedr = module.exports = function Feedr(options) {
    // name of the event source to which are clients connecting
    this._eventSourceName = options.eventSourceName || "feedr_event_source";
	
    this._postRequestName = options.postRequestName || "feedr_post_request";
    
    // default retry timeout in miliseconds
    this._retryTimeout = options.retryTimeout || 5000;
    
    // http server
	this._server = options.server;
	
    // clients which are actually connected to the Feedr server
    this._clients = {};
    
    // total count of actively connected clients
    this._clientsCount = 0;
    
    // total count of clients which were ever connected
    this._clientsCountEver = 0;
};

Feedr.prototype = new process.EventEmitter();

/*------------------------------------------------------------------------------
  (public) clients
  
  - get

  Getter for actual clients count.
------------------------------------------------------------------------------*/
Object.defineProperty(Feedr.prototype, "clients", {
    get: function() {
        return this._clients;
    }
});

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
  (private) _connect
  
  + request
  + response
  - void
  
  Process new client connection.
------------------------------------------------------------------------------*/
Feedr.prototype._connect = function(request, response) {
	var self = this;
    
    this._clientsCount++;
                
    client = new Client({
        id: ++this._clientsCountEver,
        retryTimeout: this._retryTimeout,
        request: request,
        response: response
    });
    
    this._clients[client.id] = client;
    
    request.on("close", function(err) {
        self._clientsCount--;

        client.disconnect(err);
    });
    
    response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    
    response.write("data: " + "connected" + "\n\n");
    
    this.emit("connect", client);
};

/*------------------------------------------------------------------------------
  (private) _post
  
  + request
  + response
  - void
  
  Process incoming message from client.
------------------------------------------------------------------------------*/
Feedr.prototype._post = function(request, response) {
	var self = this,
        data = "";
    
    request.addListener("data", function(chunk) {
        data += chunk;
    });

    request.addListener("end", function() {
        util.log(JSON.stringify(data));
        
        response.writeHead(200, {
            /*"Access-Control-Allow-Origin": "*",*/
            "Content-Type": "application/javascript; charset=utf-8"
        });
        response.write(JSON.stringify({status: "ok"}));
        response.end();
    });
    
    //this.emit("connect", client);
};

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

        switch(path) {
            case "/" + self._eventSourceName:
                if(req.headers.accept && 
                    req.headers.accept === "text/event-stream") {
                    self._connect(req, res);
                }
                break;
            case "/" + self._postRequestName:
                if(req.method === "POST") {
                    self._post(req, res);
                }
                break;
            default:
                break;
        }
    });
};

/*------------------------------------------------------------------------------
  (public) send
  
  + clientID
  + payload
  + type (optional) - event/retry/id
  - void
  
  Send payload to client. If optional type is passed as parameter it's value 
  will be sent as prefix followed by single newline char instead of "data".
------------------------------------------------------------------------------*/
Feedr.prototype.send = function(clientID, payload, type) {
	var client = this._clients[clientID];
    
    if(client) {
        client.send(payload, type);
    }
};