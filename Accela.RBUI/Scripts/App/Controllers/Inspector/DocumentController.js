"use strict"
RBUIApp.controller("InspectionDocumentController", ["$scope", "ApiService", "$routeParams", function ($scope, ApiService, $routeParams) {

    $scope.query = function () {
        $(document).progressDialog.showDialog(' ');
        $scope.inspectionId = $routeParams.id;
        var InspectionDocument = new ApiService.ApiRequest();
        InspectionDocument.$get({ url: "/inspections/" + $routeParams.id + "/documents", time: Math.random() }, function (data) {
            if (data.status == 200) {
                $scope.recordList = data.result;

                $scope.Storeinset = data.result
                $(document).progressDialog.hideDialog();
            }
        });

    };
    $scope.showuploaddialog = function () {
        $scope.$broadcast('OpenModal', { name: 'DocumentUpload', width: '800px', title: 'Upload Document' });
    };

    $scope.closeuploaddialog = function () {
        $scope.$broadcast('CloseModal', { name: "DocumentUpload", result: $scope.commentList });
    };


    $scope.$on("FileUploadSuccess", function (event, data) {
        $scope.query()
    });



    $scope.ConfirmDeleteDocument = function (id) {
        $scope.accelaConfirm(null, 'Delete Document', 'Are you sure you want to delete this document?', function () {
            $scope.DeleteDocument(id);
        });
    }


    //Set Style;
    $scope.SetClass = function (objid) {
        var arraylist = objid.split(',');
        for (var i = 0; i < arraylist.length; i++) {
            var obj = document.getElementById(arraylist[i]);
            $(obj).removeAttr("class");
            $(obj).removeAttr("style");
            if (i == 0) {
                $(obj).addClass("document-a-active");
            }
            else {
                $(obj).addClass("document-a-disable");
            }
        }
    }

    $scope.DeleteDocument = function (documentid) {
        $(document).progressDialog.showDialog(' ');
        var InspectionDocument = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id + "/documents/" + documentid + "" });
        InspectionDocument.$delete({ url: "/inspections/" + $routeParams.id + "/documents/" + documentid + "" }, function (data) {
            if (data.status == 200) {
                $scope.recordList = data.result;
                $(document).progressDialog.hideDialog();
                $scope.query();
            }
        });
    };

    $scope.submitupload = function () {
        var Documenttype = $scope.Document.Documenttype.value;
        var Description = $scope.Document.Description.value;
        var uploadtype = document.getElementById("hidUploadType").value;
        var posturl = "/App/UploadDocument?Documenttype=" + Documenttype + "&Description=" + Description + "";
        if (uploadtype == "drag") {

            xhr = new XMLHttpRequest();

            xhr.open("post", posturl, true);

            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            xhr.send(fd);
        }
        else {
            $('#formUpload').ajaxForm({
                beforeSubmit: function () {
                    return true;
                },
                success: function (responseText) {
                    //nd upload success event
                    //nd id data when success
                },
                url: posturl,
                data: ""
            });
            $('#formUpload').submit();
        }
    };
    $scope.query();

}]);
