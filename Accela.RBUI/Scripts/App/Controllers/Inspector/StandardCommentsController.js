RBUIApp.controller("StandardCommentsCtrl", ["$scope", "$routeParams", "ApiService", "$filter",
function ($scope, $routeParams, ApiService, $filter) {

    $scope.standardCommentsList = [];

    $scope.standardCommentGroups = [];

    $scope.standardComments = "";

    //Get Standard Comment Groups
    $scope.getStandardCommentGroups = function () {

        ApiService.ApiRequest.get({ url: "/system/standardCommentGroups", time: Math.random(), version: "v3" }, function (data) {
            if (data != null) {
                $scope.standardCommentGroups = data.standardCommentGroups;
            }
        });

        //StandardCommentsService.getGroups(function (data) {
        //    if (data != null) {
        //        $scope.standardCommentGroups = data.standardCommentGroups;
        //    }
        //});
    }
    $scope.getStandardCommentGroups();

    //Get Standard Comments 
    $scope.getStandardComments = function () {
        $scope.currentStandardCommentGroups = $scope.standardCommentGroups.value != null & $scope.standardCommentGroups.value != undefined ? $scope.standardCommentGroups.value : "";
        //console.log("group id:" + $scope.currentStandardCommentGroups);
        ApiService.ApiRequest.get({ url: "/system/standardComments?groups=" + $scope.currentStandardCommentGroups, time: Math.random(), version: "v3" }, function (data) {
            if (data != null)
                $scope.standardCommentsList = data.standardComments;
        });
        //StandardCommentsService.getComments($scope.currentStandardCommentGroups, function (data) {
        //    //console.log(data);
        //    if (data != null)
        //        $scope.standardCommentsList = data.standardComments;
        //});
    }

    $scope.getStandardComments();

    //Add Comment to list
    $scope.addCommentToInsertList = function (item) {
        $scope.standardComments += item.display + "\n" + item.comments + " \r\n\n";
    }

    //clear all
    $scope.clearAll = function () {
        $scope.standardComments = "";
    };

    //Close modal, call back
    $scope.ClickClose = function () {
        $scope.$broadcast('CloseModal', { name: "standardComment", result: $scope.standardComments });
    };

}]);
