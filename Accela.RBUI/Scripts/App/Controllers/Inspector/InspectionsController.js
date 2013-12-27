"use strict";
RBUIApp.controller("GetAllInspectionsCtrl", ["$scope", "$timeout", "ApiService", function ($scope, $timeout, ApiService) {

    $scope.gridOptions = {
        columns: [
            { name: "type.text", title: 'Inspection Type', width: '10%', filtertype: "textbox" },
            { name: "recordId.customId", title: "Record ID", sortable: true, width: '10%', filtertype: "textbox" },
            { name: "recordType.value", title: "Record Type", sortable: true, width: '10%', align: 'center', filtertype: "textbox" },
            { name: "scheduleDate", title: "Schedule Date & Time", width: '20%', align: 'center', format: [{ date: 'MM/dd/yyyy h:mma' }, 'lowercase'], filtertype: "textbox" },
            { name: "updateDate", title: "Update Date", width: '10%', align: 'center', filtertype: "textbox" },
            { name: "status.value", title: "Status", width: '10%', align: 'center', filtertype: "textbox" },
            { name: "result", title: "Inspection Result", width: '10%', align: 'center', filtertype: "textbox" },
            { name: "address.streetName", title: "Address", width: '10%', align: 'center', filtertype: "textbox" },
            { name: "condition", title: "Condition", width: '10%', align: 'center', filtertype: "textbox" }
        ],
        Selectable: true,
        Pageable: false,
        HeaderFilterable: true
    };

    $scope.onGridSearch = function () {
        $scope.setNGGridPage(0);
        getPageData();
    }

    $scope.onGridPageSizeChange = function () {
        getPageData();
    }

    $scope.onGridPageChange = function () {
        getPageData();
    }

    $scope.onGridLoad = function () {
        getPageData();
    }

    var getPageData = function () {
        $(document).progressDialog.showDialog(' ');
        ApiService.GetInspections.get($scope.getNGGridSearchModel(), function (data) {
            if (data != null) {
                $(document).progressDialog.hideDialog();
                $scope.setNGGridPageItems(data.result);
            }
        });
    }
}]);