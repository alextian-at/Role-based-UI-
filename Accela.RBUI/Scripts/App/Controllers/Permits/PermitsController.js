RBUIApp.controller("PermitsCtrl", ["$scope", function ($scope) {
    $scope.searchModel = {
        'recordId': '',
        'type': '',
        'status': '',
        'openedDate': '',
        'updatedDate': '',
        'address': '',
        'description': '',
        'condition': '',
        'feesDue': ''
    }

    var records = [
        {
            'recordId': '02SFR-000065-2010',
            'type': 'Single Family Residence',
            'status': '',
            'openedDate': '2/9/2010',
            'updatedDate': '',
            'address': '608 ELM',
            'description': 'New single family home',
            'condition': '',
            'feesDue': '0'
        },
        {
            'recordId': '10EST-000001',
            'type': 'Residential Addition',
            'status': 'Approved',
            'openedDate': '1/12/2010',
            'updatedDate': '',
            'address': '1492 MCGREGOR',
            'description': '',
            'condition': '',
            'feesDue': '0'
        }];

    $scope.gridOptions = {
        columns: [
            { name: "recordId", title: 'Record ID', width: '10%', filtertype: 'textbox' },
            { name: "type", title: "Record Type", sortable: true, width: '10%', filtertype: 'textbox' },
            { name: "status", title: "Status", sortable: true, width: '10%', align: 'center', filtertype: 'textbox' },
            { name: "openedDate", title: "Opened Date", width: '10%', align: 'center', format: [{ date: 'MM/dd/yyyy h:mma' }, 'lowercase'], filtertype: 'textbox' },
            { name: "updateDate", title: "Update Date", width: '10%', align: 'center', filtertype: 'textbox' },
            { name: "address", title: "Address", width: '10%', align: 'center', filtertype: 'textbox' },
            { name: "description", title: "Description", width: '10%', align: 'center', filtertype: 'textbox' },
            { name: "condition", title: "Condition", width: '20%', align: 'center', filtertype: 'textbox' },
            { name: "feesDue", title: "Fees Due", width: '10%', align: 'center', filtertype: 'textbox' }
        ],
        Selectable: true,
        Pageable: false,
        HeaderFilterable: true
    };

    $scope.onGridSearch = function () {
        //$scope.searchModel
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
        setTimeout(function () { 
            var results = [];           
            var searchModel = $scope.getNGGridSearchModel();
            for (i in records) {
                var match = true;
                for (j in records[i]) {
                    if (searchModel[j] && records[i][j].toLowerCase().indexOf(searchModel[j].toLowerCase()) == -1)
                        match = false;
                }
                if (match)
                    results.push(records[i]);
            }
            $(document).progressDialog.hideDialog();
            $scope.setNGGridPageItems(results);
        }, 500);
    }


    //$(document).progressDialog.showDialog(' ');

    setTimeout(function () {
        //$(document).progressDialog.hideDialog();
    }, 500);

    //$scope.search = function () {
    //    try {
    //        $(document).progressDialog.showDialog(' ');
    //        GetRecords.get(function (data) {
    //            if (data != null) {
    //                // TODO: error
    //                //$scope.recordList = data.inspections;
    //                //$scope.totalRows = 20;// data.page.totalRows;
    //                //$scope.Filed = "-scheduleDate";
    //                //$scope.taskincludeurl = "/AppViews/Inspector/MyDashboard/TableList.html";
    //                $(document).progressDialog.hideDialog();
    //            }
    //        });
    //    } catch (ex) {
    //        // TODO
    //        //jQuery.error("Error: " + ex.message);
    //    }

    //};
    //$scope.showProgressBar = function () {
    //    $(document).progressDialog.showDialog(' ');
    //}
    //$scope.search();

}]);
