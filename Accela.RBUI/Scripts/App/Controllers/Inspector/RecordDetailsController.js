"use strict"
RBUIApp.controller("RecordDetailsCtrl", ["$scope", "ApiService", "InspectionService", function ($scope, ApiService, InspectionService) {
    $scope.record = null;
    $scope.typeCategorys = [];

    $scope.getRecord = function () {
        $(document).progressDialog.showDialog('');
        try {
            var recordId = InspectionService.CurrentInspection.recordId.id;
            ApiService.ApiRequest.get({ url: "/records/" + recordId }, function (data) {
                if (data.status == 200) {
                    if (data.result != null && data.result.length > 0) {
                        $scope.record = data.result[0];
                        if ($scope.record.type.value != null && $scope.record.type.value.length > 0) {
                            $scope.typeCategorys = $scope.record.type.value.split("/");
                        }
                    }
                }
                $(document).progressDialog.hideDialog('');
            });
        }
        catch (ex) {
            alert("getRecord err:" + ex.message);
        }
    }
    $scope.getRecord();


}]);
