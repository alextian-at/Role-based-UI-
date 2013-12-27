RBUIApp.controller("RelatedInspectionsController", ["$scope", "$routeParams", "ApiService", "$filter",
    function ($scope, $routeParams, ApiService, $filter) {
        //init
        $scope.RelatedInspections = [];

        $scope.getRelatedList = function () {
            ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/related" }, function (data) {
                if (data.status == 200) {
                    $scope.RelatedInspections = data.result;
                } else {
                    console.log("no related inspection");
                }
            });
        }

        $scope.getRelatedList();

    }]);
