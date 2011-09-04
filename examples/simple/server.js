var http = require("http");
    util = require("util"),
    fs = require("fs"),
    Feedr = require("../../lib/server/Feedr");

var httpServer = http.createServer(function(req, res) {
    /*if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/events') {
          sendSSE(req, res);
        } else {
          res.writeHead(404);
          res.end();
        }
    } else {*/
        switch(req.url) {
            case "/":
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(fs.readFileSync(__dirname + '/index.html'));
                res.end();
                break;
            case "/favicon.ico":
                res.writeHead(200, {'Content-Type': 'image/x-icon'} )
                res.end();
                break;
            case "/client.js":
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(fs.readFileSync(__dirname + '/client.js'));
                res.end();
                break;
            default:
                break;
        }
    //}
});
httpServer.listen(8080);
util.log("Running on 8080");


// set up feedr with settings
var feedr = new Feedr({
	server: httpServer,
    eventSourceName: "events"
});

// client connects to server
feedr.on("connect", function(client) {
    util.log("+C " + client.id + " [" + feedr.clientsCount + "]");
    
    setInterval(function() {  
        feedr.send(client.id, "test");
    }, 10000);
    
    client.on("disconnect", function(reason) {
        util.log("-C " + client. id + " [" + feedr.clientsCount + "] reason: " + reason);
    });
});

// initialize feedr server
feedr.init();