"use strict"
RBUIApp.controller("CreateFormController", ["$scope", function ($scope) {

    $scope.TabsHeadersCount = 0;
    $scope.isTabsStyle = true;
    $scope.PageStyleText = "View as single page";
    $scope.PreviousText = "";
    $scope.NextText = "Professionals";
    $scope.SectionIndex = 0;
    $scope.SectionCount = 6;
    $scope.SectionTexts = ['Location', 'Professionals', 'Applicant', 'Business Owner', 'Grading Information', 'Permit Dates'];

    $scope.getTabsHeaderTop = function () {
        var top = ($scope.TabsHeadersCount * 65) + "px";
        $scope.TabsHeadersCount++;
        return top;
    }

    $scope.SelectedTab = function (index) {
        if(index>0)
            $scope.PreviousText = $scope.SectionTexts[index - 1];
        if (index < $scope.SectionCount-1)
            $scope.NextText = $scope.SectionTexts[index+1];        
        $scope.SectionIndex = index;
    }

    $scope.ChangePageStyle = function () {
        if ($scope.isTabsStyle) {
            $scope.PageStyleText = "View step-by-step layout";
        } else {
            $scope.PageStyleText = "View as single page"
        }
        $scope.isTabsStyle = !$scope.isTabsStyle;
    }

}]);