"use strict"
RBUIApp.controller("GetInspectionsCtrl", ["$scope", "$timeout", "ApiService", "MapService", "$filter", function ($scope, $timeout, ApiService, MapService, $filter) {
    $scope.ReadCookie = function (cookieName) {
        cookieName = "pmt" + cookieName;
        var theCookie = " " + document.cookie;
        var ind = theCookie.indexOf(" " + cookieName + "=");
        return ind==-1;
    };

    $scope.SetCookie = function (cookieName, cookieValue, nDays) {
        cookieName = "pmt" + cookieName;
        var today = new Date();
        var expire = new Date();
        if (nDays == null || nDays == 0) nDays = 1;
        expire.setTime(today.getTime() + 3600000 * 24 * nDays);
        document.cookie = cookieName + "=" + escape(cookieValue)
                        + ";expires=" + expire.toGMTString();
    };


    $scope.GetRecentlyViewed = function ()
    {
        //var ss = document.cookie.length;
    };

    $scope.GetRecentlyViewed();


    $scope.SetBorder = function (objid) {
        if (objid != undefined) {
            $("[ng-repeat]").css({ "border-width": "0" });
            $("#" + objid).css({ "border": " 3px solid #005384 " });

           
            $("img").removeClass("mydashboard-disable-img");
            $("img").addClass("mydashboard-disable-img");
            $("#" + objid + " img").removeClass("mydashboard-disable-img");

            $("c").removeClass("mydashboard-disable-img");
            $("c").addClass("mydashboard-disable-img");
            $("#" + objid + " c").removeClass("mydashboard-disable-img");


        }
    };

    $scope.formatdate = function (scourcedate)
    {
        var angularDateFilter = $filter('date');
        var month = angularDateFilter(scourcedate, 'MMM');
        var day = angularDateFilter(scourcedate, 'd');
        var time = angularDateFilter(scourcedate, 'h:mm');
        var ampm = angularDateFilter(scourcedate, 'a');
        day = formatday(day);

        return "" + $filter('uppercase')(month) + " " + day + " <br> " + time + " " + $filter('lowercase')(ampm);
};

    var formatday = function (Day) {
        var engday = "";
        if (Day.lastIndexOf("1")>=1) {
            engday = "st";
        }
        else if (Day.lastIndexOf("2") >= 1) {
            engday = "nd";
        }
        else if (Day.lastIndexOf("3") >= 1) {
            engday = "rd";
        }
        else {
            engday = "th";
        }
      
        return Day + engday;
    };

    $scope.search = function () {
        try {
            $(document).progressDialog.showDialog(' ');
            ApiService.GetInspections.get({ time: Math.random() }, function (data) {
                if (data != null) {
                    // TODO: error
                    if (data.status == 200) {
                        if (data.resultPending != undefined) {
                            $scope.recordList = data.result.concat(data.resultPending);
                        }
                        else
                        {
                            $scope.recordList = data.result;
                        }
                        if ($scope.recordList != undefined)
                        {
                            $scope.totalRows = "(" + $scope.recordList.length + ")";// data.page.totalRows;
                        }
                        $scope.Filed = "-scheduleDate";
                        if ($scope.taskincludeurl == undefined) {
                            $scope.taskincludeurl = "/AppViews/Inspector/MyDashboard/MapList.html";                            
                            $scope.DashboardLoadMap();
                        }
                        $(document).progressDialog.hideDialog();
                        //scrollTo Top;
                        if (api != null) {
                            api.scrollTo(0, 0, null);
                        }
                    }
                }
            }
            , function (error) {
                $(document).progressDialog.hideDialog();
                var WriteLogs = new ApiService.WriteLog();
                $scope.DiagnosticsEntity = {};
                $scope.DiagnosticsEntity.id = 1;
                $scope.DiagnosticsEntity.Type = "Type";
                $scope.DiagnosticsEntity.OccursDateTime =Date();
                $scope.DiagnosticsEntity.User = "User";
                $scope.DiagnosticsEntity.User = "User";
                $scope.DiagnosticsEntity.Module = "Module";
                $scope.DiagnosticsEntity.Function = "Function";
                $scope.DiagnosticsEntity.URL = "URL";
                $scope.DiagnosticsEntity.Summary = "Summary";
                $scope.DiagnosticsEntity.Description = "Description";
                WriteLogs.data = angular.toJson($scope.DiagnosticsEntity);
                WriteLogs.$update({ time: Math.random() }, function (data) {
                   
                });
               $scope.accelaMessageBox(null, 'Alert', 'load error:' + error.message);
            }
            );
        } catch (ex) {
            // TODO
            //jQuery.error("Error: " + ex.message);
        }

    };

    $scope.DashboardLoadMap = function () {
        MapService.Loader().then(function () {
            MapService.CreateMap("mapDiv");
        });
    }

    $scope.MapLocator = function (address, xCoordinator, yCoordinator) {
        MapService.locate(address, xCoordinator, yCoordinator);
    }

    $scope.$on("Research", function (event) { $scope.search(); });


    $scope.showProgressBar = function () {
        $(document).progressDialog.showDialog(' ');
    }
    $scope.search();
    //Set Style;
    $scope.SetSortByClass = function (objid) {
        var arraylist = objid.split(',');
        for (var i = 0; i < arraylist.length; i++) {
            var obj = document.getElementById(arraylist[i]);
            $(obj).removeAttr("class");
            $(obj).removeAttr("style");
            if (i == 0) {
                $(obj).addClass("dashboard-a-active");
            }
            else {
                $(obj).addClass("dashboard-a-disable");
            }
        }
    }
    //Set Style;
    $scope.SetDashboardIconClass = function (objid) {
        var arraylist = objid.split(',');
        for (var i = 0; i < arraylist.length; i++) {
            var obj = document.getElementById(arraylist[i]);
            $(obj).removeAttr("class");
            if (i == 0) {

                $(obj).addClass("btn btn-default no-border mydashboard-tasklist-button-bg");

            }
            else {
                $(obj).addClass("btn btn-default no-border");
            }
        }
    }

}]);

RBUIApp.controller("DashBoardInspectionSummaryCtrl",["$scope", "$cacheFactory", "ApiService", function ($scope, $cacheFactory, ApiService) {
    $scope.LoadSummary = function (SelectedInspectionId, RecordId) {
        $(document).progressDialog.showDialog(' ');
        try {
            var inspectionId = "";
            var recordid = "";
            if (typeof (SelectedInspectionId) == "undefined" || SelectedInspectionId == null) {
                inspectionId = $scope.recordList[0].id;
                recordid = $scope.recordList[0].recordId.id;
            }
            else {
                inspectionId = SelectedInspectionId;
                recordid = RecordId;
            }
            ApiService.GetSummary.get({ id: inspectionId }, function (data) {
                if (data != null) {
                    $scope.inspection = data.result[0];
                    $scope.SetBorder(inspectionId);
                }
            });


            ApiService.ApiRequest.get({ url: "/records/" + recordid + "/owners" }, function (data) {
                if (data.status == 200) {
                    if (data.result != null && data.result.length > 0) {
                        $scope.record = data.result[0];
                        $(document).progressDialog.hideDialog();
                    }
                }
            });

        } catch (ex) {
            // TODO
            //jQuery.error("Error: " + ex.message);
        }

    };

    $scope.LoadSummary($scope.recordList[0].id, $scope.recordList[0].recordId.id);

}]);