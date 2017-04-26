var app = angular.module("app", ["ngTable"])
var homeController = app.controller("homeController", function ($scope, $sce, NgTableParams, fileService) {


    $scope.types = [{
        id: "INVOICE",
        title: "INVOICE"
    }, {
        id: "DELINQUENT",
        title: "DELINQUENT"
    }, {
        id: "COLLECTION",
        title: "COLLECTION"
    }];


    var reload = function () {
        var files = fileService.GetFiles().then(function (response) {
            var collData = response.data;
            $scope.tableParams = new NgTableParams({}, {
                dataset: collData
            });
        }, function (err) {
            files = err;
        });
    }

    reload();

    $scope.reloadGrid = function () {
        reload();
    }

    $scope.download = function (file) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        fileService.DownLoadFile(file.fileId)
            .then(function (result) {
                var fileDwnld = new Blob([result.data], {
                    type: 'application/pdf'
                });
                var fileURL = window.URL.createObjectURL(fileDwnld);
                a.href = fileURL;
                a.download = file.fileName;
                a.click();
            }, function (data, status, headers, config) {
                console.log('Unable to download the file')
            });
    }
})