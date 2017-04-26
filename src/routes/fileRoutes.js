const express = require('express');
const multer = require("multer");
var File = require("../models/file").File;
var validate = require("../helper/inputParam").validate;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        req.fileName = Date.now() + '-' + file.originalname;
        cb(null, req.fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        req.errorMessage = validate(req, file);
        if (req.errorMessage.length > 0) {
            cb(null, false)
        } else {
            cb(null, true)
        }
    }
});

var fileRouter = express.Router();

fileRouter.route("/upload")
    .post(upload.single('avatar'), function (req, res) {
        console.log(req.params);
        if (req.errorMessage.length == 0) {
            var file = new File();
            file.name = req.fileName;
            file.type = req.query.Type;
            file.date = new Date();
            file.uniqueId = Date.now();
            file.referenceNumber = req.query.ReferenceNumber;
            file.save(function (err, product, numAffected) {
                req.id = product._id;
                req.fileId = product.fileId;
                res.send({
                    fileId: req.fileId,
                    id: product._id,
                    fileId: product.fileId,
                    referenceNumber : product.ReferenceNumber,
                    status : "File Uploaded Successfully!"
                });
            });
        } else {
            res.send({
                errorMessage: req.errorMessage,
            });
        }
    })

fileRouter.route("/download/:fileId")
    .get(function (req, res) {
        console.log(req.params.fileId)
        if (req.params.fileId) {
            File.find({
                fileId: req.params.fileId
            }, function (err, docs) {
                var fileName = docs[0].fileName;
                //  res.setHeader('Content-disposition', 'attachment');
                //  res.setHeader('Content-Type', 'application/octet-stream');
                //  res.setHeader('Content-Type', 'text/html');
                //  res.setHeader('Accept-Ranges','none');
                //  res.setHeader('Access-Control-Allow-Headers','Origin, XMLHttpRequest, APIAuthentication, Content-Type, Accept');
                //  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
                //  res.setHeader('Access-Control-Allow-Origin','*');
                 res.download("./uploads/" + fileName, fileName);
            });
        }
    });

fileRouter.route('/:fileId')
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
module.exports = fileRouter;