"use strict"
RBUIApp.controller("GetResourceCtrl", ["$scope", "JsonResource", function ($scope, JsonResource) {
    $scope.InitResource = function () {
        try {
            JsonResource.get(function (data) {
                if (data != null) {
                    // TODO: error
                    $scope.Language = data.LangOption;
                    $scope.navClass = "nav";
                }
            });
        }
        catch (ex) {
            // TODO
            //jQuery.error("Error: " + ex.message);
        }

    };
    $scope.InitResource();
}]);

