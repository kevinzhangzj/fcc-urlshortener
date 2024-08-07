require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const url_directions = {};
let count = 1;

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req, res) => {
  const original_url = req.body.url;
  if ((!original_url)) {
    res.json({
      error: "invalid url"
    })
  }
  let _host = "";
  try {
    _host = (new URL(original_url)).hostname;
    dns.lookup(_host, (err) => {
      if (err) {
        res.json({
          error: "invalid url"
        })
      } else {
        count++;
        url_directions[count] = original_url;
        res.json({
          original_url: original_url,
          short_url: count,
        })
      }
    })
  } catch (err) {
    res.json({
      error: "invalid url"
    })
  }

})
app.get('/api/shorturl/:short_url', (req, res) => {
  const url_i = parseInt(req.params.short_url);
  if (url_i in url_directions) {
    res.redirect(url_directions[url_i]);
  } else {
    res.json({
      error: "invalid url"
    })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
