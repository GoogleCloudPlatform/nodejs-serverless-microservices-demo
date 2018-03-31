const http = require("http");
const createScreenshotTask = require('./lib/create-screenshot-task');
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

var server = http.createServer(async (req, res) => {
  console.log('Looking for new tasks to schedule...');

  const query = datastore.createQuery('Website');
  const results = await datastore.runQuery(query);
  const websites = results[0];
  console.log(`Found ${websites.length} urls to screenshot, creating tasks...`)
  websites.forEach((website) => {
    // TODO return promise and await
    createScreenshotTask(`/${website.url}`);
  })
  
  console.log(`${websites.length} tasks scheduled`);

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('done');
});

server.listen(process.env.PORT || 8080);
