const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.use(async (req, res) => {
  if(req.path === '/') {res.end('Please provide URL');}

  const url = req.path.slice(1);
  console.log(`URL: ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
    timeout: 90000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  let imageBuffer = await page.screenshot();
  await browser.close();

  // TODO: store in GCS

  res.set('Content-Type', 'image/png')
  res.end(imageBuffer);
})

const server = app.listen(process.env.PORT || 8080, err => {
  if (err) return console.error(err);
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});