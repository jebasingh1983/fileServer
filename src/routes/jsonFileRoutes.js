const express = require('express');
const multer = require("multer");
var fs = require('fs');
var path = require('path');
var File = require("../models/file").File;
var validate = require("../helper/inputParam").validate;
var getFileType = require("../helper/helper").getFileType;
var getReferenceNumber = require("../helper/helper").getReferenceNumber;

var jsonFileRouter = express.Router();

jsonFileRouter.route("/api/FileNetDMSDoc/AddDocByStreamAsync")
    .post(function (req, res) {
        var DocumentInfo = req.body.DocumentInfo;
        var errorMessages = validate(req);
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


jsonFileRouter.route("/api/FileNetDMSDoc/GuidByFileNetID")
    .post(function (req, res) {
        if (req.body.FilenetID) {
            File.find({
                fileId: req.body.FilenetID
            }, function (err, docs) {
                if (docs) {
                    res.send({
                        Message: docs[0].fileId,
                        FileNetGUIDDocID: docs[0].uniqueId,
                        Success: true,
                    });
                } else {
                    res.send({
                        Message: "Record Not Found",
                        FileNetGUIDDocID: "",
                        Success: true,
                        ResponseError: getDefaultErrorMessage( "Record Not Found")
                    });
                }
            });
        } else {
            res.send({
                Message: "Parameter Not Found",
                FileNetGUIDDocID: "",
                Success: true,
                ResponseError: {
                    Code: "",
                    Description: "Parameter Not Found",
                    Summary: ""
                }
            });
        }
    });

jsonFileRouter.route("/api/FileNetDMSDoc/GetDocument")
    .post(function (req, res) {
        if (req.body.FileNetDocumentID) {
            File.find({
                uniqueId: req.body.FileNetDocumentID
            }, function (err, docs) {
                var fileName = docs[0].fileName;
                if (docs) {
                    var buffer = fs.readFileSync("./uploads/" + fileName, {
                        encoding: 'base64'
                    });
                    var fileNameSplit = fileName.split('.');
                    if (fileNameSplit.length > 0) {
                        extension = fileNameSplit.pop();
                        res.json({
                            Content: buffer,
                            DocumentExtension: extension,
                            DocumentName: fileName,
                            MimeType: "",
                        });
                    }
                } else {
                    res.json({
                        Content: "",
                        DocumentExtension: "",
                        DocumentName: "",
                        MimeType: "",
                        ResponseError: getDefaultErrorMessage( "Record Not Found")
                        }
                    );
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