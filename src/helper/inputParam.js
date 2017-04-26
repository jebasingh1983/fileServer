var getReferenceNumber = require("./helper").getReferenceNumber;
var pdfMimeType = "application/pdf";
var excelType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var fileTypes = ["INVC","COLN","DLNQ"]

module.exports.validate = function (documentInfo) {
    errorMessages = [];
    if (typeof documentInfo.DocTypeCode == 'undefined') {
        errorMessages.push("Parameter DocTypeCode NotFound")
    } else if (fileTypes.indexOf(documentInfo.DocTypeCode) < 0) {
        errorMessages.push("Invalid 'DocTypeCode', Type should be 'INVC','COLN' or 'DLNQ' (case-insensitive)!");
    }
    // if (errorMessages.length == 0) {
    //     if (documentInfo.DocTypeCode == "INVOICE" || documentInfo.DocTypeCode == "DLNQ") {
    //         if (file.mimetype != pdfMimeType) {
    //             errorMessages.push("Invalid file extension INVOICE should be a pdf!");
    //         }
    //     }
    //     else if (documentInfo.DocTypeCode == "COLLECTION") {
    //         if (file.mimetype != excelType) {
    //             errorMessages.push("Invalid file extension Collection should be a Excel!");
    //         }
    //     }
    // }
    if (getReferenceNumber(documentInfo) == "")
    {
       errorMessages.push("Patameter: ReferenceNumber Not found.");
    }
    return errorMessages;
}