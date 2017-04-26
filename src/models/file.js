
var mongoose = require("mongoose");
var connection = mongoose.connect('mongodb://localhost:27017/DeductRight');

var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

var FileSchema = new mongoose.Schema({
  fileId : {
    type: String
  },
  uniqueId : {
    type: String
  },
  fileName: {
    type: String
  },
  orginalFileName:{
     type: String
  },
  type: {
    type: String
  },
  date: {
    type: Date
  },
  referenceNumber: {
     type: String
  } 
});

FileSchema.plugin(autoIncrement.plugin, { model: 'File', field: 'fileId' });

var File = mongoose.model('File', FileSchema);

module.exports = {
  File: File
}