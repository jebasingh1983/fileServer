module.exports.getFileType = function (typeCode) {
    var Desc = "";
    switch (typeCode) {
        case "DLNQ":
            Desc = "DELINQUENT";
            break;
        case "INVC":
            Desc = "INVOICE";
            break;
        case "COLN":
            Desc = "COLLECTION";
            break;
    }
    return Desc
}

module.exports.getReferenceNumber = function (documentInfo) {
    var referenceNumber = "";
    switch (documentInfo.DocTypeCode) {
        case "DLNQ":
            {
                referenceNumber = documentInfo.DelinquencyID;
                break;
            }
        case "INVC":
            {
                referenceNumber = documentInfo.InvoiceNumber;
                break;
            }
        case "COLN":
            {
                referenceNumber = documentInfo.CollectionID;
                break;
            }
    }
    return referenceNumber;
}

module.exports.getDefaultErrorMessage = function (description) {
    return {
        Code: "",
        Description: description,
        Summary: ""
    }
}