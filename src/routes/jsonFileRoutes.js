const express = require('express');
const multer = require("multer");
var fs = require('fs');
var File = require("../models/file").File;
var validate = require("../helper/inputParam").validate;
var getFileType = require("../helper/helper").getFileType;
var getReferenceNumber = require("../helper/helper").getReferenceNumber;

var jsonFileRouter = express.Router();

jsonFileRouter.route("/api/FileNetDMSDoc/AddDocByStreamAsync")
    .post(function (req, res) {
        var DocumentInfo = req.body.DocumentInfo;
        var errorMessages = validate(DocumentInfo);
        if (errorMessages.length == 0) {
            var file = new File();
            file.orginalFileName = DocumentInfo.FileName;
            file.fileName = Date.now() + '-' + DocumentInfo.FileName;
            file.type = getFileType(DocumentInfo.DocTypeCode);
            file.date = new Date();
            file.uniqueId = Date.now();
            file.referenceNumber = getReferenceNumber(DocumentInfo)
            file.save(function (err, file, numAffected) {
                res.send({
                    Message: file.fileId,
                    FileNetGUIDDocID: file._id,
                    Success: true,
                    ResponseError: {
                        Code: file.fileId,
                        Description: "",
                        Summary: ""
                    }
                });
                var buffer = new Buffer(req.body.Content, "base64");
                fs.writeFile('./uploads/' + file.fileName, buffer, 'binary', (err) => {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });
            });
        } else {
            res.send({
                Message: errorMessages.toString(),
                FileNetGUIDDocID: "",
                Success: false,
                ResponseError: {
                    Code: "",
                    Description: "",
                    Summary: ""
                }
            });
        }
    });


jsonFileRouter.route('/:fileId')
    .get(function (req, res) {
        if (req.params.fileId) {
            File.find({
                fileId: req.params.fileId
            }, function (err, docs) {
                if (docs) {
                    res.json(docs[0].uniqueId);
                } else {
                    res.json("Record Not Found");
                }
            });
        }
    });


jsonFileRouter.route("/")
    .post(function (req, res) {
        console.log("scsdc");
        res.send({
            errorMessage: "req.errorMessage",
        });
    })
module.exports = jsonFileRouter;