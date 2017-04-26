'use strict';
var express = require("express");
var ejs = require('ejs');
var bodyParser = require('body-parser')

var fileRouter = require('./src/routes/fileRoutes');
var homeRouter = require('./src/routes/homeRoutes');
var jsonFileRouter = require('./src/routes/jsonFileRoutes');
var config = require('./config');

var app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use("/file",fileRouter);
app.use("/home",homeRouter);
app.use("/fileNet",jsonFileRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(config.web.port);

console.log("Running on http://localhost:" + config.web.port);


