"use strict"

RBUIApp.controller("ProfessionalsController", ["$scope", "$routeParams", "ApiService", "$filter",
    function ($scope, $routeParams, ApiService, $filter) {
        $scope.isShowList = false;
        $scope.professionalsSrc = '/AppViews/Permits/ProfessionalList.html';
        $scope.list = [
        {
            'col1': 'Frank Lloyd Wright',
            'col2': 'Construction Manager',
            'col3': '32 Rocky Bluffs Drive',
            'col4': 'Pinedale, CA 62523',
            'col5': 'USA',
            'col6': 'frank@wright.com',
            'license': 'CA License # 9877897'
        },
        {
            'col1': 'Frank Gaudi',
            'col2': 'Architect',
            'col3': '123 Main St',
            'col4': 'Anytown, CA 54321',
            'col5': 'USA',
            'col6': '',
            'license': 'CA License # 1534861'
        }];

        $scope.selectedItems = [
        {
            'col1': 'Frank Lloyd Wright',
            'col2': 'Construction Manager',
            'col3': '32 Rocky Bluffs Drive',
            'col4': 'Pinedale, CA 62523',
            'col5': 'USA',
            'col6': 'frank@wright.com',
            'license': 'CA License # 9877897'
        },
        {
            'col1': 'Frank Gaudi',
            'col2': 'Architect',
            'col3': '123 Main St',
            'col4': 'Anytown, CA 54321',
            'col5': 'USA',
            'col6': '',
            'license': 'CA License # 9877897'
        }];

        $scope.search = function ()
        {
            $scope.isShowList = true;
        }

        $scope.seletedProfessionals = function (isSelect) {
            if (isSelect) {
                $scope.professionalsSrc = "/AppViews/Permits/ProfessionalSelected.html";
            }
            else {
                $scope.professionalsSrc = '/AppViews/Permits/ProfessionalList.html';
            }

        };

        $scope.closeeProfessionalModal = function (name) {
            $scope.$broadcast('CloseModal', { name: name, result: "cancel" });
        };

        $scope.openProfessionalModal = function (name, title) {
            $scope.$broadcast('OpenModal', { name: name, width: '750px', title: title });
        };


    }]);
