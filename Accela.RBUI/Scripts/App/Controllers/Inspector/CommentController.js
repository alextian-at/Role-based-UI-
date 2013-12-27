"use strict"
RBUIApp.controller("CommentCtrl", ["$scope", "$routeParams", "ApiService", "$filter",
function ($scope, $routeParams, ApiService, $filter) {
    //??
    $scope.showStandardCommentWindow = function () {
        $scope.ModalTitle = "Standard Comment";

        if (!$scope.$$phase)
            $scope.$apply();
    }

    //Close Modal
    $scope.onModalClose = function (o, result) {
        //console.log(angular.toJson(result));
        for (var v in result) {
            $scope.commentText = result;
        }

    }

    //init 
    $scope.commentText = "";

    $scope.commentsList = [];

    $scope.inspection = {};

    var today = new Date();
    today = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

    //get current inspection
    $scope.getInspection = function () {
        try {
            ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id }, function (data) {
                if (data.status == 200) {
                    $scope.inspection = data.result[0];
                    //console.table($scope.inspection);
                    console.log("get inspection data:" + angular.toJson($scope.inspection));
                    $scope.commentsList.push({
                        'date': today,
                        'content': $scope.inspection.resultComment,
                        'id': $scope.inspection.id,
                        'commentType': 'Result Comment'
                    }, {
                        'date': today,
                        'content': $scope.inspection.requestComment,
                        'id': $scope.inspection.id,
                        'commentType': 'Scheduling Notes'
                    });
                }
            })
        }
        catch (ex) {
            console.log("get Inspection error.");
        }
    }
    $scope.getInspection();

    //save comment
    $scope.save = function () {
        if ($scope.commentText != null && $scope.commentText != "") {
            $scope.inspection.resultComment = $scope.inspection.resultComment != null && $scope.inspection.resultComment != undefined ? $scope.inspection.resultComment + today + "\n" + $scope.commentText + "\n\n" : today + "\n" + $scope.commentText + "\n\n";
            console.log("comment:" + $scope.commentText);
            var ApiRequest = new ApiService.ApiRequest();
            ApiRequest.data = angular.toJson($scope.inspection);
            console.log("post data:" + ApiRequest.data);

            ApiRequest.$update({ url: "/inspections/" + $routeParams.id }, function (data) {
                console.log("response data:" + angular.toJson(data));
                if (data.status == 200) {
                    console.log("insert success!");
                    //TODO 
                    //add new comment to comment list
                    $scope.commentsList.push({
                        'date': today,
                        'content': $scope.commentText,
                        'id': data.result.id,
                        'commentType': 'Result Comment'
                    });
                    //console.table($scope.commentsList);
                    $scope.commentText = "";
                } else {
                    console.log("update inspection result comment error");
                }
            });
        }
    }

}]);
