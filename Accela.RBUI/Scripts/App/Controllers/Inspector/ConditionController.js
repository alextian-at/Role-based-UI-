"use strict";
RBUIApp.controller("ConditionController", [
    "$scope",
    "$filter",
    "ApiService",
    "$routeParams",
    "$location",
    "InspectionService", "$log",
    function ($scope, $filter, ApiService, $routeParams, $location, InspectionService, $log) {
        $scope.select = { groups: [], types: [], depts: [], users: [], statues: [], severitys: [], groupandtypes: [], statusandseveritys: [] };
        $scope.conditions = [];
        $scope.ErrorMessage = "";
        $scope.alerts = [];
        $scope.conditionHasSelected = false;
        $scope.CurrentCondition = {};
        $scope.EditCondition = {};
        $scope.ModalTitle = "";//$scope.Language.Label.Conditions_EditCondition;
        $scope.gridOptions = {
            columns: [
              { name: "id", checkboxcolumn: true, width: '8%', align: 'center', headerAlign: 'center' },
              { name: "name", title: "Condition name", width: '15%', align: 'center', headerAlign: 'center', sortable: true },
              { name: "type.text", title: "Type", width: '15%', align: 'center', headerAlign: 'center' },
              { name: "status.text", title: "Status", width: '10%', align: 'center', headerAlign: 'center' },
              { name: "severity.text", title: "Severity", width: '10%', align: 'center', headerAlign: 'center' },
              { name: "statusDate", title: "Status Date", width: '14%', align: 'center', headerAlign: 'center', format: [{ date: 'MM-dd-yyyy' }] },
              { name: "effectiveDate", title: "Effective Date", width: '14%', align: 'center', headerAlign: 'center', format: [{ date: 'MM/dd/yyyy' }] }
            ],
            Selectable: true
        };       

        /* grid event */

        $scope.onGridLoad = function () {
            //setTimeout(function () {
                EditConditionInit();
            //},10);
        }
        $scope.onGridRowSelected = function (item) {
            $scope.CurrentCondition = item;
            $scope.conditionHasSelected = true;
            $scope.$apply();
        }

        /* page event */
        $scope.showCreateConditionWindow = function () {
            $scope.ModalTitle = $scope.Language.Label.Conditions_NewCondition;
            $scope.EditCondition = {};
            $scope.EditCondition.inspectionId = $routeParams.id
            $scope.EditCondition.recordId = InspectionService.CurrentInspection.recordId;
            if (!$scope.$$phase)
                $scope.$apply();
        }

        $scope.showEditConditionWindow = function () {
            $scope.ModalTitle = $scope.Language.Label.Conditions_EditCondition;
            $scope.EditCondition = {};
            $scope.EditCondition = angular.copy($scope.CurrentCondition);
            $scope.EditCondition.group = getEditObjectSelectValue("groups", "group");
            $scope.GroupChange();
            $scope.EditCondition.status = getEditObjectSelectValue("statuses", "status");
            $scope.StatusChange();
            $scope.EditCondition.appliedbyDepartment = getEditObjectSelectValue("depts", "appliedbyDepartment");
            $scope.AppliedDeptChange(false,true);

            $scope.EditCondition.serviceProviderCode = InspectionService.CurrentInspection.recordId.serviceProviderCode;
            console.log(" show edit " + angular.toJson($scope.EditCondition));
            if (!$scope.$$phase)
                $scope.$apply();
        }

        // create and  update
        $scope.ConditionSave = function () {
            if ($scope.EditCondition.id && $scope.EditCondition.id != "") {//edit
                var updateCondition = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id + "/conditions/" + $scope.EditCondition.id, });
                var tmpId = $scope.EditCondition.id;
                delete $scope.EditCondition.id;
                updateCondition.data = angular.toJson($scope.EditCondition);
                updateCondition.$update(function (data) {
                    console.log(" edited " + angular.toJson(data));
                    $scope.CloseConditionModal();
                    if (data.status == 200) {
                        $scope.EditCondition.id = tmpId;
                        for (var i in $scope.conditions) {
                            if ($scope.conditions[i].id == tmpId) {
                                $scope.CurrentCondition = $scope.conditions[i] = angular.copy($scope.EditCondition);
                                break;
                            }
                        }
                        $scope.setNGGridSelectItem($scope.CurrentCondition);
                        //var tmp = $filter("filter")($scope.conditions, { id: tmpId });
                        //if (tmp.length > 0)
                        //    tmp = tmp[0];

                        //if (tmp) {
                        //    tmp = $scope.EditCondition;
                        //}
                        //getConditionDatas();//get condition datas
                    }
                });
            } else {//add
                var newCondition = new ApiService.ApiRequest({ url: "/inspections/" + $routeParams.id + "/conditions" });
                newCondition.data = angular.toJson([$scope.EditCondition]);
                newCondition.$save(function (data) {
                    console.log(" created " + angular.toJson(data));
                    $scope.CloseConditionModal();
                    if (data.status == 200 && data.result && data.result.successCount && data.result.successCount > 0) {
                        $scope.EditCondition.id = getNewIdByCreateReturn(data);
                        $scope.CurrentCondition = angular.copy($scope.EditCondition);
                        $scope.conditions.push($scope.CurrentCondition);
                        $scope.setNGGridSelectItem($scope.CurrentCondition);
                        console.log("created editcondition id:" + $scope.EditCondition.id);
                        //getConditionDatas();//get condition datas
                    }
                });
            }
        }
        //delete
        $scope.ConditionDelete = function () {
            var checkItems = $scope.getNGGridCheckedItems()
            if (checkItems.length > 0) {
                var ids = "", idsTag = "";
                for (var i in checkItems) {
                    ids += idsTag + checkItems[i].id;
                    idsTag = ",";
                }
                ApiService.ApiRequest.delete({ url: "/inspections/" + $routeParams.id + "/conditions/" + ids }, function (data) {
                    console.log(" condition delete : " + angular.toJson(data));
                    if (data.status == 200) {
                        $scope.alerts.push({ type: 'success', msg: checkItems.length + $scope.Language.Label.Conditions_recordsdeletedsuccessfully });
                        getConditionDatas();
                    }
                });
            } else {
                $scope.alerts.push({ type: 'danger', msg: $scope.Language.Label.Conditions_Pleaseselectarecordtodelete });
            }
        }

        //depts select change
        $scope.AppliedDeptChange = function (setCurrent, isInit) {
            if (!isInit)
                $scope.EditCondition.appliedbyUser = null
            if ($scope.EditCondition.appliedbyDepartment) {
                $scope.select.users = [];
                ApiService.ApiRequest.get({ url: "/settings/departments/" + $scope.EditCondition.appliedbyDepartment.id + "/staffs" }, function (data) {
                    if (data.status == 200) {
                        for (var i in data.result) {
                            $scope.select.users.push({ text: data.result[i].fullName, value: data.result[i].value });
                        }
                        if (setCurrent==true) {
                            $scope.EditCondition.appliedbyUser = $scope.select.users.length > 0 ? $scope.select.users[0] : null;
                        } else {   
                                $scope.EditCondition.appliedbyUser = getEditObjectSelectValue("users", "appliedbyUser");
                        }
                    }
                }, function (error) {

                });
            } else {
                $scope.EditCondition.appliedbyUser = null;
                $scope.select.users = null;
            }
        }
        //status change
        $scope.StatusChange = function () {
            console.log(" edit status " + angular.toJson($scope.EditCondition.status));
            if ($scope.EditCondition.status) {
                var tmpStatus = $filter("filter")($scope.select.statusandseveritys, { value: $scope.EditCondition.status.value });
                $scope.select.severitys = (tmpStatus && tmpStatus.length) > 0 ? tmpStatus[0].severity : null;
                $scope.EditCondition.severity = getEditObjectSelectValue("severitys", "severity");
            } else {
                $scope.select.severitys = null;
                $scope.EditCondition.severity = null;
            }
        };

        //group change
        $scope.GroupChange = function () {
            if ($scope.EditCondition.group) {
                var tmpTypes = [];
                for (var i in $scope.select.groupandtypes) {
                    if ($scope.select.groupandtypes[i].groups && $scope.select.groupandtypes[i].groups.length > 0) {
                        if ($filter("filter")($scope.select.groupandtypes[i].groups, { value: $scope.EditCondition.group.value }).length > 0) {
                            tmpTypes.push($scope.select.groupandtypes[i]);
                        }
                    }
                }
                $scope.select.types = $scope.formatSelectValue(tmpTypes);
                $scope.EditCondition.type = getEditObjectSelectValue("types", "type");
            } else {
                $scope.EditCondition.type = null;
                $scope.select.types = null;
            }
        }

        $scope.CurrentDeptAndUser = function () {
            if ($scope.select.depts.length > 0) {
                $scope.EditCondition.appliedbyDepartment = $scope.select.depts[0];
                $scope.AppliedDeptChange(true);
            }
        }       

        $scope.OpenStandardConditionModal = function () {
            $scope.$broadcast('OpenModal', { name: "StandardConditionModal", width: "700px", title: "Insert Standard Condition" });
        }

        $scope.submit = function () {

        }

        $scope.CloseConditionModal = function () {
            $scope.$broadcast('CloseModal', { name: "EditCondition" });
        }

        $scope.OpenDialog = function (action, title, modalId, dialogwidth) {
            $scope.$broadcast('OpenModal', { name: "EditCondition", width: "700px", title: title });
        };

        $scope.OpenStandardCommentsModal = function () {
            $scope.$broadcast('OpenModal', { name: "standardComment", width: "800px", title: "Standard Comments" });
        }

        $scope.onModalClose = function (name, result) {
            if (name === "standardComment") {
                if (result) {
                    if (!$scope.EditCondition.longComments)
                        $scope.EditCondition.longComments = "";
                    $scope.EditCondition.longComments += $scope.EditCondition.longComments == "" ? result : "\r\n" + result;
                }
            }
        }

        //get condition datas
        var getConditionDatas = function () {
            ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/conditions" }, function (data) {
                $(document).progressDialog.hideDialog('');
                if (data.status == 200) {
                    if (data.result) {
                        $scope.conditionHasSelected = false;
                        $scope.conditions = data.result;
                        $scope.setNGGridPageItems($scope.conditions);
                    }
                }
            }, requestError);
        }

        var getConditionById = function (id) {
            try {
                ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/conditions/" + id }, function (data) {
                    $(document).progressDialog.hideDialog('');
                    if (data.status == 200) {
                        if (data.result) {
                            $scope.conditions.push(data.result[0]);
                            //$scope.setNGGridPageItems($scope.conditions);
                        }
                    }
                }, requestError);
            } catch (e) {

            }
        }

        var getNewIdByCreateReturn = function (data) {
            var id = "";
            if (data.result.successIDs && data.result.successIDs.length > 0)
                id = data.result.successIDs[0].subStr(data.result.successIDs[0].lastIndexOf("-"));
            return id;
        }

        var EditConditionInit = function () {
            $(document).progressDialog.showDialog('');
            //Departments
            ApiService.ApiRequest.get({ url: "/settings/departments" }, function (data) {
                // condition status 
                ApiService.ApiRequest.get({ url: "/settings/conditions/statuses" }, function (data) {
                    // condition type
                    ApiService.ApiRequest.get({ url: "/settings/conditions/types" }, function (data) {
                        getConditionDatas();
                        if (data.status == 200) {
                            var tmpGroups = [];
                            for (var i in data.result) {
                                if (data.result[i].groups.length > 0) {
                                    tmpGroups = tmpGroups.concat(data.result[i].groups);
                                }
                            }
                            $scope.select.groups = $filter("unique")(tmpGroups, "value");
                            $scope.select.groupandtypes = data.result;

                        }
                    }, requestError);
                    if (data.status == 200) {
                        $scope.select.statuses = $scope.formatSelectValue(data.result);
                        $scope.select.statusandseveritys = data.result;
                    }
                }, requestError);

                if (data.status == 200) {
                    for (var i in data.result) {
                        $scope.select.depts.push({
                            text: data.result[i].text, value: data.result[i].value, id: data.result[i].id
                        });
                    }
                }
            }, requestError);
        }

        var requestError = function (error) {
            $(document).progressDialog.hideDialog('');
        }

        var getEditObjectSelectValue = function (valuesFieldname, destFieldname) {
            var reArray = [];
            if ($scope.EditCondition[destFieldname] != null
                && angular.isDefined($scope.EditCondition[destFieldname])
                && angular.isDefined($scope.EditCondition[destFieldname].value)) {
                reArray = $filter('filter')($scope.select[valuesFieldname], { value: $scope.EditCondition[destFieldname].value });
            }
            return (reArray && reArray.length) > 0 ? reArray[0] : null;
        }

        $scope.formatSelectValue = function (array) {
            array = $filter("orderBy")(array, "text")
            var returns = [];
            for (var i in array) {
                returns.push({ value: array[i].value, text: array[i].text });
            }
            return returns;
        }
    }]).controller("StandardConditionController", ["$scope","$filter", function ($scope,$filter) {

        $scope.StandardGroup = null;
        $scope.StandardType = null;
        $scope.StandardName = null;

        $scope.gridOptions = {
            columns: [
                 { name: "group.text", title: "Group", width: '20%', align: 'center', headerAlign: 'center' },
                  { name: "type.text", title: "Type", width: '20%', align: 'center', headerAlign: 'center' },
                { name: "name", title: "Name", width: '20%', align: 'center', headerAlign: 'center' },
                { name: "comment", title: "Comment", width: '20%', align: 'center', headerAlign: 'center' },
                { name: "severity.text", title: "Severity", width: '20%', align: 'center', headerAlign: 'center' }
            ],
            Selectable: true
        };

        $scope.standardselect = {
            groupandtypes:[],
            groups: [],
            types:[]
        };

        $scope.StandardGroupChange = function () {
            bindStandardType();
        }

        $scope.StandardSearch = function () {

        };

        $scope.$watch("select.groupandtypes", function () {            
            if ($scope.select.groupandtypes.length > 0) {
                console.log(" standard grou and type value change!!!! " + $scope.select.groupandtypes);
                $scope.standardselect.groupandtypes = $scope.select.groupandtypes;
                bindStandardGroup();
            }
        },true)

        var bindStandardGroup = function () {
            var tmpGroups = [];
            for (var i in $scope.standardselect.groupandtypes) {
                if ($scope.standardselect.groupandtypes[i].groups.length > 0) {
                    tmpGroups = tmpGroups.concat($scope.standardselect.groupandtypes[i].groups);
                }
            }
            $scope.standardselect.groups = $filter("unique")(tmpGroups, "value");
        }
        var bindStandardType = function () {
            if ($scope.StandardGroup!=null) {
                var tmpTypes = [];
                for (var i in $scope.standardselect.groupandtypes) {
                    if ($scope.standardselect.groupandtypes[i].groups && $scope.standardselect.groupandtypes[i].groups.length > 0) {
                        if ($filter("filter")($scope.standardselect.groupandtypes[i].groups, { value: $scope.StandardGroup.value }).length > 0) {
                            tmpTypes.push($scope.standardselect.groupandtypes[i]);
                        }
                    }
                }
                $scope.standardselect.types = $scope.formatSelectValue(tmpTypes);
                $scope.StandardType = null;
            } else {
                $scope.StandardType= null;
                $scope.standardselect.types = null;
            }
        }
    }]);