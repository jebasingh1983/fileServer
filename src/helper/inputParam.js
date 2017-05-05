var getReferenceNumber = require("./helper").getReferenceNumber;
var fileTypes = ["INVC", "COLN", "DLNQ"]

module.exports.validate = function (req) {
    var documentInfo = req.body.DocumentInfo;
    errorMessages = [];
    if (typeof documentInfo.DocTypeCode == 'undefined') {
        errorMessages.push("Parameter DocTypeCode NotFound")
    } else if (fileTypes.indexOf(documentInfo.DocTypeCode) < 0) {
        errorMessages.push("Invalid 'DocTypeCode', Type should be 'INVC','COLN' or 'DLNQ' (case-insensitive)!");
    }
    var fileNameSplit = documentInfo.FileName.split('.');
    var extension = "";
    if (fileNameSplit.length > 0) {
        extension = fileNameSplit.pop();
        if (documentInfo.DocTypeCode == "INVC" || documentInfo.DocTypeCode == "DLNQ") {
            if (extension.toUpperCase() != "PDF") {
                errorMessages.push("Invalid file extension, for Invoice extension should be a pdf!");
            }
        } else if (documentInfo.DocTypeCode == "COLLECTION") {
            if (extension.toUpperCase() != "XLSX") {
                errorMessages.push("Invalid file extension, for Collection extension should be a Excel!");
            }
        }
    } else {
        errorMessages.push("Invalid file name or extension");
    }
    if (getReferenceNumber(documentInfo) == "") {
        errorMessages.push("Patameter: ReferenceNumber Not found.");
    }
    return errorMessages;
}