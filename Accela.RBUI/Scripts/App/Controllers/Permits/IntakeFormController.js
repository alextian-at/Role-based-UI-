RBUIApp.controller("IntakeFormCtrl", ["$scope", "$routeParams", "ApiService", "$filter", "$timeout", "$location", function ($scope, $routeParams, ApiService, $filter, $timeout, $location) {
    $scope.permit = [];

    $scope.permitTypeList = [];

    $scope.permitTypes = [];

    $scope.recordTypeListTitle = "Search results";

    //get permit type list
    $scope.getPermitTypeList = function () {
        try {
            ApiService.ApiRequest.get({ url: '/system/record/types?module=Permits&offset=0&limit=25', time: Math.random(), version: "v3" }, function (data) {
                if (data.recordTypes != null) {
                    $scope.permitTypeList = data.recordTypes;
                    for (var i in $scope.permitTypeList) {
                        $scope.permitTypes.push($scope.permitTypeList[i].display);
                    }
                }
            })
            console.table($scope.permitTypes);

        } catch (ex) {
            //Todo
        }
    }

    $scope.getPermitTypeList();

    $scope.OpenRecordList = function () {
        $scope.recordTypeListTitle = "Available permit types";
        $(".record-type-list").slideDown();

    }

    $scope.CloseRecordList = function () {
        $(".record-type-list").slideUp();
    }

    $scope.OpenSearchList = function () {
        //$scope.permit.permitTypes
        $scope.recordTypeListTitle = "Search results";
        $(".record-type-list").slideDown();
    }

    $scope.ChooseRecordType = function (item) {
        $scope.permit.permitTypes = item.display;
        $(".record-type-list").slideUp();
    }


}]);
