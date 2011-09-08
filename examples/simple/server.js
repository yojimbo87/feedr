var http = require("http");
    util = require("util"),
    fs = require("fs"),
    Feedr = require("../../lib/server/Feedr");

var httpServer = http.createServer(function(req, res) {
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
        case "/feedr.js":
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(fs.readFileSync('../../lib/client/feedr.js'));
            res.end();
            break;
        /*case "/text":
            res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
            res.write("text other domain");
            res.end();
            break;*/
        default:
            break;
    }
});
httpServer.listen(8080);
util.log("Running on 8080");


// set up feedr with settings
var feedr = new Feedr({
	server: httpServer
});

// client connects to server
feedr.on("connect", function(client) {
    util.log("+C " + client.id + " [" + feedr.clientsCount + "]");
    
    setInterval(function() {  
        feedr.send(client.id, "loooong interval");
    }, 150000);
    
    client.on("disconnect", function(reason) {
        util.log("-C " + client. id + " [" + feedr.clientsCount + "] reason: " + reason);
    });
});

// initialize feedr server
feedr.init();