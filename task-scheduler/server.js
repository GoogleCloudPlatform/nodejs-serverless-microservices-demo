const http = require("http");
const createScreenshotTask = require('./lib/create-screenshot-task');

var server = http.createServer((req, res) => {
  console.log('Looking for new tasks to schedule...');

  const tasksToCreate = ['http://steren.fr'];

  tasksToCreate.forEach((url) => {
    // TODO return promise and await
    createScreenshotTask(`/${url}`);
  })
  
  console.log(`${tasksToCreate.length} task scheduled`);

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('done');
});

server.listen(process.env.PORT || 8080);
