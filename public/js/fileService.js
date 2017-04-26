app.factory("fileService", ["$http", function ($http) {
    var getFiles = function () {
        return $http.get("http://192.168.56.1:8080/home/files");
    }
    var downLoadFile = function (fileId) {
        return $http.get("http://192.168.56.1:8080/file/download/" + fileId, { responseType: 'blob' }).then(function (response) {
            return response;
        });
    }

    return {
        GetFiles: getFiles,
        DownLoadFile: downLoadFile
    }
}]);