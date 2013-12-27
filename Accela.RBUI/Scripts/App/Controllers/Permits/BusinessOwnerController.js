"use strict"

RBUIApp.controller("BusinessOwnerController", ["$scope", "$routeParams", "ApiService", "$filter",
    function ($scope, $routeParams, ApiService, $filter) {

        $scope.applicantSrc = '/AppViews/Permits/ApplicantList.html';
        $scope.sectionHeader = "Business Owner";
        $scope.addressHeader = "Business Owner Addresses";
        $scope.list = [
        {
            'col1': 'Mark Miller',
            'col2': '32 Rocky Bluffs Drive',
            'col3': 'Pinedale, CA 62523',
            'col4': 'USA',
            'col5': 'mark@miller.com'
        },
        {
            'col1': 'John Stephens',
            'col2': '123 Main St',
            'col3': 'Anytown, CA 54321',
            'col4': 'USA',
            'col5': ''
        }];

        $scope.selectedItems = [
        {
            'col1': 'Mark Miller',
            'col2': '32 Rocky Bluffs Drive',
            'col3': 'Pinedale, CA 62523',
            'col4': 'USA',
            'col5': 'mark@miller.com'
        }];

        $scope.addressList = [
        {
            'id': 1,
            'type': 'Business',
            'line1': '123 Main St',
            'city': 'Anytown',
            'state': 'CA',
            'zip': '713508',
            'country':'USA'
        },
        {
            'id': 2,
            'type': 'Home',
            'line1': '32 Rocky Bluffs Drive',
            'city': 'Anytown',
            'state': 'CA',
            'zip': '713507',
            'country': 'USA'
        }];


        $scope.seletedApplicants = function (isSelect) {
            if (isSelect) {
                $scope.applicantSrc = "/AppViews/Permits/ApplicantSelected.html";
            }
            else {
                $scope.applicantSrc = '/AppViews/Permits/ApplicantList.html';
            }

        };

        $scope.closeeApplicantModal = function () {
            $scope.$broadcast('CloseModal', { name: 'CreateBusinessOwner', result: "cancel" });
        };

        $scope.createApplicant = function () {
            $scope.$broadcast('OpenModal', { name: 'CreateBusinessOwner', width: '750px', title: 'New Business Owner' });
        };

        $scope.closeeApplicantAddressModal = function () {
            $scope.$broadcast('CloseModal', { name: 'CreateBusinessOwnerAddress', result: "cancel" });
        };

        $scope.createApplicantAddress = function () {
            $scope.$broadcast('OpenModal', { name: 'CreateBusinessOwnerAddress', width: '750px', title: 'New Business Owner Address' });
        };


    }]);
