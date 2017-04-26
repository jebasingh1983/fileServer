const express = require('express');
const multer = require("multer");
var ejs = require('ejs');

var File = require("../models/file").File;

var homeRouter = express.Router();

homeRouter.route("/")
    .get(function (req, res) {
        res.render("home.html");
    });

homeRouter.route("/files")
    .get(function (req, res) {
        File.find({}, function (err, files) {
            var result = [];
            for (var j = 0; j < files.length; j++) {
                var data = {
                    fileId: files[j].fileId,
                    referenceNumber: files[j].referenceNumber,
                    type: files[j].type,
                    date: files[j].date,
                    fileName : files[j].orginalFileName
                }
                result.push(data);
            }
            res.send(result);
        });
    });

module.exports = homeRouter;