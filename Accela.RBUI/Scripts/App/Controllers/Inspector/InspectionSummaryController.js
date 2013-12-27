"use strict"
RBUIApp.controller("InspectionSummaryCtrl", ["$scope", "$location", "$routeParams", "ApiService", "InspectionService", "MapService", function ($scope, $location, $routeParams, ApiService, InspectionService, MapService) {
    $scope.menuUrl = "/AppViews/Inspector/Details.html";
    $scope.actionTtitle = "Summary";
    $scope.address = "";
    $scope.inspection = null;
    $scope.alerts = [];
    $scope.inspectors = [];
    $scope.record = null;
    $scope.sourceInspection = {};
    $scope.taskInspections = [];
    $scope.inspectionsLength = 1;
    $scope.currentIndex = 1;

    $scope.getTaskInspections = function () {
        try {
            ApiService.GetInspections.get({ time: Math.random() }, function (data) {
                if (data != null) {
                    if (data.status == 200) {
                        if (data.resultPending != undefined) {
                            $scope.taskInspections = data.result.concat(data.resultPending);
                        }
                        else {
                            $scope.taskInspections = data.result;
                        }
                        console.log($scope.taskInspections);
                    }
                    $scope.inspectionsLength = $scope.taskInspections.length;
                }
            })
        }
        catch(ex)
        {
        };
    }
    $scope.getTaskInspections();

    $scope.getInspectors = function () {
        if ($scope.inspectors.length > 0) {
            return;
        }
        try {
            ApiService.GetInspectors.get(function (data) {
                if (data != null) {
                    for (var i = 0; i < data.result.length; i++) {
                        $scope.inspectors.push(data.result[i].id);
                    }
                }
            });
        }
        catch (ex) {
            alert("getInspectors err:" + ex.message);
        }
    };

    $scope.changeInspector = function (value) {
        $scope.inspection.inspectorId = value;
    }

    $scope.setContact = function ()
    {
        if ($scope.inspection.contact != undefined) {
            if ($scope.inspection.contact.fullName != undefined && $scope.inspection.contact.fullName != "") {

                var names = $scope.inspection.contact.fullName.split(" ");
                if (names.length == 3) {
                    $scope.inspection.contact.firstName = names[0];
                    $scope.inspection.contact.midName = names[1];
                    $scope.inspection.contact.lastName = names[2];
                }
                else if (names.length == 2) {
                    $scope.inspection.contact.firstName = names[0];
                    $scope.inspection.contact.midName = "";
                    $scope.inspection.contact.lastName = names[1];
                }
                else {
                    $scope.inspection.contact.firstName = $scope.inspection.contact.fullName;
                    $scope.inspection.contact.midName = "";
                    $scope.inspection.contact.lastName = "";
                }
            }
            else {
                $scope.inspection.contact.fullName = "";
                $scope.inspection.contact.firstName = "";
                $scope.inspection.contact.midName = "";
                $scope.inspection.contact.lastName = "";
            }
        }
       
    }

    $scope.setCurrentInspection = function ()
    {
        var inspection = $scope.taskInspections[$scope.currentIndex];
        console.log(inspection);
        var url = "/InspectionSummary/" + inspection.type.group + "/" + inspection.id;
        console.log(url);
        $location.path(url);
    }

    $scope.changeInspection = function () {
        if ($scope.currentIndex >= 1 && $scope.currentIndex <= $scope.inspectionsLength)
        {
            $scope.setCurrentInspection();
        }
    }

    $scope.preInspection = function ()
    {
        if($scope.currentIndex>1)
        {
            $scope.currentIndex -= 1;
            $scope.setCurrentInspection();
        }
    }

    $scope.nextInspection = function ()
    {
        if ($scope.currentIndex < $scope.inspectionsLength) {
            $scope.currentIndex += 1;
            $scope.setCurrentInspection();
        }
    }

    $scope.chngeUrl = function (url) {
        $scope.menuUrl = url;
        $scope.menuUrl = "/AppViews/Inspector/RecordDetails.html";
    }

    $scope.reGetInspection = function () {
        ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "?time" + Math.random() }, function (data) {
            console.log("reGetInspection: " + angular.toJson(data));
            if (data.status == 200) {
                InspectionService.CurrentInspection = $scope.inspection = data.result[0];
                $scope.address = $scope.inspection.address.houseNumberStart + ' ' + $scope.inspection.address.streetName + ' Dr,' + $scope.inspection.address.city + ' ' + $scope.inspection.address.postalCode;
                MapService.Loader().then(function () {
                    MapService.CreateMap("mapDiv").then(function () {
                        MapService.locate($scope.address, $scope.inspection.address.xCoordinator, $scope.inspection.address.yCoordinator);
                    });
                });
                $scope.setContact();
                $scope.inspection.scheduleTime = new Date();
                angular.copy($scope.inspection, $scope.sourceInspection);
            }


        }, function (error) {
            $scope.accelaMessageBox(null, 'Alert', 'load error:' + error.message);
        });
    }

    $scope.search = function () {
        $(document).progressDialog.showDialog(' ');
        //var url = window.location.pathname;
        //var inspectionId = url.substring(url.lastIndexOf("/") + 1);
        ApiService.GetSummary.get({ id: $routeParams.id }, function (data) {
            if (data != null) {
                InspectionService.CurrentInspection = $scope.inspection = data.result[0];
                $scope.address = $scope.inspection.address.houseNumberStart + ' ' + $scope.inspection.address.streetName + ' Dr,' + $scope.inspection.address.city + ' ' + $scope.inspection.address.postalCode;
                MapService.Loader().then(function () {
                    MapService.CreateMap("mapDiv").then(function () {
                        MapService.locate($scope.address, $scope.inspection.address.xCoordinator, $scope.inspection.address.yCoordinator);
                    });
                });
                $scope.setContact();
                $scope.inspection.scheduleTime = new Date();
                angular.copy($scope.inspection, $scope.sourceInspection);
                var recordId = $scope.inspection.recordId.id;
                ApiService.ApiRequest.get({ url: "/records/" + recordId }, function (data) {
                    if (data.status == 200) {
                        if (data.result != null && data.result.length > 0) {
                            $scope.record = data.result[0];
                            $(document).progressDialog.hideDialog();
                        }
                    }
                });

                $scope.getInspectors();

            }

        }, function (error) {
            $scope.accelaMessageBox(null, 'Alert', 'load error:' + error.message);
        });

    };

    $scope.search();


    $scope.isEditSchedulingNote = false;
    $scope.isEditOver = false;
    $scope.editSchedulingNote = function () {
        $scope.isEditSchedulingNote = true;
    };
    $scope.cancelSchedulingNote = function () {
        $scope.inspection.requestComment = $scope.sourceInspection.requestComment;
        $scope.isEditSchedulingNote = false;
    }

    $scope.saveSchedulingNote = function () {
        if ($scope.isEditSchedulingNote) {

            var summary = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id });
            $scope.json = {
                serviceProviderCode: $scope.inspection.serviceProviderCode,
                recordId: {
                    serviceProviderCode: $scope.inspection.serviceProviderCode,
                    id: $scope.inspection.recordId.id,
                    customId: $scope.inspection.recordId.customId,
                    trackingId: $scope.inspection.recordId.trackingId
                },
                id: $routeParams.id,
                requestComment: $scope.inspection.requestComment
            };
            summary.data = angular.toJson($scope.json);
            console.log(summary.data);
            $scope.isEditOver = true;
            summary.$update(function (data) {
                console.log("inspection schedulingNote edit : " + angular.toJson(data));
                if (data.status == 200) {
                    $scope.isEditOver = false;
                    $scope.isEditSchedulingNote = false;
                }
            }, function (error) {
                $scope.isEditOver = false;
                $scope.isEditSchedulingNote = false;
            });

        }
    };


    $scope.menuClick = function (ation) {
        $scope.actionTtitle = ation;
        switch (ation) {
            case "Summary":
                $scope.menuUrl = "/AppViews/Inspector/Details.html";
                break;
            case "Checklists":
                $scope.menuUrl = "/AppViews/Inspector/Checklists.html";
                break;
            case "Documents":
                $scope.menuUrl = "/AppViews/Inspector/Documents.html";
                $scope.submenuUrl = "/AppViews/Inspector/DocumentThumbList.html";
                break;
            case "DocumentThumbList":
                $scope.submenuUrl = "/AppViews/Inspector/DocumentThumbList.html";
                break;
            case "DocumentTableList":
                $scope.submenuUrl = "/AppViews/Inspector/DocumentTableList.html";
                break;
            case "Conditions":
                $scope.menuUrl = "/AppViews/Inspector/Conditions.html";
                break;
            case "RelatedInspections":
                $scope.menuUrl = "/AppViews/Inspector/RelatedInspections.html";
                break;
            case "Comments":
                $scope.menuUrl = "/AppViews/Inspector/Comments.html";
                break;
            case "RecordDetails":
                $scope.menuUrl = "/AppViews/Inspector/RecordDetails.html";
                break;
            default:
                $scope.menuUrl = "/AppViews/Inspector/Details.html";
                break;
        }

    }


    //modalDialog(id, isOpen, width, cancelFun, saveFun, title) {
    /****modal****/
    $scope.moalTitle = "";
    $scope.moalAction = "";

    $scope.modalClose = function (name) {
        $scope.inspection = $scope.sourceInspection;
        //alert($scope.inspection.requestComment);
        $scope.$broadcast('CloseModal', { name: name, result: "cancel" });
    };

    $scope.modalEdit = function (action, title, name) {
        $scope.$broadcast('OpenModal', { name: name, width: '750px', title: title });
        $scope.moalAction = action;
    };

    $scope.modalSave = function (modalName) {
        switch ($scope.moalAction) {
            case "Reassign":
                $scope.assign(modalName);
                break;
            case "Reshedule":
                $scope.reschedule(modalName);
                break;
            default:
                break;
        }
    }

    $scope.assign = function (modalName) {
        $(document).progressDialog.showDialog('');
        ///inspections/649/assign?inspectorId=ADMIN        if ($scope.inspection.inspectorId == null || $scope.inspection.inspectorId == "") {
            alert("Inspector is required.");
            return false;
        }
        var summary = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id + "/assign?inspectorId=" + $scope.inspection.inspectorId });
        $scope.json = {
            inspectorId: $scope.inspection.inspectorId,
        };
        summary.data = angular.toJson($scope.json);
        summary.$update(function (data) {
            console.log("Inspection reassign: " + angular.toJson(data));
            if (data.status == 200) {
                $scope.reGetInspection();
                $(document).progressDialog.hideDialog('');
                $scope.$broadcast('CloseModal', { name: modalName, result: "" });
            }
        }, function (error) {
            $(document).progressDialog.hideDialog('');
            $scope.accelaMessageBox(null, 'Alert', 'Reschedule error:' + error.message);
        });
    }

    $scope.reschedule = function (modalName) {
        $(document).progressDialog.showDialog('');

        var hours = $scope.inspection.scheduleTime.getHours();
        var minutes = $scope.inspection.scheduleTime.getMinutes();
        var apm = "AM";
        if (hours >= 12) {
            apm = "PM";
            hours = hours - 12;
        }
        var summary = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id + "/reschedule" });
        $scope.json = {
            serviceProviderCode: $scope.inspection.serviceProviderCode,
            scheduleDate: $scope.inspection.scheduleDate,
            recordId: {
                serviceProviderCode: $scope.inspection.serviceProviderCode,
                id: $scope.inspection.recordId.id,
                customId: $scope.inspection.recordId.customId,
                trackingId: $scope.inspection.recordId.trackingId
            },
            inspectorId: $scope.inspection.inspectorId,
            scheduleStartAMPM: apm,
            scheduleStartTime: hours + ":" + minutes,
            //scheduleEndAMPM: $scope.inspection.scheduleEndAMPM,
            //scheduleEndTime: $scope.scheduleEndTimeH + ":" + $scope.scheduleEndTimeM,
            requestComment: $scope.inspection.requestComment,
            status: {
                value: "Rescheduled",
                text: "Rescheduled"
            },
            contact: {
                fullName: $scope.inspection.contact.firstName + " " + $scope.inspection.contact.midName + " " + $scope.inspection.contact.lastName,
                phoneNumber1: $scope.inspection.contact.phoneNumber1
            }
        };
        summary.data = angular.toJson($scope.json);
        console.log(summary.data);
        summary.$update(function (data) {
            console.log("Inspection reschedule: " + angular.toJson(data));
            if (data.status == 200) {
                $scope.inspection = data.result;
                // /InspectionSummary/PMT_COMM/782               
                $(document).progressDialog.hideDialog('');
                $scope.$broadcast('CloseModal', {
                    name: modalName, result: "", closedCallBack: function () {
                        var url = "/InspectionSummary/" + $scope.inspection.type.group + "/" + $scope.inspection.id;
                        $location.path(url);
                    }
                });
            }
        }, function (error) {
            $(document).progressDialog.hideDialog('');
            $scope.accelaMessageBox(null, 'Alert', 'Reschedule error:' + error.message);
        });

    }

    $scope.cancel = function () {
        //moalName, title, content, yesFunc
        var confirm = $scope.accelaConfirm(null, 'Cancel Inspection', 'Are you sure you want to cancel this inspection?', $scope.yesFunc);
    }


    $scope.yesFunc = function () {
        ApiService.ApiRequest.delete({ url: "/inspections/" + $routeParams.id + "/cancel/" }, function (data) {
            console.log(" Inspection cancal : " + angular.toJson(data));
            if (data.status == 200) {
                $scope.accelaMessageBox(null, 'Alert', 'Success Count:' + data.result.successCount);
            }
        }, function (error) {
            ////moalName, title, content
            $scope.accelaMessageBox(null, 'Alert', 'Inspection cancal error:' + error.message);
        });
    }



    $scope.createNewDialog = function (action, title, modalId) {
        $("#" + modalId).dialog({
            autoOpen: true,
            width: 750,
            title: title,
            modal: true,
            show: {
                effect: "fade",
                duration: 500
            },
            hide: {
                effect: "fade",
                duration: 500
            }
        });
    }

    $scope.showmodaldialog = function (action, title, modalId, dialogwidth) {
        $("#" + modalId).dialog({ autoOpen: true, title: title, width: dialogwidth });
    }

}]);


