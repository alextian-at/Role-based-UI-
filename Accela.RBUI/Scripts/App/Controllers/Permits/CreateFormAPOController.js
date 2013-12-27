"use strict"
RBUIApp.controller("CreateFromAPOController", ["$scope", "MapService", "$filter", function ($scope, MapService, $filter) {

    $scope.SearchResultList = [];//
    $scope.SelectAPOList = [];
    $scope.select = {
        Primarys: [{ value: "Y", text:"Yes" }, { value: "N", text: "No" }],
        Directions: [{ value:"E", text:"E" },
            { value: "N", text: "N" },
            { value: "NE", text: "NE" },
            { value: "NW", text: "NW" },
            { value: "S", text: "S" },
            { value: "SE", text: "SE" },
            { value: "SW", text: "SW" },
            { value: "W", text: "W" }]
    };


    /******** Create APO ********/
    $scope.CreateCategory = "";
    $scope.showAPOCreateCategory = function (category) {
        $scope.CreateCategory = category;
        $scope.$broadcast("OpenModal", { name: "CreateAPOModal", title: "New " + category });
    }

    /******** Condition *********/
    $scope.APOConditionList = [];
    $scope.showAPOConditionModal = function () {
        $scope.$broadcast("OpenModal", { name: "ConditionAPOModal", title: "Condition" })
    }

    /************ Location Saved ***********/
    $scope.LocationList = [];
    $scope.locationshow = false;
    $scope.ViewOnMap = false;
    $scope.gridOptions = {
        columns: [{ name: "address", title: "Address", template: "LocationAddressTemplate" },
            { name: "parcel", title: "Parcel", template: "LocationParcelTemplate" },
            { name: "owner", title: "Owner", template: "LocationOwnerTemplate" },
            { name: "id", title: "", template: "LocationRemoveTemplate" }
        ]
    };

    $scope.RemoveLocation = function (itemId) {
        $scope.accelaConfirm(null, 'Delete Document', 'Are you sure you want to remove this location?', function () {
            $scope.LocationList = $filter("filter")($scope.LocationList, function () { return false; });
            $scope.setNGGridPageItems($scope.LocationList);
        });
    }

    $scope.setViewOn = function (type) {
        if (type == "list") {
            $scope.ViewOnMap = false;
        } else {
            $scope.ViewOnMap = true;
            MapService.Loader().then(function () {
                MapService.CreateMap("LocationMapDiv");
            });
        }
    }

    $scope.showAPOLocation = function () {
        $scope.LocationList = [
            { address: "12 Oak Street <br />Bridgeview, CA 98888", parcel: "5769B", owner: "Linda Miller", id: 0 },
            { address: "12 Oak Street <br />Bridgeview, CA 98888", parcel: "5769B", owner: "Linda Miller", id: 1 },
        ];
        $scope.setNGGridPageItems($scope.LocationList);
        if ($scope.LocationList.length > 0)
            $scope.locationshow = true;
    }

    /********** Search ************/
    $scope.SearchCategory = "Address";
    $scope.setSearchCategory = function (category) {
        $scope.SearchCategory = category;
    }
    $scope.SubmitSearch = function () {
        $scope.locationshow = false;
        $scope.SearchResultList.push("1");
    }

    /********* Advanced search *********/
    $scope.AdvancedSearchCatetory = "Address";
    $scope.showAPOAdvancedSearchModal = function () {
        $scope.$broadcast("OpenModal", { name: "AdvancedSearchAPOModal", title: "Advanced Search" });
    }
    $scope.SubmitAdvancedSearch = function () {
        $scope.locationshow = false;
        $scope.SearchResultList.push("1");
    }

}]);