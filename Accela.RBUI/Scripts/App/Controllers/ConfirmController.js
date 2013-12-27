///author:kevin
///description: confirm modal
///$scope.accelaConfirm('accelaConfirm', 'Cancel Inspection', 'Are you sure you want to cancel this inspection?', $scope.yesFunc);
///parameters: moalName, title, content, yesFunc


RBUIApp.controller("ConfirmController", ["$scope", function ($scope) {
    $scope.title = "";
    $scope.content = "";
    $scope.noFunc = null;

    $scope.accelaConfirm = function (moalName, title, content, yesFunc) {
        if (moalName == null || moalName == "") {
            moalName = "accelaConfirm";
        }
        $scope.title = title;
        $scope.content = content;
        $scope.yesFunc = yesFunc;
        $scope.$broadcast('OpenModal', { name: moalName, width: '400px', title: $scope.title });
    };

    $scope.closeConfirm = function (moalName, returnValue) {
        if (moalName == null || moalName == "") {
            moalName = "accelaConfirm";
        }
        if (true == returnValue) {
            $scope.yesFunc();
        }
        $scope.$broadcast('CloseModal', { name: moalName });
    };


    $scope.accelaMessageBox = function (moalName, title, content) {
        if (moalName == null || moalName == "") {
            moalName = "accelaMessage";
        }
        $scope.title = title;
        $scope.content = content;
        $scope.$broadcast('OpenModal', { name: moalName, width: '400px', title: $scope.title });
    };

    $scope.closeMessageBox = function (moalName) {
        if (moalName == null || moalName == "") {
            moalName = "accelaMessage";
        }
        $scope.$broadcast('CloseModal', { name: moalName });
    };
}]);
