const http = require("http");

var server = http.createServer((request, response) => {
  console.log('Looking for new tasks to schedule...');
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello from Node.js!");
});

server.listen(process.env.PORT || 8080);
