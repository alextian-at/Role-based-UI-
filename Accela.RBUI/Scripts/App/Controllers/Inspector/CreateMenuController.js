"use strict"
RBUIApp.controller("CreateMenuCtrl", ["$scope", "$routeParams", "ApiService", "$filter", "$timeout","$location",
function ($scope, $routeParams, ApiService, $filter, $timeout, $location) {
    $scope.inspection = {
        "serviceProviderCode": "BPTDEV",
        "scheduleDate": new Date(),
        "recordId": {
            "serviceProviderCode": "BPTDEV",
            "id": "BPTDEV-DUB13-00000-0001X",
            "customId": "PMT13-00012",
            "trackingId": 287602341
        },
        "inspectorId": null,
        "requestDate": "2013-04-07T16:00:00Z",
        "submitDate": "2013-04-07T16:00:00Z",
        "scheduleStartAMPM": "AM",
        "scheduleStartTime": "8:30",
        "requestAMPM": "PM",
        "requestTime": "3:25",
        "requiredInspection": "N",
        "commentPublicVisible": [
            "All"
        ],
        "requestorFirstName": "System",
        "requestorMiddleName": "",
        "requestorLastName": "Admin",
        "scheduleEndAMPM": "AM",
        "scheduleEndTime": "9:00",
        "address": {},
        "displayCommentPublicVisible": "Y",
        "resultType": "PENDING",
        "publicVisible": "Y",
        "requestComment": null,
        "contact": {
            "fullName": ""
        },
        "isAutoAssign": false,
        "status": {
            "value": "Scheduled",
            "text": "Scheduled"
        },
        "type": {
            "hasNextInspInAdvance": false,
            "id": 106,
            "group": "PMT_COMM",
            "value": "Building Final"
        }
    };
    $scope.permitTypeList = [];

    $scope.permitTypes = [];

    $scope.datepicker = [];

    $scope.inspection.scheduleTime = new Date();

    //inspection type list
    $scope.typeList = [];

    //inspectors
    $scope.inspectors = [];

    $scope.OpenCreateModal = function () {

        $scope.$broadcast('OpenModal', { name: 'createNew', width: '800px', title: 'Create New Inspection' });
        if ($routeParams.id != null && $routeParams.id != undefined) {

            try {
                ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id }, function (data) {
                    //console.log("current inspection:" + angular.toJson(data.result));
                    if (data.status == 200) {
                        $scope.currentInspection = data.result[0];
                        $scope.inspectionType($scope.currentInspection.type.group);
                    }
                });

            }
            catch (ex) {
                console.log("get inspections error.");
            }

        } else {
            $scope.inspectionType();
        }
        enableInputClearOption();
    }


    //Get Inspection Type
    $scope.inspectionType = function (group) {
        try {
            ApiService.ApiRequest.get({ url: "/settings/inspections/types" }, function (data) {
                if (data.status == 200) {
                    //console.log("inspections types:" + angular.toJson(data.result));
                    if (group != null && group != undefined) {
                        for (var i in data.result) {
                            if (data.result[i].group == group) {
                                $scope.typeList.push(data.result[i]);
                            }
                        }
                    } else {
                        $scope.typeList = data.result;
                    }
                }
            });

        } catch (ex) {

        }
    };

    //get permit type list
    $scope.getPermitTypeList = function () {
        try {            
            ApiService.ApiRequest.get({ url: '/system/record/types?module=Permits&offset=0&limit=25', time: Math.random(), version: "v3" }, function (data) {
                if (data.recordTypes != null) {
                    //console.table(data.recordTypes);
                    $scope.permitTypeList = data.recordTypes;
                    for (var i in $scope.permitTypeList) {
                        $scope.permitTypes.push($scope.permitTypeList[i].display);
                    }
                }
            })

        } catch (ex) {
            //Todo
        }
    }

    $scope.getPermitTypeList();

    //Create New Inspection
    $scope.save = function () {
        console.log("request data:" + angular.toJson($scope.inspection));
        console.log("requestTime:" + $scope.inspection.scheduleTime);
        $scope.inspection.scheduleStartTime = $scope.inspection.scheduleTime.getHours() + ":" + $scope.inspection.scheduleTime.getMinutes();

        if ($scope.inspection.contact.firstName != null && $scope.inspection.contact.firstName != undefined) {
            $scope.inspection.contact.fullName += $scope.inspection.contact.firstName + " ";
        }

        if ($scope.inspection.contact.middleName != null && $scope.inspection.contact.middleName != undefined) {
            $scope.inspection.contact.fullName += $scope.inspection.contact.middleName + " ";
        }

        if ($scope.inspection.contact.lastName != null && $scope.inspection.contact.lastName != undefined) {
            $scope.inspection.contact.fullName += $scope.inspection.contact.lastName;
        }
        var newInspection = new ApiService.ApiRequest({ url: "/inspections/schedule" });
        newInspection.data = angular.toJson($scope.inspection);
        newInspection.$save(function (data) {
            if (data != null) {
                console.log("response data:" + angular.toJson(data.result));
                $scope.CloseCreateNewModal();
            }
        });

    };

    //get inspector
    $scope.getInspector = function () {
        ApiService.ApiRequest.get({ url: '/inspector' }, function (data) {
            //console.table(data.result);
            if (data != null) {
                $.each(data.result, function (i, v) {
                    $scope.inspectors.push(v.id);
                });
            }
        });

    }
    $scope.getInspector();

    //change inspector
    $scope.changeInspector = function (value) {
        $scope.inspection.inspectorId = value;
    }

    $scope.CloseCreateNewModal = function () {
        $scope.$broadcast('CloseModal', { name: "createNew" });
    }

    //Datepicker open
    $scope.open = function () {
        $timeout(function () {
            $scope.datepicker.opened = true;
        });
    };

    $scope.PermitIDList = [];

    $scope.LookUpPermitID = function () {
        if ($scope.inspection.recordId.customId != null && $scope.inspection.recordId.customId != undefined) {
            var requestBody = { "customId": $scope.inspection.recordId.customId };

            var searchRecords = new ApiService.ApiRequest({ url: "/search/records/" });
            searchRecords.data = angular.toJson(requestBody);

            searchRecords.$search(function (data) {
                if (data != null) {
                    console.log("search record result:" + angular.toJson(data.result[0]));
                    $scope.PermitIDList = data.result;
                }
            });

        }

        //open modal
        $scope.$broadcast('OpenModal', { name: 'LookUpPermitID', width: '500px', title: 'Look up Permit ID' });
    }

    $scope.changePermitId = function (permitId) {
        $scope.inspection.permitId = permitId;
    }

    $scope.savePermitID = function () {
        $scope.inspection.recordId.customId = $scope.inspection.permitId;
        $scope.$broadcast('CloseModal', { name: "LookUpPermitID" });
    }

    $scope.changePermitType = function (permitType) {
        $scope.inspection.permitType = permitType;
    }

    $scope.isCurrentPath = function (navname,displayname) {        
        if (angular.lowercase($location.path()).indexOf(angular.lowercase(navname)) != -1) {
            $scope.NavTitle = displayname;
            return true;
        } else
            return false;
    }
}]);
