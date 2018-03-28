const http = require("http");
const createScreenshotTask = require('./lib/create-screenshot-task');

var server = http.createServer((request, response) => {
  console.log('Looking for new tasks to schedule...');

  const tasksToCreate = ['http://steren.fr'];

  tasksToCreate.forEach((url) => {
    createScreenshotTask(`/?url=${encodeURIComponent(url)}`);
  })
  
  console.log(`${tasksToCreate.length} task scheduled`);

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end('done');
});

server.listen(process.env.PORT || 8080);
